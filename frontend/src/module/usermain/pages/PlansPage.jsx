import React, { useEffect, useState } from "react";
import {
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
  LayoutGrid,
  X,
  Package,
  Truck,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const PlansPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState("veg");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/grocery/plans");
        const payload = Array.isArray(response?.data?.data) ? response.data.data : [];
        const normalized = payload.map((plan) => ({
          ...plan,
          id: plan._id,
          items: plan.itemsLabel || `${plan.productCount || 0} items`,
          duration: `/${plan.durationDays || 0} days`,
          durationText: `for ${plan.durationDays || 0} days`,
          priceDisplay: `Rs ${Number(plan.price || 0).toLocaleString("en-IN")}`,
          iconKey: plan.iconKey || "zap",
          color: plan.color || "bg-emerald-500",
          headerColor: plan.headerColor || plan.color || "bg-emerald-500",
          benefits: Array.isArray(plan.benefits) ? plan.benefits : [],
          products: Array.isArray(plan.products) ? plan.products : [],
          vegProducts: Array.isArray(plan.vegProducts) ? plan.vegProducts : [],
          nonVegProducts: Array.isArray(plan.nonVegProducts) ? plan.nonVegProducts : [],
        }));
        setPlans(normalized);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load plans");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const renderPlanIcon = (iconKey) => {
    if (iconKey === "check") {
      return <Check size={24} className="text-white" strokeWidth={4} />;
    }
    if (iconKey === "star") {
      return <Star size={24} className="text-white fill-white" />;
    }
    if (iconKey === "crown") {
      return <Crown size={24} className="text-white fill-white" />;
    }
    return <Zap size={24} className="text-white fill-white" />;
  };

  const openPlan = (plan) => {
    setSelectedPlan(plan);
    setSelectedMealType("veg");
  };

  const selectedPlanProducts = (() => {
    if (!selectedPlan) return [];

    const vegProducts = Array.isArray(selectedPlan.vegProducts) ? selectedPlan.vegProducts : [];
    const nonVegProducts = Array.isArray(selectedPlan.nonVegProducts) ? selectedPlan.nonVegProducts : [];
    const legacyProducts = Array.isArray(selectedPlan.products) ? selectedPlan.products : [];

    const hasTypedProducts = vegProducts.length > 0 || nonVegProducts.length > 0;
    if (!hasTypedProducts) {
      return legacyProducts;
    }

    return selectedMealType === "nonVeg" ? nonVegProducts : vegProducts;
  })();

  return (
    <div className="bg-gray-50 min-h-screen font-sans w-full relative pb-20 overflow-x-hidden">
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
            <span className="text-xs font-extrabold text-slate-900">Add Address</span>
            <ChevronDown size={14} className="text-slate-900" />
          </div>
        </div>
      </div>

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

        {loading && <p className="text-sm text-slate-500">Loading plans...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && plans.length === 0 && (
          <p className="text-sm text-slate-500">No plans available right now.</p>
        )}

        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer active:scale-95 transition-transform duration-200 ${plan.popular ? "border-yellow-400 ring-1 ring-yellow-400 relative" : "border-gray-100"} hover:shadow-md h-full flex flex-col justify-between`}
              onClick={() => openPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                  Popular
                </div>
              )}

              <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center shadow-md shrink-0`}>
                    {renderPlanIcon(plan.iconKey)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-nowrap">
                        {plan.items}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Free delivery on all orders</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="font-black text-xl text-slate-900">{plan.priceDisplay}</p>
                    <p className="text-[10px] text-gray-400 font-medium text-right">{plan.duration}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-6 flex justify-between items-end z-50 md:max-w-md md:mx-auto pb-4">
        <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => navigate("/grocery")}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <ShoppingBag size={24} className="text-slate-900 fill-current" />
          <span className="text-[10px] font-bold text-slate-900">Plan</span>
          <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => navigate("/categories")}>
          <LayoutGrid size={24} />
          <span className="text-[10px] font-medium">Categories</span>
        </div>

        <button
          className="mb-1 bg-[#EF4F5F] hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          onClick={() => navigate("/home")}
        >
          <span className="font-black italic text-lg tracking-tighter">Mofood</span>
        </button>
      </div>

      {selectedPlan && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[2px]" onClick={() => setSelectedPlan(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 z-[70] md:inset-0 md:flex md:items-center md:justify-center pointer-events-none">
            <div className="bg-white w-full rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-in-up max-h-[85vh] overflow-y-auto pointer-events-auto md:max-w-4xl md:h-auto md:max-h-[90vh] relative md:flex md:flex-row md:overflow-hidden">
              <div className={`${selectedPlan.headerColor} p-6 pb-12 text-white relative md:w-2/5 md:pb-6 md:flex md:flex-col md:justify-center`}>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition shadow-sm cursor-pointer md:hidden"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-inner backdrop-blur-sm border border-white/10">
                    {renderPlanIcon(selectedPlan.iconKey)}
                  </div>
                  <h2 className="text-3xl font-black mb-1 tracking-tight">{selectedPlan.name}</h2>
                  <p className="text-white/90 font-medium text-sm max-w-[200px] leading-snug">{selectedPlan.description}</p>
                </div>

                <div className="mt-8 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black">{selectedPlan.priceDisplay}</span>
                  <span className="text-white/80 font-medium text-lg">{selectedPlan.durationText}</span>
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
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <h3 className="font-bold text-slate-900 text-lg">Benefits</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedPlan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check size={12} className="text-green-600 stroke-[4]" />
                        </div>
                        <span className="text-slate-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag size={18} className="text-yellow-500" />
                    <h3 className="font-bold text-slate-900 text-lg">Products Included</h3>
                  </div>
                  <div className="mb-4 inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                    <button
                      type="button"
                      className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                        selectedMealType === "veg" ? "bg-green-600 text-white" : "text-slate-600"
                      }`}
                      onClick={() => setSelectedMealType("veg")}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                        selectedMealType === "nonVeg" ? "bg-rose-600 text-white" : "text-slate-600"
                      }`}
                      onClick={() => setSelectedMealType("nonVeg")}
                    >
                      Non-veg
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlanProducts.map((prod, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                          <Package size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{prod.name}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{prod.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button className="w-full bg-[#fec007] hover:bg-[#eeb100] active:scale-[0.98] transition-all text-black font-black text-lg py-4 rounded-2xl shadow-lg shadow-yellow-200">
                    Subscribe for {selectedPlan.priceDisplay}
                  </button>
                  <p className="text-center text-xs text-slate-400 font-medium mt-2">Cancel anytime - No hidden charges</p>
                </div>
              </div>
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
