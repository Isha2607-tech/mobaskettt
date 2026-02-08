import React, { useState, useEffect } from "react";
import {
  Search,
  Mic,
  ChevronDown,
  User,
  ShoppingBag,
  Zap,
  Heart,
  Home,
  LayoutGrid,
  Printer,
  Monitor,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryFoodsContent } from "./CategoryFoodsPage";

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
  const [activeTab, setActiveTab] = useState("All");

  const [isScrolled, setIsScrolled] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [vegMode, setVegMode] = useState(false);

  const openCategorySheet = (categoryId = "all") => {
    // If categoryId is an object (event), default to 'all' or ignore
    if (typeof categoryId === "object" && categoryId !== null) {
      setSelectedCategoryId("all");
    } else {
      setSelectedCategoryId(categoryId);
    }
    setShowCategorySheet(true);
  };

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for sticky header transparency/background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    {
      id: "all",
      name: "All",
      img: imgBag3D,
    },
    {
      id: "val",
      name: "Valentine's",
      img: imgHeart3D,
    },
    {
      id: "elec",
      name: "Electronics",
      img: imgHeadphone3D,
    },
    { id: "beau", name: "Beauty", img: imgBeauty3D },
    { id: "phar", name: "Pharmacy", img: imgMedicine3D },
  ];

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

  return (
    // Main Container with Single Continuous Gradient
    <div className="min-h-screen text-slate-800 pb-24 font-sans w-full shadow-none overflow-x-hidden relative bg-gradient-to-b from-[#fde047] via-[#fff176] to-[#C7EA46]">
      {/* --- 1. HEADER (Transparent to blend with main gradient) --- */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-[#fde047]/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      >
        <div className="pt-3 pb-0 relative z-20">
          {/* Top Info Row */}
          <div className="px-4 pt-3 pb-2 relative z-20">
            <div className="flex justify-between items-start mb-0">
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
                  placeholder='Search "chocolate"'
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
                />
              </div>

              {/* Desktop Nav Icons */}
              <div className="hidden md:flex items-center gap-8 mx-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                    onClick={() => setActiveTab(cat.name)}
                  >
                    <div className="relative transition-transform group-hover:scale-110">
                      {cat.name === activeTab && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#fc9b03] z-10"></div>
                      )}
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-8 h-8 object-contain drop-shadow-sm"
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold ${activeTab === cat.name ? "text-[#3e3212]" : "text-[#3e3212]/60"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Profile Icons */}
              <div className="flex gap-2 mt-1">
                <button
                  className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                  onClick={() => navigate("/grocery/profile")}
                >
                  <User size={16} className="text-white" />
                </button>
              </div>
            </div>
            {/* Search Bar (Mobile) */}
            <div className="mt-3 mb-2 relative z-30 md:hidden">
              <div className="bg-white rounded-2xl h-12 flex items-center px-4 shadow-sm border border-transparent focus-within:border-black/5 transition-all w-full">
                <Search className="text-slate-400 w-5 h-5 stroke-[2.5] mr-3" />
                <input
                  type="text"
                  placeholder='Search "pet food"'
                  className="flex-1 bg-transparent text-slate-800 text-[15px] font-semibold outline-none placeholder:text-slate-400/90 h-full"
                />
                <div className="w-[1px] h-6 bg-slate-200 mx-3"></div>
                <Mic className="text-slate-400 w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Nav Tabs (Mobile Only) */}
          <div className="px-2 pb-2 mt-2 md:hidden">
            <div className="flex justify-between items-end gap-2 overflow-x-auto scrollbar-hide no-scrollbar px-2 w-full">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center gap-1.5 cursor-pointer min-w-[60px]"
                  onClick={() => setActiveTab(cat.name)}
                >
                  <div className="relative">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-10 h-10 object-contain drop-shadow-md"
                    />
                  </div>
                  <span
                    className={`text-[12px] font-bold tracking-tight ${activeTab === cat.name ? "text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-0.5" : "text-[#1a1a1a]/80"}`}
                  >
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. DYNAMIC BANNER CAROUSEL --- */}
      <div className="relative z-0 -mt-1 animate-fade-in-up px-4 pt-2 pb-1 md:max-w-6xl mx-auto">
        {/* Carousel Container */}
        <div className="relative w-full aspect-[2.4/1] md:aspect-[4.8/1] bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden">
          {[
            { id: 1, img: imgBanner1 },
            { id: 2, img: imgBanner2 },
            { id: 3, img: imgBanner3 },
          ].map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
                index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={banner.img}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentBanner ? "bg-white w-4" : "bg-white/50"
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
          {bestsellers.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[160px] max-w-[160px] snap-center p-2.5 bg-[#eff3f6] rounded-[24px] flex flex-col relative group cursor-pointer active:scale-95 transition-transform shadow-[0_8px_10px_rgba(0,0,0,0.2)] border border-white/60"
              onClick={() => openCategorySheet(item.categoryId)}
            >
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-1.5 w-full h-[148px] mb-3">
                {item.images.map((img, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[14px] flex items-center justify-center p-0 overflow-hidden relative shadow-sm"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                ))}
              </div>

              {/* Floating Badge */}
              <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white z-10 whitespace-nowrap leading-none transform scale-90">
                <span className="text-[11px] font-[800] text-[#1a1a1a] tracking-tight">
                  {item.count}
                </span>
              </div>

              {/* Title */}
              <div className="mt-auto text-center flex items-end justify-center pb-1">
                <p className="text-[15px] font-[800] text-[#1a1a1a] leading-[1.2] tracking-tight whitespace-pre-line">
                  {item.title.replace("&", "&\n")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 5. GROCERY & KITCHEN --- */}
      <div className="px-4 pb-6 relative z-10 md:max-w-6xl md:mx-auto">
        <h3 className="text-lg font-[800] text-[#3e2723] mb-4">
          Grocery & Kitchen
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              name: "Vegetables & Fruits",
              img: vegetables,
              categoryId: "fresh-veg",
              span: "col-span-2",
              aspect: "aspect-[2.1/1]",
              scale: 1.1,
            },
            {
              name: "Atta, Rice & Dal",
              img: imgAtta,
              categoryId: "atta-rice-dal",
            },
            {
              name: "Oil, Ghee & Masala",
              img: oilMasala,
              categoryId: "oil-masala",
            },
            {
              name: "Dairy, Bread & Eggs",
              img: imgMilk,
              categoryId: "dairy-bread",
            },
            {
              name: "Bakery & Biscuits",
              img: imgBakery,
              categoryId: "bakery-biscuits",
            },
            {
              name: "Dry Fruits & Cereals",
              img: dryfruits,
              categoryId: "all",
              scale: 1.1,
            },
            { name: "Chicken, Meat & Fish", img: fishmeat, categoryId: "all" },
            {
              name: "Kitchenware & Appliances",
              img: kitchenWare,
              categoryId: "cleaning",
              scale: 1.3,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform ${item.span || ""}`}
              onClick={() => openCategorySheet(item.categoryId)}
            >
              <div
                className={`w-full ${item.aspect || "aspect-square"} rounded-[20px] flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white overflow-hidden relative`}
                style={{
                  background:
                    "radial-gradient(circle at center, #ffffff 40%, #f6ffd9 100%)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    transform: item.scale ? `scale(${item.scale})` : "none",
                  }}
                  className="w-full h-full object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] transition-transform duration-300"
                />
              </div>
              <div className="h-8 flex items-start justify-center w-full">
                <p className="text-[12px] font-[800] text-center text-[#1a1a1a] leading-tight px-0.5 line-clamp-2">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 6. SNACKS & DRINKS --- */}
      <div className="px-4 pb-6 relative z-10 md:max-w-6xl md:mx-auto">
        <h3 className="text-lg font-[800] text-[#3e2723] mb-4">
          Snacks & Drinks
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              name: "Ice Creams",
              img: imgIcecream2,
              categoryId: "sweets-choc",
              span: "col-span-2",
              aspect: "aspect-[2.1/1]",
              scale: 1.1,
            },
            {
              name: "Chips & Namkeen",
              img: imgLaysBlue,
              categoryId: "chips-namkeen",
            },
            {
              name: "Sweets & Chocolates",
              img: imgChoclate,
              categoryId: "sweets-choc",
            },
            {
              name: "Cold Drinks & Juices",
              img: imgCoke,
              categoryId: "drinks-juices",
            },
            {
              name: "Noodles & Pasta",
              img: noodles,
              categoryId: "all",
              scale: 1.2,
            },
            {
              name: "Frozen Food",
              img: frozenFood,
              categoryId: "all",
              scale: 1.2,
            },
            {
              name: "Tea & Coffee",
              img: teaCoffee,
              categoryId: "tea-coffee",
              scale: 1.1,
            },
            { name: "Biscuits", img: imgBakery, categoryId: "bakery-biscuits" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform ${item.span || ""}`}
              onClick={() => openCategorySheet(item.categoryId)}
            >
              <div
                className={`w-full ${item.aspect || "aspect-square"} rounded-[20px] flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white overflow-hidden relative`}
                style={{
                  background:
                    "radial-gradient(circle at center, #ffffff 40%, #f6ffd9 100%)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    transform: item.scale ? `scale(${item.scale})` : "none",
                  }}
                  className="w-full h-full object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] transition-transform duration-300"
                />
              </div>
              <div className="h-8 flex items-start justify-center w-full">
                <p className="text-[12px] font-[800] text-center text-[#1a1a1a] leading-tight px-0.5 line-clamp-2">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 7. BEAUTY & PERSONAL CARE --- */}
      <div className="px-4 pb-24 relative z-10 md:max-w-6xl md:mx-auto">
        <h3 className="text-lg font-[800] text-[#3e2723] mb-4">
          Beauty & Personal Care
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              name: "Bath & Body",
              img: imgBathBody,
              categoryId: "beauty",
              span: "col-span-2",
              aspect: "aspect-[2.1/1]",
              scale: 1.1,
            },
            { name: "Hair", img: imgHair, categoryId: "beauty" },
            { name: "Skin & Face", img: imgSkinFace, categoryId: "beauty" },
            {
              name: "Beauty & Cosmetics",
              img: imgCosmetics,
              categoryId: "beauty",
            },
            { name: "Health & Pharma", img: imgHealth, categoryId: "beauty" },
            {
              name: "Feminine Hygiene",
              img: stayFree,
              categoryId: "beauty",
              scale: 1.2,
            },
            {
              name: "Baby Care",
              img: babyCare,
              categoryId: "beauty",
              scale: 1.2,
            },
            {
              name: "Oral Care",
              img: oralcare,
              categoryId: "beauty",
              scale: 1.2,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform ${item.span || ""}`}
              onClick={() => openCategorySheet(item.categoryId)}
            >
              <div
                className={`w-full ${item.aspect || "aspect-square"} rounded-[20px] flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white overflow-hidden relative`}
                style={{
                  background:
                    "radial-gradient(circle at center, #ffffff 40%, #f6ffd9 100%)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
                />
              </div>
              <div className="h-8 flex items-start justify-center w-full">
                <p className="text-[12px] font-[800] text-center text-[#1a1a1a] leading-tight px-0.5 line-clamp-2">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

        <button className="mb-1" onClick={() => navigate("/")}>
          <span className="text-red-600 font-black italic text-xl tracking-tighter">
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
