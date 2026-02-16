import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Clock,
  ShoppingBag,
  Home,
  Heart,
  Menu,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "../../user/context/CartContext";
import { useProfile } from "../../user/context/ProfileContext";
import { useLocation as useUserLocation } from "../../user/hooks/useLocation";
import { useZone } from "../../user/hooks/useZone";
import { orderAPI } from "@/lib/api";
import { initRazorpayPayment } from "@/lib/utils/razorpay";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, isGroceryItem } = useCart();
  const { getDefaultAddress, userProfile } = useProfile();
  const { location: liveLocation } = useUserLocation();
  const { zoneId } = useZone(liveLocation, "mofood");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const foodItems = useMemo(
    () => cart.filter((item) => !isGroceryItem(item)),
    [cart, isGroceryItem],
  );

  const selectedAddress = useMemo(() => {
    const defaultAddress = getDefaultAddress();
    if (defaultAddress) return defaultAddress;

    if (liveLocation?.latitude && liveLocation?.longitude) {
      return {
        label: "Home",
        street: liveLocation.street || liveLocation.address || "",
        additionalDetails: liveLocation.area || "",
        city: liveLocation.city || "",
        state: liveLocation.state || "",
        zipCode: liveLocation.postalCode || liveLocation.zipCode || "",
        formattedAddress:
          liveLocation.formattedAddress || liveLocation.address || "",
        location: {
          coordinates: [liveLocation.longitude, liveLocation.latitude],
        },
      };
    }

    return null;
  }, [getDefaultAddress, liveLocation]);

  const orderSummary = useMemo(() => {
    const subtotal = foodItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
    const deliveryFee = 0;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    return {
      items: foodItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      deliveryAddress:
        selectedAddress?.formattedAddress || "Select delivery address",
      estimatedTime: "30-40 min",
    };
  }, [foodItems, selectedAddress]);

  const buildOrderItems = () =>
    foodItems.map((item) => ({
      itemId: String(item.id || item._id || item.itemId || ""),
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || item.imageUrl || "",
      description: item.description || "",
      isVeg: item.isVeg !== false,
    }));

  const handleProceedToPayment = async () => {
    if (isPlacingOrder) return;

    if (foodItems.length === 0) {
      toast.error("Your cart is empty. Add items to proceed.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please add/select a delivery address first.");
      return;
    }

    const restaurantId = foodItems[0]?.restaurantId;
    const restaurantName = foodItems[0]?.restaurant || "Restaurant";
    if (!restaurantId) {
      toast.error("Restaurant not found for cart items.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const items = buildOrderItems();
      const invalidItem = items.find(
        (i) => !i.itemId || !i.name || !Number.isFinite(i.price) || i.quantity <= 0,
      );
      if (invalidItem) {
        throw new Error("Cart item data is invalid. Please refresh and try again.");
      }

      const pricingResponse = await orderAPI.calculateOrder({
        items,
        restaurantId,
        deliveryAddress: selectedAddress,
        deliveryFleet: "standard",
      });
      const calculatedPricing = pricingResponse?.data?.data?.pricing;
      if (!calculatedPricing?.total) {
        throw new Error("Failed to calculate order pricing.");
      }

      const backendPaymentMethod = paymentMethod === "cash" ? "cash" : "razorpay";

      const orderPayload = {
        items,
        address: selectedAddress,
        restaurantId,
        restaurantName,
        pricing: calculatedPricing,
        deliveryFleet: "standard",
        note: "[MoFood] Order from user checkout",
        sendCutlery: false,
        paymentMethod: backendPaymentMethod,
        zoneId: zoneId || undefined,
      };

      const orderResponse = await orderAPI.createOrder(orderPayload);
      const { order, razorpay } = orderResponse?.data?.data || {};
      const orderIdentifier = order?.orderId || order?.id;

      if (backendPaymentMethod === "cash") {
        clearCart("mofood");
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
          name: "MoBasket MoFood",
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
              clearCart("mofood");
              toast.success("Payment successful. Order confirmed.");
              navigate(`/orders/${orderIdentifier}?confirmed=true`);
              resolve();
            } catch (verifyError) {
              console.error("Payment verification failed:", verifyError);
              toast.error("Payment verification failed. Please contact support.");
              reject(verifyError);
            }
          },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled.");
              reject(new Error("Payment cancelled"));
            },
          },
        });
      });
    } catch (error) {
      console.error("Checkout order creation failed:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6e9dc] pb-24">
      <div className="bg-white sticky top-0 z-50 rounded-b-3xl">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-[#ff8100] rounded-lg p-2">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Delivery Address</h3>
              <p className="text-xs text-gray-600">{orderSummary.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {orderSummary.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  Rs {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">Rs {orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900 font-medium">Rs {orderSummary.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#ff8100]">Rs {orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#ff8100] rounded-lg p-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Estimated Delivery Time</p>
              <p className="text-sm font-bold text-gray-900">{orderSummary.estimatedTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h3>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === "card"
                  ? "border-[#ff8100] bg-[#ff8100]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${paymentMethod === "card" ? "text-[#ff8100]" : "text-gray-400"}`}
              />
              <span
                className={`text-sm font-medium ${paymentMethod === "card" ? "text-[#ff8100]" : "text-gray-700"}`}
              >
                Credit/Debit Card
              </span>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === "cash"
                  ? "border-[#ff8100] bg-[#ff8100]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 ${paymentMethod === "cash" ? "text-[#ff8100]" : "text-gray-400"}`}
              />
              <span
                className={`text-sm font-medium ${paymentMethod === "cash" ? "text-[#ff8100]" : "text-gray-700"}`}
              >
                Cash on Delivery
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-20">
        <Button
          className="w-full bg-[#ff8100] hover:bg-[#e67300] text-white font-bold py-4 rounded-xl text-base"
          onClick={handleProceedToPayment}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder
            ? "Processing..."
            : paymentMethod === "cash"
              ? "Place Order"
              : "Proceed to Payment"}
        </Button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4">
          <button
            onClick={() => navigate("/grocery")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-[#ff8100] transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs text-gray-600 font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate("/wishlist")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-[#ff8100] transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs text-gray-600 font-medium">Wishlist</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 -mt-8">
            <div className="bg-white rounded-full p-3 shadow-lg border-2 border-gray-200">
              <ChefHat className="w-6 h-6 text-gray-600" />
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs text-gray-600 font-medium">Orders</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Menu className="w-6 h-6" />
            <span className="text-xs text-gray-600 font-medium">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
