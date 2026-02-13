import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Mic,
  ChevronDown,
  User,
  ShoppingBag,
  ShoppingCart,
  Zap,
  Heart,
  Home,
  LayoutGrid,
  Printer,
  Monitor,
  X,
  Snowflake,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../user/context/CartContext";
import { CategoryFoodsContent } from "./CategoryFoodsPage";
import api from "@/lib/api";

// Assets Imports
// Vegetables
import imgCoriander from "@/assets/bestseller/coriandar-removebg-preview.png";
import imgChili from "@/assets/bestseller/mirchi-removebg-preview.png";
import imgPotato from "@/assets/bestseller/aalu-removebg-preview.png";
import imgOnion from "@/assets/bestseller/onion-removebg-preview.png";

// Chips
import imgLaysBlue from "@/assets/bestseller/BlueLays-removebg-preview.png";
import imgKurkure from "@/assets/bestseller/KurkureImage-removebg-preview.png";
import imgLaysGreen from "@/assets/bestseller/GreenLays-removebg-preview.png";
import imgUncle from "@/assets/bestseller/uncleChips-removebg-preview.png";

//sweet
import imgChoclate from "@/assets/bestseller/choclate-removebg-preview.png";
import imgchoclate2 from "@/assets/bestseller/choclate2-removebg-preview.png";
import imgicecream2 from "@/assets/bestseller/icecream2-removebg-preview.png";

// Oil
import imgOil1 from "@/assets/bestseller/oil-removebg-preview.png";
import imgOil2 from "@/assets/bestseller/oil2-removebg-preview.png";
import imgOil3 from "@/assets/bestseller/oil3-removebg-preview.png";
import imgOil4 from "@/assets/bestseller/oil4-removebg-preview.png";

// Dairy
import imgMilk from "@/assets/bestseller/milk-removebg-preview.png";
import imgBread from "@/assets/bestseller/bread-removebg-preview.png";
import imgButter from "@/assets/bestseller/butter-removebg-preview.png";
import imgCheese from "@/assets/bestseller/cheese-removebg-preview.png";

import imgAtta from "@/assets/bestseller/aata-removebg-preview.png";
import imgBakery from "@/assets/bestseller/bakery-removebg-preview1.png";
import imgBiscuits from "@/assets/bestseller/bakery-removebg-preview.png";
// Grocery
import vegetables from "@/assets/grocery&kitchen/vegetable1-removebg-preview.png";
import dryfruits from "@/assets/grocery&kitchen/dryFruits-removebg-preview.png";
import fishmeat from "@/assets/grocery&kitchen/fishMeat-removebg-preview.png";
import noodles from "@/assets/grocery&kitchen/noodles-removebg-preview.png";
import teaCoffee from "@/assets/grocery&kitchen/teaCoffee-removebg-preview.png";
import oilMasala from "@/assets/grocery&kitchen/oilMasala-removebg-preview.png";
import frozenFood from "@/assets/grocery&kitchen/frozenfood-removebg-preview.png";
import kitchenWare from "@/assets/grocery&kitchen/kitchenWare1-removebg-preview.png";

import imgBathBody from "@/assets/Beauty&PersonalCare/Bath_Body-removebg-preview.png";
import imgHair from "@/assets/Beauty&PersonalCare/Skin_Face-removebg-preview.png";
import imgSkinFace from "@/assets/Beauty&PersonalCare/Skin_Face-removebg-preview.png";
import imgCosmetics from "@/assets/Beauty&PersonalCare/Beauty_Cosmetics-removebg-preview.png";
import imgHealth from "@/assets/Beauty&PersonalCare/Health_pharma-removebg-preview.png";
import babyCare from "@/assets/Beauty&PersonalCare/baby-care-removebg-preview.png";
import stayFree from "@/assets/Beauty&PersonalCare/stayfree-removebg-preview.png";
import oralcare from "@/assets/Beauty&PersonalCare/oralcare-removebg-preview.png";
// Drinks
import imgCoke from "@/assets/ColdDrinks/cocacola-removebg-preview.png";
import imgSprite from "@/assets/ColdDrinks/sprite-removebg-preview.png";
import imgIcecream2 from "@/assets/grocery&kitchen/icecream.png";
import imgIceCream from "@/assets/Beauty&PersonalCare/icecream-removebg-preview.png";

