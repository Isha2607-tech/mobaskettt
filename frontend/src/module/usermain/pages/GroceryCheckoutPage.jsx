import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Wallet,
  Clock,
  ShoppingBag,
  Home,
  Heart,
  Menu,
  ChefHat,
  ChevronRight,
  AlertCircle,
  Truck,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../user/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../user/context/ProfileContext";
import { useLocation as useUserLocation } from "../../user/hooks/useLocation";
import { useZone } from "../../user/hooks/useZone";
import { adminAPI, orderAPI, restaurantAPI, userAPI } from "@/lib/api";
import { initRazorpayPayment } from "@/lib/utils/razorpay";
import { toast } from "sonner";

export default function GroceryCheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, isGroceryItem } = useCart();
  const { getDefaultAddress, userProfile } = useProfile();
  const { location: liveLocation } = useUserLocation();
  const { zoneId } = useZone(liveLocation, "mogrocery");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("now");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("");
  const [feeSettings, setFeeSettings] = useState({
    deliveryFee: 25,
    deliveryFeeRanges: [],
    freeDeliveryThreshold: 149,
    platformFee: 5,
    gstRate: 5,
  });
  const [calculatedPricing, setCalculatedPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [resolvedRestaurant, setResolvedRestaurant] = useState(null);
  const [hasActivePlanSubscription, setHasActivePlanSubscription] = useState(false);

  // Filter grocery items
  const groceryItems = cart.filter((item) => isGroceryItem(item));
  const groceryItemsKey = useMemo(
    () =>
      groceryItems
        .map((item) => `${item?.id || item?._id || ""}:${item?.quantity || 0}:${item?.restaurantId || ""}`)
        .join("|"),
    [groceryItems],
  );

  const deliveryAddress =
    "Select delivery address";

  const selectedAddress = useMemo(() => {
    const defaultAddress = getDefaultAddress();
    if (defaultAddress) {
      return defaultAddress;
    }

    if (liveLocation?.latitude && liveLocation?.longitude) {
      return {
        label: "Home",
        street: liveLocation.street || liveLocation.address || "",
        additionalDetails: liveLocation.area || "",
        city: liveLocation.city || "",
        state: liveLocation.state || "",
        zipCode: liveLocation.postalCode || liveLocation.zipCode || "",
        formattedAddress: liveLocation.formattedAddress || liveLocation.address || "",
        location: {
          coordinates: [liveLocation.longitude, liveLocation.latitude],
        },
      };
    }

    return null;
  }, [getDefaultAddress, liveLocation]);

  const formattedDeliveryAddress = useMemo(() => {
    if (!selectedAddress) return deliveryAddress;
    if (selectedAddress.formattedAddress) return selectedAddress.formattedAddress;

    const parts = [
      selectedAddress.street,
      selectedAddress.additionalDetails,
      selectedAddress.city,
      selectedAddress.state,
      selectedAddress.zipCode,
    ].filter(Boolean);

    return parts.join(", ") || deliveryAddress;
  }, [selectedAddress]);
  const selectedAddressKey = useMemo(() => {
    if (!selectedAddress) return "none";
    const coords = selectedAddress?.location?.coordinates || [];
    return [
      selectedAddress.formattedAddress || "",
      selectedAddress.street || "",
      selectedAddress.city || "",
      selectedAddress.state || "",
      selectedAddress.zipCode || "",
      coords[0] || "",
      coords[1] || "",
    ].join("|");
  }, [selectedAddress]);

  const itemsTotal = groceryItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0,
  );
  const subtotal = groceryItems.reduce(
    (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)),
    0,
  );
  const totalSavings = itemsTotal - subtotal;
  const cartRestaurantId = groceryItems[0]?.restaurantId;
  const cartRestaurantName = groceryItems[0]?.restaurant || "MoGrocery";

  useEffect(() => {
    const fetchFeeSettings = async () => {
      try {
        const response = await adminAPI.getPublicFeeSettings("mogrocery");
        const settings = response?.data?.data?.feeSettings || response?.data?.feeSettings || {};
        setFeeSettings((prev) => ({
          ...prev,
          deliveryFee: Number(settings.deliveryFee ?? prev.deliveryFee),
          deliveryFeeRanges: Array.isArray(settings.deliveryFeeRanges)
            ? settings.deliveryFeeRanges
            : prev.deliveryFeeRanges,
          freeDeliveryThreshold: Number(settings.freeDeliveryThreshold ?? prev.freeDeliveryThreshold),
          platformFee: Number(settings.platformFee ?? prev.platformFee),
          gstRate: Number(settings.gstRate ?? prev.gstRate),
        }));
      } catch (error) {
        console.error("Failed to fetch grocery fee settings:", error);
      }
    };

    fetchFeeSettings();
  }, []);

  const resolveGroceryRestaurant = useCallback(async () => {
    if (resolvedRestaurant?.restaurantId) {
      return resolvedRestaurant;
    }

    if (cartRestaurantId && cartRestaurantId !== "grocery-store") {
      const resolved = { restaurantId: cartRestaurantId, restaurantName: cartRestaurantName };
      setResolvedRestaurant((prev) =>
        prev?.restaurantId === resolved.restaurantId && prev?.restaurantName === resolved.restaurantName
          ? prev
          : resolved,
      );
      return resolved;
    }

    const restaurantsResponse = await restaurantAPI.getRestaurants({ limit: 200 });
    const restaurants = restaurantsResponse?.data?.data?.restaurants || [];
    const groceryStores = restaurants.filter((r) => r?.platform === "mogrocery" && r?.isActive);

    if (!groceryStores.length) {
      throw new Error("No active stores found. Please try again.");
    }

    const groceryLikeStore =
      groceryStores.find((r) => /grocery|mart|basket/i.test(r?.name || "")) || groceryStores[0];

    const resolvedRestaurantId = groceryLikeStore?._id || groceryLikeStore?.restaurantId;
    if (!resolvedRestaurantId) {
      throw new Error("Unable to resolve store for checkout.");
    }

    const resolved = {
      restaurantId: resolvedRestaurantId,
      restaurantName: groceryLikeStore?.name || cartRestaurantName,
    };
    setResolvedRestaurant((prev) =>
      prev?.restaurantId === resolved.restaurantId && prev?.restaurantName === resolved.restaurantName
        ? prev
        : resolved,
    );
    return resolved;
  }, [cartRestaurantId, cartRestaurantName, resolvedRestaurant]);

  const buildOrderItems = () =>
    groceryItems.map((item) => ({
      itemId: String(item.id || item._id || item.itemId || item.productId || ""),
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
      description: item.description || "",
      isVeg: item.isVeg !== false,
    }));

  useEffect(() => {
    const resolveRestaurantForPreview = async () => {
      if (!groceryItems.length) {
        setResolvedRestaurant((prev) => (prev ? null : prev));
        return;
      }
      try {
        await resolveGroceryRestaurant();
      } catch (error) {
        console.error("Failed to resolve grocery store for preview:", error);
      }
    };

    resolveRestaurantForPreview();
  }, [groceryItemsKey, resolveGroceryRestaurant]);

  useEffect(() => {
    const calculatePricingPreview = async () => {
      if (!groceryItems.length || !selectedAddress || !resolvedRestaurant?.restaurantId) {
        setLoadingPricing(false);
        setCalculatedPricing(null);
        return;
      }

      try {
        setLoadingPricing(true);
        const response = await orderAPI.calculateOrder({
          items: buildOrderItems(),
          restaurantId: resolvedRestaurant.restaurantId,
          deliveryAddress: selectedAddress,
          deliveryFleet: "standard",
          platform: "mogrocery",
          zoneId: zoneId || undefined,
        });
        setCalculatedPricing(response?.data?.data?.pricing || null);
      } catch (error) {
        console.error("Failed to calculate grocery pricing preview:", error);
        setCalculatedPricing(null);
      } finally {
        setLoadingPricing(false);
      }
    };

    calculatePricingPreview();
  }, [groceryItemsKey, selectedAddressKey, resolvedRestaurant?.restaurantId, zoneId]);

  const showPricingLoading = loadingPricing && !calculatedPricing;

  const resolveDeliveryFeeFromRanges = (orderSubtotal, ranges, fallbackDeliveryFee, freeThreshold) => {
    const sortedRanges = Array.isArray(ranges)
      ? [...ranges].sort((a, b) => Number(a?.min || 0) - Number(b?.min || 0))
      : [];

    const matchingRange = sortedRanges.find((range) => {
      const min = Number(range?.min ?? 0);
      const max = Number(range?.max ?? Number.MAX_SAFE_INTEGER);
      return orderSubtotal >= min && orderSubtotal <= max;
    });

    if (matchingRange) return Math.max(0, Number(matchingRange?.fee ?? 0));
    if (orderSubtotal >= Number(freeThreshold ?? 149)) return 0;
    return Math.max(0, Number(fallbackDeliveryFee ?? 25));
  };

  const fallbackDeliveryFee = resolveDeliveryFeeFromRanges(
    subtotal,
    feeSettings?.deliveryFeeRanges,
    feeSettings?.deliveryFee,
    feeSettings?.freeDeliveryThreshold,
  );
  const fallbackPlatformFee = Number(feeSettings?.platformFee ?? 5);
  const fallbackTax = Math.max(0, subtotal * (Number(feeSettings?.gstRate ?? 5) / 100));
  const summaryDeliveryFee = Number(calculatedPricing?.deliveryFee ?? fallbackDeliveryFee);
  const summaryPlatformFee = Number(calculatedPricing?.platformFee ?? fallbackPlatformFee);
  const summaryTax = Number(calculatedPricing?.tax ?? fallbackTax);
  const planDiscountAmount = Number(calculatedPricing?.breakdown?.planDiscountAmount ?? 0);
  const appliedPlanBenefits = calculatedPricing?.appliedPlanBenefits || null;
  const appliedPlanName = String(calculatedPricing?.appliedPlanBenefits?.planName || "").trim();
  const hasPlanDiscount = planDiscountAmount > 0;
  const isMoGoldPlanApplied = hasPlanDiscount && /mogold/i.test(appliedPlanName || "");
  const hasPlanBenefits = Boolean(hasActivePlanSubscription || appliedPlanBenefits || hasPlanDiscount);
  const planBenefitsList = useMemo(() => {
    const items = [];
    const bestOfferName = String(appliedPlanBenefits?.bestDiscountOffer?.name || "").trim();
    const hasFreeDelivery = Boolean(appliedPlanBenefits?.freeDelivery);
    const hasDiscountOffer = Boolean(appliedPlanBenefits?.discount > 0 || hasPlanDiscount);

    if (hasFreeDelivery) {
      items.push("Free delivery applied");
    } else if (hasActivePlanSubscription) {
      items.push("Free delivery available on eligible orders");
    }

    if (hasDiscountOffer) {
      items.push(`Extra plan discount applied: Rs ${planDiscountAmount.toFixed(2)}`);
    } else if (hasActivePlanSubscription) {
      items.push("Plan discounts will auto-apply on eligible products");
    }

    if (bestOfferName) {
      items.push(`Active offer: ${bestOfferName}`);
    }

    if (appliedPlanBenefits?.expiresAt) {
      const expiryDate = new Date(appliedPlanBenefits.expiresAt);
      if (!Number.isNaN(expiryDate.getTime())) {
        items.push(`Valid till ${expiryDate.toLocaleDateString("en-IN")}`);
      }
    }

    if (!items.length && hasActivePlanSubscription) {
      items.push("Your plan is active and benefits will auto-apply");
    }

    return items;
  }, [appliedPlanBenefits, hasActivePlanSubscription, hasPlanDiscount, planDiscountAmount]);
  const grandTotal = Number(
    calculatedPricing?.total ??
      subtotal + summaryDeliveryFee + summaryPlatformFee + summaryTax - Number(calculatedPricing?.discount ?? 0),
  );
  const hasSufficientWalletBalance = walletBalance >= grandTotal;

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const response = await userAPI.getWallet();
        const balance =
          response?.data?.data?.wallet?.balance ??
          response?.data?.wallet?.balance ??
          response?.data?.data?.balance ??
          0;
        setWalletBalance(Number(balance || 0));
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchActivePlanStatus = async () => {
      try {
        const response = await orderAPI.getOrders({ page: 1, limit: 200 });
        const orders =
          response?.data?.data?.orders ||
          response?.data?.orders ||
          (Array.isArray(response?.data?.data) ? response.data.data : []);

        const now = new Date();
        const hasActive = (Array.isArray(orders) ? orders : []).some((order) => {
          if (!order?.planSubscription?.planId) return false;
          if (String(order?.payment?.status || "").toLowerCase() !== "completed") return false;
          if (String(order?.status || "").toLowerCase() === "cancelled") return false;

          const purchasedAt = order?.deliveredAt || order?.createdAt;
          const durationDays = Number(order?.planSubscription?.durationDays || 0);
          if (!purchasedAt || durationDays <= 0) return false;

          const expiresAt = new Date(new Date(purchasedAt).getTime() + durationDays * 24 * 60 * 60 * 1000);
          return expiresAt > now;
        });

        if (isMounted) {
          setHasActivePlanSubscription(hasActive);
        }
      } catch {
        if (isMounted) {
          setHasActivePlanSubscription(false);
        }
      }
    };

    fetchActivePlanStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    if (!groceryItems.length) {
      toast.error("Your grocery cart is empty.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please add/select a delivery address first.");
      return;
    }
    if (deliveryOption === "schedule" && !scheduledTime) {
      toast.error("Please select a delivery time slot.");
      return;
    }
    if (paymentMethod === "wallet") {
      if (walletLoading) {
        toast.info("Checking wallet balance. Please wait.");
        return;
      }
      if (!hasSufficientWalletBalance) {
        toast.error("Insufficient wallet balance. Add money or choose another payment method.");
        return;
      }
    }

    setIsPlacingOrder(true);
    try {
      const { restaurantId, restaurantName } = await resolveGroceryRestaurant();
      const items = buildOrderItems();
      const invalidItem = items.find((i) => !i.itemId || !i.name || !Number.isFinite(i.price) || i.quantity <= 0);
      if (invalidItem) {
        throw new Error("Cart item data is invalid. Please refresh grocery cart and try again.");
      }

      const pricingResponse = await orderAPI.calculateOrder({
        items,
        restaurantId,
        deliveryAddress: selectedAddress,
        deliveryFleet: "standard",
        platform: "mogrocery",
      });
      const calculatedPricing = pricingResponse?.data?.data?.pricing;
      if (!calculatedPricing?.total) {
        throw new Error("Failed to calculate order pricing.");
      }

      const scheduleNote =
        deliveryOption === "schedule"
          ? `Scheduled delivery: ${scheduledDate.toLocaleDateString("en-IN")} ${scheduledTime}`
          : "Deliver now";

      const computeScheduledForISO = () => {
        if (deliveryOption !== "schedule" || !scheduledTime || !(scheduledDate instanceof Date)) {
          return null;
        }

        // Example slot: "09:00 AM - 11:00 AM" -> start time "09:00 AM"
        const slotStart = String(scheduledTime).split("-")[0]?.trim();
        const match = slotStart?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;

        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const meridiem = match[3].toUpperCase();

        if (meridiem === "PM" && hours !== 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;

        const scheduled = new Date(scheduledDate);
        scheduled.setHours(hours, minutes, 0, 0);
        if (Number.isNaN(scheduled.getTime())) return null;
        return scheduled.toISOString();
      };

      const scheduledFor = computeScheduledForISO();

      const backendPaymentMethod =
        paymentMethod === "cash"
          ? "cash"
          : paymentMethod === "wallet"
            ? "wallet"
            : "razorpay";

      const orderPayload = {
        items,
        address: selectedAddress,
        restaurantId,
        restaurantName,
        pricing: calculatedPricing,
        deliveryFleet: "standard",
        note: `[MoGrocery] ${scheduleNote}`,
        sendCutlery: false,
        paymentMethod: backendPaymentMethod,
        zoneId: zoneId || undefined,
        deliveryOption: deliveryOption === "schedule" ? "schedule" : "now",
        scheduledFor: scheduledFor || undefined,
        deliveryTimeSlot: deliveryOption === "schedule" ? scheduledTime : undefined,
      };

      const orderResponse = await orderAPI.createOrder(orderPayload);
      const { order, razorpay } = orderResponse?.data?.data || {};
      const orderIdentifier = order?.orderId || order?.id;

      if (backendPaymentMethod === "cash" || backendPaymentMethod === "wallet") {
        clearCart();
        if (backendPaymentMethod === "wallet") {
          setWalletBalance((prev) => Math.max(0, prev - Number(calculatedPricing?.total || 0)));
        }
        toast.success("Order placed successfully.");
        navigate(`/orders/${orderIdentifier}?confirmed=true`);
        return;
      }

      if (!razorpay?.orderId || !razorpay?.key) {
        throw new Error("Online payment initialization failed.");
      }

      await new Promise((resolve, reject) => {
        initRazorpayPayment({
          key: razorpay.key,
          amount: razorpay.amount,
          currency: razorpay.currency,
          order_id: razorpay.orderId,
          name: "MoBasket Grocery",
          description: `Payment for order ${order?.orderId || ""}`.trim(),
          prefill: {
            name: userProfile?.name || "",
            email: userProfile?.email || "",
            contact: (userProfile?.phone || "").replace(/\D/g, "").slice(-10),
          },
          notes: {
            orderId: order?.orderId || order?.id || "",
          },
          handler: async (response) => {
            try {
              await orderAPI.verifyPayment({
                orderId: order?.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              clearCart();
              toast.success("Payment successful. Order confirmed.");
              navigate(`/orders/${orderIdentifier}?confirmed=true`);
              resolve();
            } catch (verifyError) {
              reject(
                new Error(
                  verifyError?.response?.data?.message || "Payment verification failed.",
                ),
              );
            }
          },
          onError: (error) =>
            reject(new Error(error?.description || error?.message || "Payment failed.")),
          onClose: () => reject(new Error("Payment cancelled.")),
        }).catch(reject);
      });
    } catch (error) {
      console.error("Grocery order create error:", {
        status: error?.response?.status,
        backendMessage: error?.response?.data?.message,
        errorMessage: error?.message,
      });
      toast.error(error?.response?.data?.message || error?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefce8] dark:bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] sticky top-0 z-50 rounded-b-3xl shadow-sm border-b border-transparent dark:border-gray-800">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-yellow-50 dark:hover:bg-[#1f1f1f] rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-100" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="px-4 py-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-50 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="bg-[#facd01] rounded-lg p-2">
              <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                Delivery Address
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{formattedDeliveryAddress}</p>
              <button
                onClick={() => navigate("/profile/addresses")}
                className="text-yellow-700 text-xs font-bold mt-2 hover:underline"
              >
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-50 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-50 dark:border-gray-800 pb-2">
            Order Items
          </h3>
          <div className="space-y-3">
            {groceryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-50 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-50 dark:border-gray-800 pb-2">
            Order Summary
          </h3>
          {isMoGoldPlanApplied && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-100 p-3 mb-3"
            >
              <motion.div
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 bg-white/35 blur-sm"
                animate={{ x: ["0%", "280%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                    className="w-8 h-8 rounded-full bg-yellow-400/90 text-yellow-900 flex items-center justify-center shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <div>
                    <p className="text-[11px] font-black text-yellow-900 tracking-wide">MoGold Plan Applied</p>
                    <p className="text-[10px] text-yellow-800">Exclusive plan savings unlocked</p>
                  </div>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.07, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.8 }}
                  className="text-sm font-black text-green-700"
                >
                  -Rs {planDiscountAmount.toFixed(2)}
                </motion.span>
              </div>
            </motion.div>
          )}
          {hasPlanBenefits && planBenefitsList.length > 0 && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-3 mb-3">
              <p className="text-[11px] font-black text-yellow-900 tracking-wide">
                {appliedPlanName || "Active Plan Benefits"}
              </p>
              <div className="mt-2 space-y-1">
                {planBenefitsList.map((benefit, index) => (
                  <p key={`${benefit}-${index}`} className="text-[11px] text-yellow-900">
                    • {benefit}
                  </p>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">
                {showPricingLoading ? "Calculating..." : `Rs ${subtotal.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">
                {showPricingLoading
                  ? "Calculating..."
                  : summaryDeliveryFee > 0
                    ? `Rs ${summaryDeliveryFee.toFixed(2)}`
                    : "FREE"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Platform Fee</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">
                {showPricingLoading ? "Calculating..." : `Rs ${summaryPlatformFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">GST & Taxes</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">
                {showPricingLoading ? "Calculating..." : `Rs ${summaryTax.toFixed(2)}`}
              </span>
            </div>
            {hasPlanDiscount && (
              <div className="flex items-center justify-between text-sm rounded-lg bg-green-50 border border-green-100 px-2.5 py-2">
                <span className="text-green-700 font-semibold">
                  {appliedPlanName ? `${appliedPlanName} discount` : "Plan discount"}
                </span>
                <span className="text-green-700 font-bold">
                  -Rs {planDiscountAmount.toFixed(2)}
                </span>
              </div>
            )}
            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Savings</span>
                <span className="text-yellow-700 font-bold">
                  -Rs {totalSavings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-gray-900 dark:text-gray-100">
                  Grand Total
                </span>
                <span className="text-xl font-black text-gray-900 dark:text-gray-100">
                  {showPricingLoading ? "Calculating..." : `Rs ${grandTotal.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-50 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              Delivery Options
            </h3>
          </div>
          {/* Delivery Options Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setDeliveryOption("now")}
              className={`flex-1 py-3 px-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between group ${deliveryOption === "now"
                ? "border-[#facd01] bg-yellow-50 text-gray-900"
                : "border-gray-100 bg-white text-gray-400"
                }`}
            >
              <div className="flex flex-col items-start">
                <span>Deliver Now</span>
                <span className="text-[10px] font-medium opacity-60">
                  8-12 mins
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryOption === "now"
                  ? "border-[#facd01] bg-[#facd01]"
                  : "border-gray-300"
                  }`}
              >
                {deliveryOption === "now" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => setDeliveryOption("schedule")}
              className={`flex-1 py-3 px-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between group ${deliveryOption === "schedule"
                ? "border-[#facd01] bg-yellow-50 text-gray-900"
                : "border-gray-100 bg-white text-gray-400"
                }`}
            >
              <div className="flex flex-col items-start">
                <span>Schedule</span>
                <span className="text-[10px] font-medium opacity-60">
                  Select time
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryOption === "schedule"
                  ? "border-[#facd01] bg-[#facd01]"
                  : "border-gray-300"
                  }`}
              >
                {deliveryOption === "schedule" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>

          {/* Schedule Picker */}
          <AnimatePresence>
            {deliveryOption === "schedule" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-2 border-t border-dashed border-gray-100">
                  {/* Date Selection with Calendar Icon */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      Select Date
                    </p>
                    <div className="relative">
                      <button
                        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:border-[#facd01] transition-colors"
                        onClick={() => document.getElementById("date-picker").showPicker()}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-50 p-2 rounded-lg text-yellow-700">
                            <CalendarDays size={18} />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
                            <span className="text-sm font-bold text-gray-900">
                              {scheduledDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      <input
                        id="date-picker"
                        type="date"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-[-1]"
                        value={
                          !isNaN(scheduledDate.getTime())
                            ? scheduledDate.toISOString().split("T")[0]
                            : ""
                        }
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (!isNaN(date.getTime())) {
                            setScheduledDate(date);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      Select Time Slot
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "09:00 AM - 11:00 AM",
                        "11:00 AM - 01:00 PM",
                        "02:00 PM - 04:00 PM",
                        "04:00 PM - 06:00 PM",
                        "06:00 PM - 08:00 PM",
                      ].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setScheduledTime(slot)}
                          className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${scheduledTime === slot
                            ? "border-[#facd01] bg-yellow-50 text-gray-900"
                            : "border-gray-100 bg-white text-gray-600 hover:border-orange-200"
                            }`}
                        >
                          {slot.replace(" - ", "\nto\n")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-50 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-50 dark:border-gray-800 pb-2">
            Payment Method
          </h3>
          <div className="space-y-2 mt-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${paymentMethod === "card"
                ? "border-[#facd01] bg-yellow-50/50"
                : "border-gray-100 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${paymentMethod === "card" ? "bg-[#facd01] text-gray-900" : "bg-gray-100 text-gray-400"}`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <span
                  className={`text-sm font-bold ${paymentMethod === "card" ? "text-gray-900" : "text-gray-500"}`}
                >
                  Credit/Debit Card
                </span>
              </div>
              {paymentMethod === "card" && (
                <div className="w-4 h-4 rounded-full bg-[#facd01] border-4 border-white shadow-sm ring-1 ring-[#facd01]"></div>
              )}
            </button>
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${paymentMethod === "wallet"
                ? "border-[#facd01] bg-yellow-50/50"
                : "border-gray-100 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${paymentMethod === "wallet" ? "bg-[#facd01] text-gray-900" : "bg-gray-100 text-gray-400"}`}
                >
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span
                    className={`block text-sm font-bold ${paymentMethod === "wallet" ? "text-gray-900" : "text-gray-500"}`}
                  >
                    MoBasket Wallet
                  </span>
                  <span className="block text-xs text-gray-500">
                    {walletLoading
                      ? "Checking balance..."
                      : `Available: Rs ${walletBalance.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!walletLoading && !hasSufficientWalletBalance && (
                  <span className="text-[11px] font-semibold text-red-500">Low balance</span>
                )}
                {paymentMethod === "wallet" && (
                  <div className="w-4 h-4 rounded-full bg-[#facd01] border-4 border-white shadow-sm ring-1 ring-[#facd01]"></div>
                )}
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${paymentMethod === "cash"
                ? "border-[#facd01] bg-yellow-50/50"
                : "border-gray-100 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${paymentMethod === "cash" ? "bg-[#facd01] text-gray-900" : "bg-gray-100 text-gray-400"}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span
                  className={`text-sm font-bold ${paymentMethod === "cash" ? "text-gray-900" : "text-gray-500"}`}
                >
                  Cash on Delivery
                </span>
              </div>
              {paymentMethod === "cash" && (
                <div className="w-4 h-4 rounded-full bg-[#facd01] border-4 border-white shadow-sm ring-1 ring-[#facd01]"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-gray-800 p-4 pb-6 z-50 md:max-w-md md:mx-auto">
        <button
          className="w-full bg-[#facd01] hover:bg-[#e6bc01] text-gray-900 font-black py-4 rounded-2xl text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || groceryItems.length === 0 || (paymentMethod === "wallet" && !walletLoading && !hasSufficientWalletBalance)}
        >
          {isPlacingOrder
            ? "Processing..."
            : paymentMethod === "cash"
              ? "Place Order"
              : paymentMethod === "wallet"
                ? "Pay via Wallet"
              : "Proceed to Payment"}
          <ChevronRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
