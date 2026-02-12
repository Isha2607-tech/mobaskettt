import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingBag,
  Users,
  Minus,
  Plus,
  ChevronRight,
  Home,
  Heart,
  Menu,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import DeliveryScheduler from "@/components/DeliveryScheduler";
import { useCart } from "../../user/context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const [deliveryOptions, setDeliveryOptions] = useState({
    deliveryType: "now",
    deliveryDate: null,
    deliveryTimeSlot: null,
  });

  // Filter food items only (exclude grocery items)
  const cartItems = cart.filter(
    (item) =>
      item.restaurantId !== "grocery-store" && item.restaurant !== "MoGrocery",
  );

  const [discountCode, setDiscountCode] = useState("");

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );
  };

  const cartTotal = calculateTotal();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items to proceed.");
      return;
    }

    if (deliveryOptions.deliveryType === "scheduled") {
      if (!deliveryOptions.deliveryDate || !deliveryOptions.deliveryTimeSlot) {
        toast.error("Please select a delivery date and time slot.");
        return;
      }
    }

    navigate("/checkout", {
      state: {
        ...deliveryOptions,
        items: cartItems,
        total: cartTotal,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f6e9dc] pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 rounded-b-3xl">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Cart</h1>
        </div>
      </div>

      {/* Empty Cart State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-700 mb-1">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Add items from a restaurant to get started
          </p>
          <Button
            className="bg-[#ff8100] hover:bg-[#e67300] text-white font-bold px-8 py-3 rounded-xl"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex gap-3 p-3">
                  {/* Food Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>

                  {/* Food Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>

                    {/* Restaurant Name */}
                    {item.restaurant && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">
                          {item.restaurant}
                        </span>
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        ₹{(item.price || 0).toFixed(2)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-semibold text-gray-900 min-w-[30px] text-center">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#ff8100] text-white flex items-center justify-center hover:bg-[#e67300] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discount Code Section */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Discount Code
                </span>
                <div className="flex-1 max-w-[200px] ml-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter or choose a code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="pr-8 h-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
                    />
                    <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Scheduler */}
          <div className="px-4 mb-4">
            <DeliveryScheduler type="food" onScheduleChange={setDeliveryOptions} />
          </div>

          {/* Total Section */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#ff8100]">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="px-4 pb-20">
            <Button
              className="w-full bg-[#ff8100] hover:bg-[#e67300] text-white font-bold py-4 rounded-xl text-base"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