// Banners
import imgBanner1 from "@/assets/offerpagebanner.png";
import imgBanner2 from "@/assets/collectionspagebanner.png";
import imgBanner3 from "@/assets/top10pagebanner.png";

// New Icons
import imgHeart3D from "@/assets/icons/hearts.png";
import imgHeadphone3D from "@/assets/icons/3dicons-headphone-dynamic-color.png";
import imgBag3D from "@/assets/icons/shopping-bag_18008822.png";
import imgBeauty3D from "@/assets/icons/brushes_11858570.png";
import imgMedicine3D from "@/assets/icons/medicine_5488699.png";

const GroceryPage = () => {
  const navigate = useNavigate();
  const { getGroceryCartCount } = useCart();
  const itemCount = getGroceryCartCount();
  const [activeTab, setActiveTab] = useState("All");

  const [isScrolled, setIsScrolled] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bannerImages, setBannerImages] = useState([imgBanner1, imgBanner2, imgBanner3]);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [vegMode, setVegMode] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [bestSellerItems, setBestSellerItems] = useState([]);

  // Snow effect timer
  useEffect(() => {
    if (activeTab === "Valentine's" || activeTab === "Beauty" || activeTab === "Pharmacy" || activeTab === "Electronics") {
      setShowSnow(true);
      const timer = setTimeout(() => setShowSnow(false), 10000); // 20 seconds
      return () => clearTimeout(timer);
    } else {
      setShowSnow(false);
    }
  }, [activeTab]);

  // Search & Voice Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN'; // Better for Indian context

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const openCategorySheet = (categoryId = "all") => {
    // If categoryId is an object (event), default to 'all' or ignore
    if (typeof categoryId === "object" && categoryId !== null) {
      setSelectedCategoryId("all");
    } else {
      setSelectedCategoryId(categoryId);
    }
    setShowCategorySheet(true);
  };

  // Load dynamic grocery banners (falls back to static banners if empty/fails)
  useEffect(() => {
    const fetchGroceryBanners = async () => {
      try {
        const response = await api.get("/hero-banners/public", {
          params: { platform: "mogrocery" },
        });

        const banners = Array.isArray(response?.data?.data?.banners)
          ? response.data.data.banners
          : [];

        const dynamicImages = banners
          .map((item) => item?.imageUrl)
          .filter((url) => typeof url === "string" && url.trim() !== "");

        if (dynamicImages.length > 0) {
          setBannerImages(dynamicImages);
          setCurrentBanner(0);
        }
      } catch {
        // Keep static fallback banners on error
      }
    };

    fetchGroceryBanners();
  }, []);

  useEffect(() => {
    const fetchHomepageCategories = async () => {
      try {
        const response = await api.get("/grocery/categories", {
          params: { includeSubcategories: true },
        });
        const categories = Array.isArray(response?.data?.data) ? response.data.data : [];
        setHomepageCategories(categories);
      } catch {
        setHomepageCategories([]);
      }
    };

    fetchHomepageCategories();
  }, []);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/hero-banners/grocery-best-sellers/public", {
          params: { platform: "mogrocery" },
        });
        const items = Array.isArray(response?.data?.data?.items) ? response.data.data.items : [];
        setBestSellerItems(items);
      } catch {
        setBestSellerItems([]);
      }
    };

    fetchBestSellers();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (bannerImages.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Handle scroll for sticky header transparency/background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topNavCategories = useMemo(
    () => [
      {
        id: "all",
        name: "All",
        img: imgBag3D,
      },
      ...homepageCategories.map((category) => ({
        id: category?._id || category?.slug || category?.name,
        name: category?.name || "Category",
        img: category?.image || imgBag3D,
      })),
    ],
    [homepageCategories]
  );

  const bestsellers = [
    {
      title: "Vegetables & Fruits",
      count: "+178 more",
      images: [imgCoriander, imgChili, imgPotato, imgOnion],
      categoryId: "fresh-veg",
    },
    {
      title: "Chips & Namkeen",
      count: "+312 more",
      images: [imgLaysBlue, imgKurkure, imgUncle, imgLaysGreen],
      categoryId: "chips-namkeen",
    },
    {
      title: "Oil, Ghee & Masala",
      count: "+96 more",
      images: [imgOil1, imgOil2, imgOil3, imgOil4],
      categoryId: "oil-masala",
    },
    {
      title: "Bakery & Biscuits",
      count: "+118 more",
      images: [imgBakery, imgBread, imgBiscuits, imgAtta],
      categoryId: "bakery-biscuits",
    },
    {
      title: "Sweets & Chocolates",
      count: "+54 more",
      images: [imgIceCream, imgChoclate, imgchoclate2, imgicecream2],
      categoryId: "sweets-choc",
    },
    {
      title: "Dairy, Bread & Eggs",
      count: "+6 more",
      images: [imgMilk, imgBread, imgButter, imgCheese],
      categoryId: "dairy-bread",
    },
  ];

  // Memoize flakes to prevent re-render jumps
  const flakes = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    startX: Math.random() * 100 - 50,
    drift: Math.random() * 100 - 50,
  })), []);

  const homepageCategorySections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const categoryFiltered =
      activeTab === "All"
        ? homepageCategories
        : homepageCategories.filter((category) => category?.name === activeTab);

    return categoryFiltered
      .map((category) => {
        const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
        const filteredSubcategories = query
          ? subcategories.filter((sub) => (sub?.name || "").toLowerCase().includes(query))
          : subcategories;

        const matchesCategory = (category?.name || "").toLowerCase().includes(query);
        return {
          ...category,
          subcategories: matchesCategory ? subcategories : filteredSubcategories,
        };
      })
      .filter((category) => {
        if (!query) return true;
        return (category?.name || "").toLowerCase().includes(query) || category.subcategories.length > 0;
      });
  }, [activeTab, homepageCategories, searchQuery]);

  const visibleBestSellers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (bestSellerItems.length === 0) {
      return bestsellers
        .filter((item) => item.title.toLowerCase().includes(query))
        .map((item) => ({
          id: item.categoryId,
          name: item.title,
          image: item.images?.[0] || "https://via.placeholder.com/120",
          itemType: "legacy",
          categoryId: item.categoryId,
        }));
    }

    return bestSellerItems
      .filter((item) => (item?.name || "").toLowerCase().includes(query))
      .map((item) => ({
        id: item._id,
        name: item.name || "",
        image: item.image || "https://via.placeholder.com/120",
        itemType: item.itemType,
        itemId: item.itemId,
        subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
      }));
  }, [bestSellerItems, bestsellers, searchQuery]);

  const handleBestSellerClick = (item) => {
    if (item.itemType && item.itemType !== "legacy" && item.itemId) {
      navigate(`/grocery/best-seller/${item.itemType}/${item.itemId}`);
      return;
    }

    if (item.itemType === "subcategory" && item.itemId) {
      navigate(`/grocery/subcategory/${item.itemId}`);
      return;
    }

    if (item.itemType === "product") {
      const firstSubcategory = item.subcategories?.[0];
      const subcategoryId =
        typeof firstSubcategory === "string"
          ? firstSubcategory
          : firstSubcategory?._id;
      if (subcategoryId) {
        navigate(`/grocery/subcategory/${subcategoryId}`);
        return;
      }
    }

    if (item.itemType === "legacy" && item.categoryId) {
      openCategorySheet(item.categoryId);
      return;
    }

    navigate("/categories");
  };

  return (
    // Main Container with White Background
    <div className="min-h-screen text-slate-800 pb-24 font-sans w-full shadow-none overflow-x-hidden relative bg-white">
      {/* Snow Effect Overlay */}
      <AnimatePresence>
        {showSnow && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {flakes.map((flake) => (
              <motion.div
                key={flake.id}
                initial={{ y: -20, opacity: 0, x: flake.startX }}
                animate={{
                  y: "100vh",
                  opacity: [0, 1, 1, 0],
                  x: flake.drift
                }}
                transition={{
                  duration: flake.duration,
                  repeat: Infinity,
                  delay: flake.delay,
                  ease: "easeInOut"
                }}
                className={`absolute top-0 ${activeTab === "Electronics" ? "" : "w-2 h-2 bg-white rounded-full blur-[1px]"}`}
                style={{ left: `${flake.left}%` }}
              >
                {activeTab === "Electronics" && (
                  <Snowflake className="w-4 h-4 text-white opacity-80" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      {/* --- 1. HEADER (Yellow) --- */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 bg-white ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="relative z-20">
          {/* Top Info Row - YELLOW BACKGROUND ADDED HERE */}
          <div
            className={`rounded-b-[2.5rem] pb-10 shadow-sm relative z-20 transition-all duration-500 ${activeTab === "Electronics" ? "" :
              activeTab === "Beauty" ? "" :
                activeTab === "Pharmacy" ? "" :
                  activeTab === "Valentine's" ? "" : "bg-[#FACC15]"
              }`}
            style={
              activeTab === "Valentine's"
                ? { background: "linear-gradient(0deg, #EF4F5F 38%, #F58290 63%)" }
                : activeTab === "Electronics"
                  ? { background: "linear-gradient(0deg,rgba(160, 213, 222, 1) 38%, rgba(81, 184, 175, 1) 63%)" }
                  : activeTab === "Beauty"
                    ? { background: "linear-gradient(0deg,rgba(240, 134, 183, 1) 58%, rgba(235, 124, 176, 1) 63%)" }
                    : activeTab === "Pharmacy"
                      ? { background: "linear-gradient(0deg,#EF4F5F 22%, #D63D4D 63%)" }
                      : {}
            }
          >
            <div className="px-4 pt-6 flex justify-between items-start mb-0">
              <div className="flex flex-col">
                <h1 className="text-[10px] uppercase font-black tracking-[0.15em] text-[#3e3212] leading-none mb-0.5">
                  MoBasket in
                </h1>
                <div className="flex items-baseline gap-2 leading-none">
                  <span
                    className="text-[1.5rem] font-[900] text-[#1a1a1a] tracking-tight -ml-0.5"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    8 minutes
                  </span>
                </div>
                <div className="flex items-center gap-1 -mt-0.5 cursor-pointer">
                  <span className="text-[#1a1a1a] text-[0.85rem] font-bold tracking-tight line-clamp-1">
                    Vandana Nagar, Indore
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-[#1a1a1a] stroke-[3]"
                  />
                </div>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8 items-center bg-white rounded-xl px-4 py-2.5 shadow-sm border border-transparent focus-within:border-black/10 transition-colors">
                <Search className="h-4 w-4 text-slate-500 stroke-[2.5] mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "chocolate"'
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
                />
              </div>

              {/* Desktop Nav Icons */}
              <div className="hidden md:flex items-center gap-4 mx-4 max-w-[48vw] overflow-x-auto no-scrollbar">
                {topNavCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex flex-col items-center gap-1 cursor-pointer group px-2 py-1 rounded-xl transition-colors ${cat.name === activeTab ? "bg-white/55" : "hover:bg-white/35"
                      }`}
                    onClick={() => setActiveTab(cat.name)}
                  >
                    <div className="relative transition-transform group-hover:scale-110">
                      {cat.name === activeTab && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4F5F] rounded-full border border-[#fc9b03] z-10"></div>
                      )}
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-8 h-8 object-contain drop-shadow-sm rounded-full"
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold max-w-[68px] text-center line-clamp-1 ${activeTab === cat.name ? "text-[#3e3212]" : "text-[#3e3212]/70"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Profile & Cart Icons */}
              <div className="flex gap-2 mt-1">
                {/* Cart Icon */}
                <button
                  className="relative w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                  onClick={() => navigate("/grocery/cart")}
                >
                  <ShoppingCart size={16} className="text-white" />
                  {itemCount > 0 && (
                    <motion.div
                      key={itemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 bg-[#EF4F5F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white"
                    >
                      {itemCount}
                    </motion.div>
                  )}
                </button>

                <button
                  className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                  onClick={() => navigate("/grocery/profile")}
                >
                  <User size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar (Mobile) - OUTSIDE YELLOW BOX */}
          <div className="px-4 mt-3 mb-2 relative z-30 md:hidden">
            <div className="bg-gray-100 rounded-2xl h-12 flex items-center px-4 border border-transparent focus-within:border-black/5 transition-all w-full">
              <Search className="text-slate-400 w-5 h-5 stroke-[2.5] mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "pet food"'
                className="flex-1 bg-transparent text-slate-800 text-[15px] font-semibold outline-none placeholder:text-slate-400/90 h-full"
              />
              <div className="w-[1px] h-6 bg-slate-200 mx-3"></div>
              <Mic
                onClick={startListening}
                className={`w-5 h-5 stroke-[2.5] transition-colors cursor-pointer ${isListening ? "text-[#EF4F5F] animate-pulse" : "text-slate-400"}`}
              />
            </div>
          </div>

          {/* Nav Tabs (Mobile Only) - OUTSIDE YELLOW BOX */}
          <div className="px-2 pb-2 mt-2 md:hidden">
            <div className="flex items-end gap-3 overflow-x-auto scrollbar-hide no-scrollbar px-2 w-full">
              {topNavCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer min-w-[68px] px-1 py-1 rounded-xl transition-colors ${activeTab === cat.name ? "bg-white/55" : "hover:bg-white/35"
                    }`}
                  onClick={() => setActiveTab(cat.name)}
                >
                  <div className="relative">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-10 h-10 object-contain drop-shadow-md rounded-full"
                    />
                  </div>
                  <span
                    className={`text-[11px] font-bold tracking-tight text-center line-clamp-2 min-h-[30px] ${activeTab === cat.name ? "text-[#1a1a1a]" : "text-[#1a1a1a]/80"}`}
                  >
                    {cat.name}
                  </span>
                  {activeTab === cat.name && <div className="w-6 h-0.5 bg-[#1a1a1a] rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. DYNAMIC BANNER CAROUSEL --- */}
      <div className="relative z-0 -mt-1 animate-fade-in-up px-4 pt-2 pb-1 md:max-w-6xl mx-auto">
        {/* Carousel Container */}
        <div className="relative w-full aspect-[1.8/1] md:aspect-[3/1] bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden">
          {bannerImages.map((bannerImg, index) => (
            <div
              key={`${bannerImg}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <img
                src={bannerImg}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {bannerImages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? "bg-white w-4" : "bg-white/50"
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. BESTSELLERS (Transparent) --- */}
      <div className="px-4 pt-4 pb-2 relative z-10 md:max-w-6xl md:mx-auto">
        <h3 className="text-lg font-[800] text-[#3e2723] mb-4">Bestsellers</h3>

        <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide no-scrollbar pb-4 px-2 snap-x snap-mandatory touch-pan-x">
          {visibleBestSellers.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="min-w-[160px] max-w-[160px] snap-center p-2.5 bg-[#eff3f6] rounded-[24px] flex flex-col relative group cursor-pointer active:scale-95 transition-transform shadow-[0_8px_10px_rgba(0,0,0,0.2)] border border-white/60"
              onClick={() => handleBestSellerClick(item)}
            >
              {/* Image Grid */}
              <div className="w-full h-[148px] mb-3 bg-white rounded-[14px] flex items-center justify-center p-2 overflow-hidden relative shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title */}
              <div className="mt-auto text-center flex items-end justify-center pb-1">
                <p className="text-[15px] font-[800] text-[#1a1a1a] leading-[1.2] tracking-tight whitespace-pre-line">
                  {(item.name || "").replace("&", "&\n")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {homepageCategorySections.map((category, sectionIndex) => (
        <div
          key={category._id || category.slug || category.name}
          className={`px-4 relative z-10 md:max-w-6xl md:mx-auto ${sectionIndex === homepageCategorySections.length - 1 ? "pb-24" : "pb-6"}`}
        >
          <h3 className="text-lg font-[800] text-[#3e2723] mb-4">{category.name}</h3>
          {(!category.subcategories || category.subcategories.length === 0) && (
            <p className="text-sm text-slate-500 mb-2">No subcategories available.</p>
          )}
          <div className="grid grid-cols-4 gap-2">
            {(category.subcategories || []).map((subcategory) => (
              <div
                key={subcategory._id}
                className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                onClick={() => navigate(`/grocery/subcategory/${subcategory._id}`)}
              >
                <div
                  className="w-full aspect-square rounded-[20px] flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white overflow-hidden relative"
                  style={{
                    background: "radial-gradient(circle at center, #ffffff 40%, #f6ffd9 100%)",
                  }}
                >
                  <img
                    src={subcategory.image || "https://via.placeholder.com/120"}
                    alt={subcategory.name}
                    className="w-full h-full object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] transition-transform duration-300"
                  />
                </div>
                <div className="h-8 flex items-start justify-center w-full">
                  <p className="text-[12px] font-[800] text-center text-[#1a1a1a] leading-tight px-0.5 line-clamp-2">
                    {subcategory.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* --- 8. BOTTOM FLOATING OFFER --- */}

      {/* --- 6. BOTTOM NAVIGATION (Fixed) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-slate-100 py-2 px-6 flex justify-between md:justify-center md:gap-28 items-end z-50 w-full pb-4">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => navigate("/grocery")}
        >
          <Home size={24} className="text-slate-900 fill-current" />
          <span className="text-[10px] font-bold text-slate-900">Home</span>
          <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/plans")}
        >
          <ShoppingBag size={24} />
          <span className="text-[10px] font-medium">Plan</span>
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/categories")}
        >
          <LayoutGrid size={24} />
          <span className="text-[10px] font-medium">Categories</span>
        </div>

        <button
          className="mb-1 bg-[#EF4F5F] hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          onClick={() => navigate("/home")}
        >
          <span className="font-black italic text-lg tracking-tighter">
            Mofood
          </span>
        </button>
      </div>

      <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(-50%) rotate(-12deg); }
                    50% { transform: translateY(-60%) rotate(-10deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(-50%) rotate(12deg) scaleX(-1); }
                    50% { transform: translateY(-60%) rotate(10deg) scaleX(-1); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite 2s;
                }
                @keyframes slide-in-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-in-up {
                    animation: slide-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
      {/* --- BOTTOM SHEET MODAL --- */}
      <AnimatePresence>
        {showCategorySheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategorySheet(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            {/* Sheet Container (Wrapper for Button + Content) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setShowCategorySheet(false);
                }
              }}
              className="fixed bottom-0 left-0 right-0 h-[92vh] z-[60] w-full"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setShowCategorySheet(false)}
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#1a1a1a] p-2.5 rounded-full shadow-lg border border-white/20 active:scale-95 transition-transform z-[80] flex items-center justify-center cursor-pointer"
              >
                <X size={22} className="text-white" strokeWidth={2.5} />
              </button>

              {/* Actual Sheet Content */}
              <div className="h-full bg-white rounded-t-[20px] overflow-hidden relative shadow-2xl">
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 left-0 z-[70] pointer-events-none">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                <div className="h-full pt-2">
                  <CategoryFoodsContent
                    onClose={() => setShowCategorySheet(false)}
                    isModal={true}
                    initialCategory={selectedCategoryId}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroceryPage;
