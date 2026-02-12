import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../user/context/CartContext";

const GroceryCartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, total, clearCart } = useCart();

  // Filter grocery items (though CartContext usually keeps only one restaurant type)
  const groceryItems = cart.filter(
    (item) =>
      item.restaurantId === "grocery-store" || item.restaurant === "MoGrocery",
  );

  if (groceryItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-24">
        <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={80} className="text-gray-200" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/grocery")}
          className="bg-[#facd01] text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-[#e6bc01] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Calculate savings
  const itemsTotal = groceryItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0,
  );
  const totalSavings = itemsTotal - total;
  const deliveryCharge = 0; // Free for now
  const handlingCharge = 2;
  const grandTotal = total + handlingCharge;

  return (
    <div className="min-h-screen bg-[#fefce8] pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">My Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded"
        >
          CLEAR CART
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {/* Savings Banner */}
        {totalSavings > 0 && (
          <div className="bg-yellow-50 px-4 py-2 flex items-center justify-between mx-4 mt-4 rounded-lg border border-yellow-200">
            <span className="text-yellow-700 text-xs font-bold flex items-center gap-1">
              <ShieldCheck size={14} /> Your total savings
            </span>
            <span className="text-yellow-800 text-xs font-bold">
              ₹{totalSavings}
            </span>
          </div>
        )}

        {/* Store Closed / Status Message (Optional, as per image) */}
        <div className="bg-white mx-4 mt-4 rounded-xl p-4 flex items-start gap-3 shadow-sm border border-yellow-50">
          <div className="bg-yellow-100 p-1.5 rounded-full">
            <Clock size={18} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 leading-tight">
              Delivery in 8 minutes
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Shipment of {groceryItems.length} items
            </p>
          </div>
        </div>

        {/* Item List */}
        <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-50">
          {groceryItems.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center gap-4 border-b border-gray-50 last:border-0"
            >
              <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {item.weight || "1 unit"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{item.price}
                  </span>
                  {item.mrp && item.mrp > item.price && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{item.mrp}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center bg-[#facd01] text-gray-900 rounded-lg px-2 py-1.5 gap-3 shadow-sm border border-yellow-300">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-0.5 hover:bg-black/5 rounded transition-colors"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="text-xs font-bold min-w-[12px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-0.5 hover:bg-black/5 rounded transition-colors"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-50 mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Bill details</h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="bg-gray-100 p-0.5 rounded text-[8px] border border-gray-200">
                  BOX
                </span>{" "}
                Items total
                {totalSavings > 0 && (
                  <span className="text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                    Saved ₹{totalSavings}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {itemsTotal > total && (
                  <span className="text-gray-400 line-through">
                    ₹{itemsTotal}
                  </span>
                )}
                <span className="font-bold text-gray-900">₹{total}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                Delivery charge
                <AlertCircle size={12} className="text-gray-400" />
              </div>
              <span className="text-yellow-600 font-bold">FREE</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                Handling charge
                <AlertCircle size={12} className="text-gray-400" />
              </div>
              <span className="font-bold text-gray-900">₹{handlingCharge}</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Grand total
              </span>
              <span className="text-sm font-bold text-gray-900">
                ₹{grandTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Savings banner at bottom */}
        {totalSavings > 0 && (
          <div className="bg-yellow-50 mx-4 mb-4 p-3 rounded-lg border border-dashed border-yellow-400 flex items-center justify-between">
            <span className="text-yellow-700 text-[10px] font-bold">
              Your total savings
            </span>
            <span className="text-yellow-800 text-[10px] font-bold">
              ₹{totalSavings}
            </span>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="bg-white mx-4 mb-32 rounded-xl p-4 shadow-sm border border-gray-50">
          <h3 className="text-xs font-bold text-gray-900 mb-2">
            Cancellation Policy
          </h3>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Orders cannot be cancelled once packed for delivery. In case of
            unexpected delays, a refund will be provided if applicable.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-[100] md:max-w-md md:mx-auto">
        <div className="bg-[#facd01] rounded-xl flex items-center justify-between px-4 py-3 shadow-lg active:scale-[0.98] transition-all cursor-pointer overflow-hidden group border border-yellow-400">
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm">
              ₹{grandTotal}
            </span>
            <span className="text-gray-700 text-[10px] uppercase font-bold tracking-wider">
              TOTAL
            </span>
          </div>
          <button
            className="flex items-center gap-1 text-gray-900 font-bold text-base"
            onClick={() => navigate("/grocery/checkout")}
          >
            Order Now <ChevronRight size={20} />
          </button>

          {/* Subtle shine effect */}
          <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-white/30 skew-x-[-25deg] group-hover:left-[150%] transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default GroceryCartPage;
