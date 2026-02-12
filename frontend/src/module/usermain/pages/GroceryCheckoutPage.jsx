import { useState } from "react";
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
  ChevronRight,
  AlertCircle,
  Truck,
  CalendarDays,
} from "lucide-react";
import { useCart } from "../../user/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function GroceryCheckoutPage() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryOption, setDeliveryOption] = useState("now");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("");

  // Filter grocery items
  const groceryItems = cart.filter(
    (item) =>
      item.restaurantId === "grocery-store" || item.restaurant === "MoGrocery",
  );

  const deliveryAddress =
    "202, Princess Centre, 2nd Floor, 6/3, 452001, New Delhi";
  const estimatedTime = "8-12 min";
  const handlingCharge = 2;
  const deliveryFee = 0;

  const itemsTotal = groceryItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0,
  );
  const subtotal = total;
  const totalSavings = itemsTotal - subtotal;
  const grandTotal = subtotal + handlingCharge + deliveryFee;

  const handlePlaceOrder = () => {
    // Navigate to a success page or payment processing
    // For now, let's just clear cart and go home or to orders
    // clearCart();
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-[#fefce8] pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 rounded-b-3xl shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-yellow-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-50">
          <div className="flex items-start gap-3">
            <div className="bg-[#facd01] rounded-lg p-2">
              <MapPin className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Delivery Address
              </h3>
              <p className="text-xs text-gray-600">{deliveryAddress}</p>
              <button className="text-yellow-700 text-xs font-bold mt-2 hover:underline">
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-50">
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">
            Order Items
          </h3>
          <div className="space-y-3">
            {groceryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-50">
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">
            Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-bold">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-yellow-600 font-bold">FREE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Handling Charge</span>
              <span className="text-gray-900 font-bold">
                ₹{handlingCharge.toFixed(2)}
              </span>
            </div>
            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Savings</span>
                <span className="text-yellow-700 font-bold">
                  -₹{totalSavings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-gray-900">
                  Grand Total
                </span>
                <span className="text-xl font-black text-gray-900">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-50">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
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
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-50">
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-50 md:max-w-md md:mx-auto">
        <button
          className="w-full bg-[#facd01] hover:bg-[#e6bc01] text-gray-900 font-black py-4 rounded-2xl text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "cash" ? "Place Order" : "Proceed to Payment"}
          <ChevronRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
