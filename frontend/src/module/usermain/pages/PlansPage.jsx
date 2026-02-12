import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Zap,
  Check,
  Star,
  Crown,
  ChevronDown,
  Home,
  Search,
  ShoppingBag,
  User,
  LayoutGrid,
  X,
  Package,
  Truck,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlansPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "moweek",
      name: "MoWeek",
      description: "Perfect starter pack for weekly essentials",
      items: "21 items",
      productCount: 21,
      deliveries: 4,
      frequency: "Weekly",
      price: "₹999",
      duration: "/7 days",
      durationText: "for 7 days",
      icon: <Zap size={24} className="text-white fill-white" />,
      color: "bg-emerald-500",
      headerColor: "bg-emerald-500",
      popular: false,
      benefits: [
        "Free delivery on all orders",
        "Save up to ₹200",
        "Weekly fresh produce",
      ],
      products: [
        { name: "Rice (Premium)", qty: "1 kg • weekly" },
        { name: "Wheat Flour", qty: "1 kg • weekly" },
        { name: "Toor Dal", qty: "500 g • weekly" },
        { name: "Cooking Oil", qty: "1 L • biweekly" },
        { name: "Milk", qty: "1 L • daily" },
        { name: "Eggs", qty: "6 pcs • biweekly" },
      ],
    },
    {
      id: "mobasic",
      name: "MoBasic",
      description: "Monthly essentials for small families",
      items: "31 items",
      productCount: 31,
      deliveries: 12,
      frequency: "Bi-Weekly",
      price: "₹2,999",
      duration: "/30 days",
      durationText: "for 30 days",
      icon: <Check size={24} className="text-white" strokeWidth={4} />,
      color: "bg-blue-600",
      headerColor: "bg-blue-600",
      popular: false,
      benefits: [
        "Free delivery on all orders",
        "Save up to ₹500",
        "Priority slots available",
      ],
      products: [
        { name: "Rice (Premium)", qty: "5 kg • monthly" },
        { name: "Wheat Flour", qty: "5 kg • monthly" },
        { name: "Sugar", qty: "2 kg • monthly" },
        { name: "Salt", qty: "1 kg • monthly" },
      ],
    },
    {
      id: "mogold",
      name: "MoGold",
      description: "Complete family package with premium items",
      items: "51 items",
      productCount: 51,
      deliveries: 20,
      frequency: "Weekly",
      price: "₹4,999",
      duration: "/30 days",
      durationText: "for 30 days",
      icon: <Star size={24} className="text-white fill-white" />,
      color: "bg-amber-500",
      headerColor: "bg-amber-500",
      popular: true,
      benefits: [
        "Free delivery on all orders",
        "Save up to ₹1200",
        "Premium fresh produce",
        "Dedicated support",
      ],
      products: [
        { name: "Basmati Rice", qty: "5 kg • monthly" },
        { name: "Premium Flour", qty: "10 kg • monthly" },
        { name: "Exotic Veggies", qty: "Weekly basket" },
        { name: "Dry Fruits", qty: "500g mix • monthly" },
      ],
    },
    {
      id: "movip",
      name: "MoVIP",
      description: "Luxury subscription for large families",
      items: "77 items",
      productCount: 77,
      deliveries: 30,
      frequency: "Daily",
      price: "₹8,499",
      duration: "/30 days",
      durationText: "for 30 days",
      icon: <Crown size={24} className="text-white fill-white" />,
      color: "bg-purple-500",
      headerColor: "bg-purple-500",
      popular: false,
      benefits: [
        "Instant delivery anytime",
        "Save up to ₹2500",
        "Personal nutritionist",
        "All-access pass",
      ],
      products: [
        { name: "Organic Rice", qty: "10 kg • monthly" },
        { name: "Organic Flour", qty: "10 kg • monthly" },
        { name: "Imported Cheese", qty: "Weekly selection" },
        { name: "Organic Milk", qty: "2 L • daily" },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans w-full relative pb-20 overflow-x-hidden">
      {/* Header with extended background for overlapping effect */}
      <div className="bg-[#FACC15] pb-10 rounded-b-[2.5rem] shadow-sm">
        <div className="p-4 pt-6 flex justify-between items-start md:max-w-7xl md:mx-auto">
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">
              MoBasket
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-0.5 opacity-80">
              Delivery in 15-20 mins
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <MapPin size={14} className="text-slate-900" />
            <span className="text-xs font-extrabold text-slate-900">
              Add Address
            </span>
            <ChevronDown size={14} className="text-slate-900" />
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="px-4 mt-8 md:max-w-7xl md:mx-auto">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900">Monthly Plans</h2>
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-yellow-200">
              <Zap size={10} className="fill-yellow-800" /> SAVE 40%
            </span>
          </div>
          <span className="text-emerald-700 text-xs font-bold flex items-center cursor-pointer hover:underline">
            All plans <ChevronRight size={14} />
          </span>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer active:scale-95 transition-transform duration-200 ${plan.popular ? "border-yellow-400 ring-1 ring-yellow-400 relative" : "border-gray-100"} hover:shadow-md h-full flex flex-col justify-between`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                  Popular
                </div>
              )}

              <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center shadow-md shrink-0`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {plan.name}
                      </h3>
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-nowrap">
                        {plan.items}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      Free delivery on all orders
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="font-black text-xl text-slate-900">
                      {plan.price}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium text-right">
                      {plan.duration}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-end z-50 md:max-w-md md:mx-auto pb-4">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/grocery")}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <ShoppingBag size={24} className="text-slate-900 fill-current" />
          <span className="text-[10px] font-bold text-slate-900">Plan</span>
          <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/categories")}
        >
          <LayoutGrid size={24} />
          <span className="text-[10px] font-medium">Categories</span>
        </div>

        <button
          className="mb-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          onClick={() => navigate("/home")}
        >
          <span className="font-black italic text-lg tracking-tighter">
            Mofood
          </span>
        </button>
      </div>

      {/* SLIDE-UP PLAN DETAILS SHEET w/ Desktop Centering */}
      {selectedPlan && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[2px]"
            onClick={() => setSelectedPlan(null)}
          ></div>
          {/* Responsive Modal Wrapper: Bottom sheet on mobile, Centered card on desktop */}
          <div className="fixed bottom-0 left-0 right-0 z-[70] md:inset-0 md:flex md:items-center md:justify-center pointer-events-none">
            <div className="bg-white w-full rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-in-up max-h-[85vh] overflow-y-auto pointer-events-auto md:max-w-4xl md:h-auto md:max-h-[90vh] relative md:flex md:flex-row md:overflow-hidden">
              {/* Content - same as clear mobile code */}
              <div
                className={`${selectedPlan.headerColor} p-6 pb-12 text-white relative md:w-2/5 md:pb-6 md:flex md:flex-col md:justify-center`}
              >
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition shadow-sm cursor-pointer md:hidden"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-inner backdrop-blur-sm border border-white/10">
                    {selectedPlan.icon}
                  </div>
                  <h2 className="text-3xl font-black mb-1 tracking-tight">
                    {selectedPlan.name}
                  </h2>
                  <p className="text-white/90 font-medium text-sm max-w-[200px] leading-snug">
                    {selectedPlan.description}
                  </p>
                </div>

                <div className="mt-8 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black">
                    {selectedPlan.price}
                  </span>
                  <span className="text-white/80 font-medium text-lg">
                    {selectedPlan.durationText}
                  </span>
                </div>

                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Package size={16} /> {selectedPlan.productCount} products
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Truck size={16} /> {selectedPlan.deliveries} deliveries
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Calendar size={16} /> {selectedPlan.frequency}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(null)}
                className="hidden md:block absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition shadow-sm cursor-pointer z-10"
              >
                <X size={20} className="text-slate-900" />
              </button>
              <div className="bg-white -mt-6 rounded-t-[2rem] px-6 pt-8 pb-8 relative md:w-3/5 md:mt-0 md:rounded-none md:p-8 md:overflow-y-auto no-scrollbar">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <h3 className="font-bold text-slate-900 text-lg">
                      Benefits
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedPlan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check
                            size={12}
                            className="text-green-600 stroke-[4]"
                          />
                        </div>
                        <span className="text-slate-700 font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag size={18} className="text-yellow-500" />
                    <h3 className="font-bold text-slate-900 text-lg">
                      Products Included ({selectedPlan.productCount})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlan.products.map((prod, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100"
                      >
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                          <Package size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">
                            {prod.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {prod.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Static Bottom Subscribe Button */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button className="w-full bg-[#fec007] hover:bg-[#eeb100] active:scale-[0.98] transition-all text-black font-black text-lg py-4 rounded-2xl shadow-lg shadow-yellow-200">
                    Subscribe for {selectedPlan.price}
                  </button>
                  <p className="text-center text-xs text-slate-400 font-medium mt-2">
                    Cancel anytime • No hidden charges
                  </p>
                </div>
              </div>

              {/* Sticky Bottom Subscribe Button */}
            </div>
          </div>
        </>
      )}

      <style>{`
                @keyframes slide-in-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-in-up {
                    animation: slide-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
    </div>
  );
};

export default PlansPage;
