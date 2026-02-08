import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Share2,
  Heart,
  Clock,
  ChevronRight,
  ChevronDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WishlistButton from "@/components/WishlistButton";

// Assets
import imgCauliflower from "@/assets/grocery&kitchen/cauliflower-removebg-preview.png";
import imgTomato from "@/assets/grocery&kitchen/tomato-removebg-preview.png";
import imgStrawberry from "@/assets/grocery&kitchen/strawberry2.jpeg";
import imgApple from "@/assets/grocery&kitchen/apple-removebg-preview.png";
import imgOnion from "@/assets/bestseller/onion-removebg-preview.png";
import imgPotato from "@/assets/bestseller/aalu-removebg-preview.png";

export default function FoodDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Use passed state or fallback to mock data
  const initialProduct = location.state?.item || {
    id: id,
    name: "Strawberry (Mahabaleshwar)",
    weight: "200 g",
    price: 99,
    mrp: 113,
    time: "8 MINS",
    image: imgStrawberry,
    discount: "12% OFF",
    recipeCount: 0,
  };

  /* End of change */
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update product when ID changes or navigated from another card
  useEffect(() => {
    if (location.state?.item) {
      setProduct(location.state.item);
    } else {
      // Fallback: Try to find in local lists or reset to default if logic existed
      // For now, if no state, we keep current behavior or could lookup
      // But given constraints, just ensuring navigation updates state is key.
      const found = [...topProducts, ...peopleAlsoBought].find(
        (p) => String(p.id) === String(id),
      );
      if (found) setProduct(found);
    }
    window.scrollTo(0, 0);
    setIsDetailsOpen(false);
  }, [id, location.state]);

  const [product, setProduct] = useState(initialProduct);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const topProducts = [
    {
      id: 301,
      name: "Cauliflower (Gobi)",
      weight: "1 pc",
      price: 33,
      mrp: 42,
      time: "8 MINS",
      image: imgCauliflower,
      discount: "21% OFF",
    },
    {
      id: 302,
      name: "Hybrid Tomato",
      weight: "500 g",
      price: 14,
      mrp: 20,
      time: "8 MINS",
      image: imgTomato,
      discount: "20% OFF",
    },
    {
      id: 303,
      name: "Fresh Strawberry",
      weight: "200 g",
      price: 99,
      mrp: 120,
      time: "8 MINS",
      image: imgStrawberry,
      discount: "25% OFF",
    },
  ];

  const peopleAlsoBought = [
    {
      id: 401,
      name: "Red Delicious Apple",
      weight: "4 pcs",
      price: 111,
      mrp: 140,
      time: "8 MINS",
      image: imgApple,
      discount: "21% OFF",
    },
    {
      id: 402,
      name: "Onion (Pyaz)",
      weight: "1 kg",
      price: 30,
      mrp: 38,
      time: "8 MINS",
      image: imgOnion,
      discount: "17% OFF",
    },
    {
      id: 403,
      name: "Potato (Aloo)",
      weight: "1 kg",
      price: 25,
      mrp: 35,
      time: "8 MINS",
      image: imgPotato,
      discount: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fd] font-sans relative pb-32 md:pb-0 md:bg-white">
      {/* Mobile UI Wrapper */}
      <div className="md:hidden">
        {/* Scroll Sticky Header */}
        <div
          className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 flex items-center gap-3 transition-transform duration-300 md:max-w-md md:mx-auto ${
            showStickyHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>

          <h1 className="flex-1 text-sm font-bold text-slate-800 truncate">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 flex-shrink-0">
            <WishlistButton
              item={product}
              type="food"
              className="w-8 h-8 bg-slate-50 shadow-none border border-slate-100"
            />
            <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Search className="w-4 h-4 text-slate-700" />
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
        {/* 1. Full Image Header Section */}
        <div className="relative w-full h-[43vh] bg-orange-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-8"
          />

          {/* Overlay Navbar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
            >
              <ArrowLeft className="w-6 h-6 text-slate-900" />
            </button>
            <div className="flex items-center gap-3">
              <WishlistButton
                item={product}
                className="w-10 h-10 backdrop-blur-md shadow-sm"
              />
              <button className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                <Search className="w-5 h-5 text-slate-900" />
              </button>
              <button className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                <Share2 className="w-5 h-5 text-slate-900" />
              </button>
            </div>
          </div>

          {/* White Gradient Shadow Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>
        </div>

        {/* 2. Floating Product Details Card */}
        <div className="relative -mt-10 z-10 px-0">
          <div className="bg-white rounded-t-[25px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-5 pb-2 relative">
            {/* Time Badge Tab - Styled to look like a connected tab */}

            <div className="mt-1">
              <h1 className="text-[17px] font-[800] text-slate-800 leading-snug tracking-tight">
                {product.name}
              </h1>
              <p className="text-[13px] font-bold text-slate-500 mt-1">
                {product.weight}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-[900] text-slate-900">
                ₹{product.price}
              </span>
              <span className="text-[11px] font-bold text-slate-400 line-through">
                MRP ₹{product.mrp}
              </span>
              {product.discount && (
                <span className="bg-[#e8f0fe] text-[#2c73eb] text-[9px] font-[800] px-1.5 py-0.5 rounded-[4px] tracking-wide">
                  {product.discount}
                </span>
              )}
            </div>

            <div className="mt-4 pt-0">
              <div
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              >
                <span className="text-[13px] font-[700] text-[#11a652]">
                  View product details
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#11a652] transition-transform duration-300 ${isDetailsOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Expandable Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isDetailsOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
              >
                {/* Feature Icons Row */}
                <div className="bg-[#f8f9ff] rounded-xl p-4 flex justify-between items-start mb-4">
                  <div className="flex flex-col items-center gap-1 text-center w-1/3">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-1">
                      <Clock size={14} className="text-slate-700" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 leading-tight">
                      48 hours
                      <br />
                      return
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center w-1/3 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-1">
                      <Search size={14} className="text-slate-700" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 leading-tight">
                      24/7
                      <br />
                      Support
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center w-1/3 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-1">
                      <Heart size={14} className="text-slate-700" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 leading-tight">
                      Best
                      <br />
                      Quality
                    </span>
                  </div>
                </div>

                {/* Highlights Section */}
                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-2 flex justify-between items-center">
                    Highlights
                    <ChevronDown
                      size={16}
                      className="text-slate-400 rotate-180"
                    />
                  </h3>
                  <div className="flex gap-4">
                    <div className="min-w-[80px]">
                      <span className="text-[11px] font-bold text-slate-900">
                        Health Benefits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      It contains Folic acid, Vitamin C, Vitamin K, Potassium.
                      Beta Carotene and Carotenoid Corlander is good for
                      digestive system and contains anti-inflammatory
                      properties. Vitamin A, C & Potassium Rich
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Top Products in Category */}
        <div className="mt-1 px-5">
          <h2 className="text-base font-[800] text-slate-900 mb-4">
            Top products in this category
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide no-scrollbar pb-2">
            {topProducts.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/food/${item.id}`, { state: { item } })
                }
                className="min-w-[150px] max-w-[150px] flex flex-col gap-2 group cursor-pointer"
              >
                <div className="w-full aspect-[4/5] bg-white rounded-2xl p-0 relative flex items-center justify-center border border-slate-100 shadow-sm">
                  <img
                    src={item.image}
                    className="w-full h-32 object-contain rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                    alt={item.name}
                  />
                  <button className="absolute bottom-2 right-2 bg-white border border-[#26a541] text-[#26a541] text-[10px] font-black px-3 py-1 rounded shadow-sm hover:bg-[#26a541] hover:text-white transition-colors">
                    ADD
                  </button>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5">
                    {item.weight}
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.5em]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-slate-900">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through decoration-1">
                      ₹{item.mrp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recipes Section */}
        <div className="mt-6 px-5">
          <h2 className="text-base font-[800] text-slate-900 mb-4">
            Coriander recipes for you
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide no-scrollbar pb-2">
            {[
              {
                id: 1,
                title: "Carrot And Coriander Soup",
                image:
                  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
              },
              {
                id: 2,
                title: "Chicken Lemon Coriander Soup",
                image:
                  "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop",
              },
              {
                id: 3,
                title: "Lemon Coriander Soup",
                image:
                  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
              },
              {
                id: 4,
                title: "Cilantro Garlic Prawns",
                image:
                  "https://images.unsplash.com/photo-1625937751876-4515cd8e7c4e?w=400&h=300&fit=crop",
              },
            ].map((recipe) => (
              <div
                key={recipe.id}
                className="min-w-[120px] max-w-[120px] cursor-pointer group"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <img
                    src={recipe.image}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    alt={recipe.title}
                  />
                </div>
                <h3 className="text-[11px] font-bold text-slate-800 leading-tight text-center">
                  {recipe.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* 5. People also bought */}
        <div className="mt-6 px-5">
          <h2 className="text-base font-[800] text-slate-900 mb-4">
            People also bought
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide no-scrollbar pb-2">
            {peopleAlsoBought.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/food/${item.id}`, { state: { item } })
                }
                className="min-w-[150px] max-w-[150px] flex flex-col gap-2 group cursor-pointer"
              >
                <div className="w-full aspect-[4/5] bg-white rounded-2xl p-0 relative flex items-center justify-center border border-slate-100 shadow-sm">
                  <img
                    src={item.image}
                    className="w-full h-32 object-contain rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                    alt={item.name}
                  />
                  <button className="absolute bottom-2 right-2 bg-white border border-[#26a541] text-[#26a541] text-[10px] font-black px-3 py-1 rounded shadow-sm hover:bg-[#26a541] hover:text-white transition-colors">
                    ADD
                  </button>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5">
                    {item.weight}
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.5em]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-slate-900">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through decoration-1">
                      ₹{item.mrp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Sticky Bottom Cart Bar */}
      </div>
      {/* End Mobile UI Wrapper */}

      <div className="hidden md:block max-w-7xl mx-auto pt-8 px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold group"
        >
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm group-hover:shadow group-hover:border-slate-300 transition-all">
            <ArrowLeft size={20} />
          </div>
          <span>Back</span>
        </button>
      </div>

      {/* Desktop UI */}
      <div className="hidden md:flex max-w-7xl mx-auto py-6 px-8 gap-16">
        {/* Left Column: Image */}
        <div className="w-[45%]">
          <div className="bg-[#feecd6]/30 border border-slate-100 rounded-3xl w-full aspect-square flex items-center justify-center p-12 relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Thumbnails row (optional placeholders as in standard e-com) */}
          <div className="flex gap-4 mt-6 justify-center">
            <div className="w-20 h-20 border-2 border-[#26a541] rounded-xl p-2 bg-white cursor-pointer">
              <img
                src={product.image}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex-1 pt-4">
          {/* Breadcrumbs */}
          <p className="text-xs font-semibold text-slate-500 mb-4">
            Home / Vegetables & Fruits /{" "}
            <span className="text-slate-900">{product.name}</span>
          </p>

          {/* Title */}
          <h1 className="text-4xl font-[900] text-slate-900 mb-2 tracking-tight">
            {product.name}
          </h1>

          {/* Time Badge Desktop */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md mb-6">
            <Clock size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600">
              {product.time || "8 MINS"}
            </span>
          </div>

          <div className="h-px w-full bg-slate-100 mb-8"></div>

          {/* Weight & Price Block */}
          <div className="mb-8">
            <p className="text-sm font-bold text-slate-500 mb-2">
              {product.weight}
            </p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm font-bold text-slate-400 line-through">
                    MRP ₹{product.mrp}
                  </span>
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                    {product.discount}
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              (Inclusive of all taxes)
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="mb-12">
            <Button className="bg-[#26a541] hover:bg-[#1e8a33] text-white font-bold text-lg h-12 px-10 rounded-xl shadow-lg shadow-green-100 active:scale-95 transition-all">
              Add to cart
            </Button>
          </div>

          {/* Benefits Section (Why shop from...) */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 mb-4">
              Why shop from MoBasket?
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fdf8e6] flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Superfast Delivery
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
                    Get your order delivered to your doorstep at the earliest
                    from dark stores near you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fdf8e6] flex items-center justify-center flex-shrink-0">
                  <div className="font-black text-yellow-600">₹</div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Best Prices & Offers
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
                    Best price destination with offers directly from the
                    manufacturers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#fdf8e6] flex items-center justify-center flex-shrink-0">
                  <Heart size={18} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Wide Assortment
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
                    Choose from 5000+ products across food, personal care,
                    household & other categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block max-w-7xl mx-auto px-8 pb-20 mt-8">
        <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">
          Top products in this category
        </h2>
        <div className="grid grid-cols-6 gap-6">
          {[...topProducts, ...peopleAlsoBought].map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => navigate(`/food/${item.id}`, { state: { item } })}
            >
              {/* Image Container */}
              <div className="aspect-square rounded-xl bg-slate-50 mb-3 flex items-center justify-center relative overflow-hidden">
                {item.discount && (
                  <div className="absolute top-2 left-0 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-r z-10 uppercase tracking-tighter">
                    {item.discount}
                  </div>
                )}
                <img
                  src={item.image}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  alt={item.name}
                />
              </div>

              {/* Info */}
              <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1 line-clamp-2 min-h-[2.4em]">
                {item.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mb-4">
                {item.weight}
              </p>

              {/* Price & Add Row */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">
                    ₹{item.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{item.mrp}
                  </span>
                </div>
                <button className="bg-white border-2 border-[#23bb49] text-[#23bb49] text-[10px] font-black px-4 py-1.5 rounded-lg hover:bg-[#23bb49] hover:text-white transition-colors">
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
