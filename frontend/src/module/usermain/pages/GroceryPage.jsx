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
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../user/context/CartContext";
import { useLocation as useUserLocation } from "../../user/hooks/useLocation";
import { CategoryFoodsContent } from "./CategoryFoodsPage";
import api, { restaurantAPI } from "@/lib/api";

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
  const routerLocation = useRouterLocation();
  const { getGroceryCartCount, addToCart, isInCart } = useCart();
  const { location: userLocation } = useUserLocation();
  const isGroceryCategoriesRoute = routerLocation.pathname === "/grocery/categories";
  const itemCount = getGroceryCartCount();
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeSubcategoryId, setActiveSubcategoryId] = useState("all-subcategories");

  const [isScrolled, setIsScrolled] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bannerImages, setBannerImages] = useState([imgBanner1, imgBanner2, imgBanner3]);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [vegMode, setVegMode] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [bestSellerItems, setBestSellerItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [groceryStores, setGroceryStores] = useState([]);
  const [hasActiveGroceryStore, setHasActiveGroceryStore] = useState(true);

  const getStoreCoordinates = (store) => {
    const geoCoordinates = store?.location?.coordinates;
    if (
      Array.isArray(geoCoordinates) &&
      geoCoordinates.length >= 2 &&
      Number.isFinite(Number(geoCoordinates[0])) &&
      Number.isFinite(Number(geoCoordinates[1]))
    ) {
      return { lng: Number(geoCoordinates[0]), lat: Number(geoCoordinates[1]) };
    }

    const lat = Number(store?.location?.latitude);
    const lng = Number(store?.location?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }

    return null;
  };

  const calculateDistanceKm = (lat1, lng1, lat2, lng2) => {
    const earthRadiusKm = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

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
  const hasActiveSearch = searchQuery.trim().length > 0;

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/grocery/products", {
          params: { page: 1, limit: 1000 },
        });
        const products = Array.isArray(response?.data?.data) ? response.data.data : [];
        setAllProducts(products);
      } catch {
        setAllProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchGroceryStores = async () => {
      try {
        const response = await restaurantAPI.getRestaurants({ limit: 200 });
        const restaurants = Array.isArray(response?.data?.data?.restaurants)
          ? response.data.data.restaurants
          : [];
        const moGroceryStores = restaurants.filter((restaurant) => restaurant?.platform === "mogrocery");
        const activeStores = moGroceryStores.filter((restaurant) => restaurant?.isActive !== false);
        setGroceryStores(activeStores);
        setHasActiveGroceryStore(activeStores.length > 0);
      } catch {
        setGroceryStores([]);
        setHasActiveGroceryStore(false);
      }
    };

    fetchGroceryStores();
  }, []);

  const isGroceryUnavailable = !hasActiveGroceryStore;

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

  const normalizedSidebarSubcategories = useMemo(() => {
    const categoriesToUse =
      activeCategoryId === "all"
        ? homepageCategories
        : homepageCategories.filter(
            (category) => String(category?._id || category?.slug || category?.name) === String(activeCategoryId)
          );

    const map = new Map();
    categoriesToUse.forEach((category) => {
      const categoryKey = String(category?._id || category?.slug || category?.name || "");
      const categoryName = category?.name || "Category";
      const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];
      subcategories.forEach((subcategory) => {
        if (!subcategory?._id) return;
        map.set(String(subcategory._id), {
          _id: String(subcategory._id),
          name: subcategory?.name || "Subcategory",
          image: subcategory?.image || "https://via.placeholder.com/120",
          categoryId: categoryKey,
          categoryName,
        });
      });
    });

    return Array.from(map.values());
  }, [activeCategoryId, homepageCategories]);

  const visibleLayoutProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const productCategoryId = String(
        product?.category?._id || product?.category?.id || product?.category || ""
      );
      const productSubcategoryIds = [
        ...(Array.isArray(product?.subcategories) ? product.subcategories : []),
        product?.subcategory,
      ]
        .map((subcategory) => String(subcategory?._id || subcategory?.id || subcategory || ""))
        .filter(Boolean);

      const categoryMatch =
        activeCategoryId === "all" ||
        productCategoryId === String(activeCategoryId) ||
        String(product?.category?.name || "") === String(activeTab);

      const subcategoryMatch =
        activeSubcategoryId === "all-subcategories" ||
        productSubcategoryIds.includes(String(activeSubcategoryId));

      return categoryMatch && subcategoryMatch;
    });
  }, [activeCategoryId, activeSubcategoryId, activeTab, allProducts]);

  const isNoBgImageCandidate = (imageUrl) => {
    if (typeof imageUrl !== "string" || !imageUrl.trim()) return false;
    const value = imageUrl.toLowerCase();
    return (
      value.includes("removebg") ||
      value.includes("transparent") ||
      value.includes("no-bg") ||
      value.includes("nobg") ||
      value.endsWith(".png") ||
      value.endsWith(".webp")
    );
  };

  const extractImageUrl = (imageValue) => {
    if (typeof imageValue === "string") return imageValue;
    if (imageValue && typeof imageValue === "object") {
      return (
        imageValue.url ||
        imageValue.image ||
        imageValue.imageUrl ||
        imageValue.secure_url ||
        imageValue.src ||
        ""
      );
    }
    return "";
  };

  const getProductImageList = (product) => {
    const imageList = Array.isArray(product?.images)
      ? product.images.map(extractImageUrl).filter((img) => typeof img === "string" && img.trim())
      : [];

    const singleImage = extractImageUrl(product?.image);
    if (singleImage) imageList.push(singleImage);

    return Array.from(new Set(imageList));
  };

  const getProductImage = (product) => {
    const imageList = getProductImageList(product);

    if (imageList.length > 0) {
      const noBgImage = imageList.find((img) => isNoBgImageCandidate(img));
      return noBgImage || imageList[0];
    }

    return "https://via.placeholder.com/200";
  };

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
      query
        ? homepageCategories
        : activeTab === "All"
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

  const homepageCategoryDisplaySections = useMemo(() => {
    return homepageCategorySections.map((category) => {
      const categoryId = String(category?._id || category?.slug || category?.name || "");
      const subcategories = Array.isArray(category?.subcategories) ? category.subcategories : [];

      const baseCards = subcategories.map((subcategory, subIndex) => {
        return {
          _id: String(subcategory?._id || `${categoryId}-subcategory-${subIndex}`),
          name: subcategory?.name || "Subcategory",
          image: subcategory?.image || "https://via.placeholder.com/120",
          __kind: "subcategory",
          targetSubcategoryId: subcategory?._id ? String(subcategory._id) : null,
        };
      });

      const productCards = allProducts
        .filter((product) => {
          const productCategoryId = String(
            product?.category?._id || product?.category?.id || product?.category || ""
          );
          return categoryId && productCategoryId === categoryId;
        })
        .slice(0, 60)
        .map((product, productIndex) => {
          const firstSubcategoryId =
            (Array.isArray(product?.subcategories) && product.subcategories[0]?._id) ||
            product?.subcategory?._id ||
            null;

          return {
            _id: `product-card-${product?._id || product?.id || productIndex}`,
            name: product?.name || "Product",
            image: getProductImage(product),
            __kind: "product",
            targetSubcategoryId: firstSubcategoryId ? String(firstSubcategoryId) : null,
          };
        });

      const cards = [...baseCards];
      for (const productCard of productCards) {
        if (cards.length >= 40) break;
        cards.push(productCard);
      }

      return {
        ...category,
        homepageCards: cards,
      };
    });
  }, [allProducts, homepageCategorySections]);

  const visibleSearchProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    return allProducts.filter((product) => {
      const name = String(product?.name || "").toLowerCase();
      const description = String(product?.description || "").toLowerCase();
      const categoryName = String(product?.category?.name || "").toLowerCase();
      const unit = String(product?.unit || "").toLowerCase();
      const subcategoryNames = [
        ...(Array.isArray(product?.subcategories) ? product.subcategories : []),
        product?.subcategory,
      ]
        .map((subcat) => String(subcat?.name || "").toLowerCase())
        .filter(Boolean)
        .join(" ");

      return (
        name.includes(query) ||
        description.includes(query) ||
        categoryName.includes(query) ||
        unit.includes(query) ||
        subcategoryNames.includes(query)
      );
    });
  }, [allProducts, searchQuery]);

  const visibleBestSellers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const getPreviewImagesForItem = (item) => {
      const explicitImages = Array.isArray(item?.images)
        ? item.images.map(extractImageUrl).filter((img) => typeof img === "string" && img.trim())
        : [];
      const uniqueExplicitImages = Array.from(new Set(explicitImages));
      if (uniqueExplicitImages.length >= 2) {
        return uniqueExplicitImages.slice(0, 4);
      }

      const type = String(item?.itemType || "");
      const targetId = String(item?.itemId || "");

      const productImages = allProducts
        .filter((product) => {
          if (!targetId) return false;

          if (type === "category") {
            const productCategoryId = String(
              product?.category?._id || product?.category?.id || product?.category || ""
            );
            return productCategoryId === targetId;
          }

          if (type === "subcategory") {
            const productSubcategoryIds = [
              ...(Array.isArray(product?.subcategories) ? product.subcategories : []),
              product?.subcategory,
            ]
              .map((subcat) => String(subcat?._id || subcat?.id || subcat || ""))
              .filter(Boolean);
            return productSubcategoryIds.includes(targetId);
          }

          return false;
        })
        .map((product) => getProductImage(product))
        .filter((img) => typeof img === "string" && img.trim());

      const uniqueProductImages = Array.from(new Set(productImages));
      if (uniqueProductImages.length > 0) {
        return uniqueProductImages.slice(0, 4);
      }

      return [item?.image || "https://via.placeholder.com/120"];
    };

    const getProductCountForItem = (item) => {
      const type = String(item?.itemType || "");
      const targetId = String(item?.itemId || "");
      if (!targetId) return 0;

      if (type === "category") {
        return allProducts.filter((product) => {
          const productCategoryId = String(
            product?.category?._id || product?.category?.id || product?.category || ""
          );
          return productCategoryId === targetId;
        }).length;
      }

      if (type === "subcategory") {
        return allProducts.filter((product) => {
          const productSubcategoryIds = [
            ...(Array.isArray(product?.subcategories) ? product.subcategories : []),
            product?.subcategory,
          ]
            .map((subcat) => String(subcat?._id || subcat?.id || subcat || ""))
            .filter(Boolean);
          return productSubcategoryIds.includes(targetId);
        }).length;
      }

      return 0;
    };

    if (bestSellerItems.length === 0) {
      return bestsellers
        .filter((item) => item.title.toLowerCase().includes(query))
        .map((item) => ({
          id: item.categoryId,
          name: item.title,
          image: item.images?.[0] || "https://via.placeholder.com/120",
          previewImages: (item.images || []).slice(0, 4),
          countLabel: item.count || "",
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
        previewImages: getPreviewImagesForItem(item),
        countLabel: (() => {
          if (item?.countLabel) return item.countLabel;
          if (item?.count) return item.count;
          if (Number.isFinite(Number(item?.productCount))) return `+${Number(item.productCount)} more`;
          const derivedCount = getProductCountForItem(item);
          return derivedCount > 0 ? `+${derivedCount} more` : "";
        })(),
        itemType: item.itemType,
        itemId: item.itemId,
        subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
      }));
  }, [allProducts, bestSellerItems, bestsellers, searchQuery]);

  useEffect(() => {
    setActiveSubcategoryId("all-subcategories");
  }, [activeCategoryId]);

  useEffect(() => {
    if (!isGroceryCategoriesRoute) return;

    setSearchQuery("");
    setActiveSubcategoryId("all-subcategories");

    const firstCategory = homepageCategories?.[0];
    if (firstCategory) {
      const categoryId = String(firstCategory?._id || firstCategory?.slug || firstCategory?.name || "all");
      setActiveTab(firstCategory?.name || "All");
      setActiveCategoryId(categoryId);
    } else {
      setActiveTab("All");
      setActiveCategoryId("all");
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [homepageCategories, isGroceryCategoriesRoute]);

  const hasAnySearchMatch = useMemo(() => {
    if (!hasActiveSearch) return true;
    return (
      homepageCategorySections.length > 0 ||
      visibleSearchProducts.length > 0 ||
      visibleBestSellers.length > 0
    );
  }, [hasActiveSearch, homepageCategorySections.length, visibleBestSellers.length, visibleSearchProducts.length]);

  const nearestStoreDistanceKm = useMemo(() => {
    const userLat = Number(userLocation?.latitude);
    const userLng = Number(userLocation?.longitude);
    if (!Number.isFinite(userLat) || !Number.isFinite(userLng) || groceryStores.length === 0) {
      return null;
    }

    let nearestDistance = null;
    for (const store of groceryStores) {
      const coords = getStoreCoordinates(store);
      if (!coords) continue;

      const distanceKm = calculateDistanceKm(userLat, userLng, coords.lat, coords.lng);
      if (!Number.isFinite(distanceKm)) continue;
      if (nearestDistance === null || distanceKm < nearestDistance) {
        nearestDistance = distanceKm;
      }
    }

    return nearestDistance;
  }, [groceryStores, userLocation?.latitude, userLocation?.longitude]);

  const deliveryEtaMinutes = useMemo(() => {
    if (!Number.isFinite(nearestStoreDistanceKm)) return 8;
    // Base prep/packing + travel estimate (~4 min per km)
    return Math.max(8, Math.min(60, Math.round(8 + nearestStoreDistanceKm * 4)));
  }, [nearestStoreDistanceKm]);

  const topAddress = useMemo(() => {
    const formattedAddress = (userLocation?.formattedAddress || "").trim();
    if (formattedAddress) {
      return formattedAddress;
    }

    const address = (userLocation?.address || "").trim();
    if (address) {
      return address;
    }

    const fallbackParts = [
      userLocation?.street,
      userLocation?.area,
      userLocation?.city,
      userLocation?.state,
      userLocation?.postalCode || userLocation?.zipCode,
    ]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean);

    if (fallbackParts.length) {
      return fallbackParts.join(", ");
    }

    return (
      "Select your location"
    );
  }, [userLocation]);

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

  const handleAddProductToCart = (product) => {
    addToCart({
      id: product?._id || product?.id,
      name: product?.name || "Product",
      price: Number(product?.sellingPrice || 0),
      mrp: Number(product?.mrp || 0),
      weight: product?.unit || "",
      image: getProductImage(product),
      restaurantId: "grocery-store",
      restaurant: "MoGrocery",
    });
  };

  const handleCategoriesNavClick = () => {
    if (isGroceryCategoriesRoute) {
      setSearchQuery("");
      setActiveSubcategoryId("all-subcategories");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    navigate("/grocery/categories");
  };

  const handleHomeNavClick = () => {
    setSearchQuery("");
    setActiveTab("All");
    setActiveCategoryId("all");
    setActiveSubcategoryId("all-subcategories");

    if (!routerLocation.pathname.startsWith("/grocery") || isGroceryCategoriesRoute) {
      navigate("/grocery");
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    // Main Container with White Background
    <div
      className={`min-h-screen text-slate-800 pb-24 font-sans w-full shadow-none overflow-x-hidden relative bg-white ${
        isGroceryUnavailable ? "grayscale-[0.95] opacity-70" : ""
      }`}
    >
      {isGroceryUnavailable && (
        <div className="fixed top-[88px] left-1/2 -translate-x-1/2 z-[95] px-4">
          <div className="rounded-xl border border-slate-300 bg-white/95 backdrop-blur px-4 py-2 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 text-center">
              MoGrocery is currently unavailable. Store is offline.
            </p>
          </div>
        </div>
      )}
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
                    {deliveryEtaMinutes} minutes
                  </span>
                </div>
                <div className="flex items-center gap-1 -mt-0.5 cursor-pointer">
                  <span className="text-[#1a1a1a] text-[0.8rem] font-bold tracking-tight leading-tight line-clamp-2">
                    {topAddress}
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
              {!hasActiveSearch && (
                <div className="hidden md:flex items-center gap-4 mx-4 max-w-[48vw] overflow-x-auto no-scrollbar">
                  {topNavCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`flex flex-col items-center gap-1 cursor-pointer group px-2 py-1 rounded-xl transition-colors ${cat.name === activeTab ? "bg-white/55" : "hover:bg-white/35"
                        }`}
                      onClick={() => {
                        setActiveTab(cat.name);
                        setActiveCategoryId(cat.id);
                      }}
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
              )}

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
          {!hasActiveSearch && (
            <div className="px-2 pb-2 mt-2 md:hidden">
              <div className="flex items-end gap-3 overflow-x-auto scrollbar-hide no-scrollbar px-2 w-full">
                {topNavCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex flex-col items-center gap-1.5 cursor-pointer min-w-[68px] px-1 py-1 rounded-xl transition-colors ${activeTab === cat.name ? "bg-white/55" : "hover:bg-white/35"
                      }`}
                    onClick={() => {
                      setActiveTab(cat.name);
                      setActiveCategoryId(cat.id);
                    }}
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
          )}
        </div>
      </div>

      {!hasActiveSearch && activeCategoryId === "all" && (
        <div className="relative z-0 -mt-1 animate-fade-in-up px-4 pt-2 pb-1 md:max-w-6xl mx-auto">
        <div className="relative w-full aspect-[1.8/1] md:aspect-[3/1] bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden">
          {bannerImages.map((bannerImg, index) => (
            <div
              key={`${bannerImg}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
                index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={bannerImg}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {bannerImages.map((_, i) => (
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
      )}

      {!hasActiveSearch && activeCategoryId === "all" && (
        <div className="px-4 pt-4 pb-2 relative z-10 md:max-w-6xl md:mx-auto">
          <h3 className="text-lg font-[800] text-[#3e2723] mb-4">Bestsellers</h3>

          <div className="grid grid-cols-3 gap-2.5">
            {visibleBestSellers.map((item, idx) => {
              const cardImages = Array.from({ length: 4 }).map(
                (_, imageIndex) => item.previewImages?.[imageIndex] || item.image
              );

              return (
                <button
                  type="button"
                  key={`${item.id}-${idx}`}
                  className="p-2.5 bg-[#e9edf2] rounded-[16px] border border-[#dde3ea] shadow-sm text-left active:scale-95 transition-transform"
                  onClick={() => handleBestSellerClick(item)}
                >
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {cardImages.map((imageSrc, imageIdx) => (
                      <div
                        key={`${item.id}-${imageIdx}`}
                        className="h-10 rounded-[8px] bg-white border border-[#eceff3] overflow-hidden flex items-center justify-center p-1"
                      >
                        <img src={imageSrc} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 leading-none mb-1 text-center min-h-[10px]">
                    {item.countLabel || ""}
                  </p>
                  <p className="text-[13px] font-[700] text-[#2b2b2b] leading-[1.2] text-center line-clamp-2 min-h-[32px]">
                    {item.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!hasActiveSearch && activeCategoryId !== "all" && (
        <div className="px-2 sm:px-4 pb-24 pt-2 relative z-10 md:max-w-6xl md:mx-auto">
          <div className="flex gap-2 sm:gap-3">
            <aside className="w-[86px] sm:w-[100px] shrink-0 border-r border-slate-200 pr-2">
              <div className="max-h-[calc(100vh-230px)] overflow-y-auto space-y-2 pb-3">
                <button
                  type="button"
                  className={`w-full rounded-xl px-2 py-2 text-[11px] font-semibold text-center border ${
                    activeSubcategoryId === "all-subcategories"
                      ? "bg-[#fff4cc] border-[#facc15] text-slate-900"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                  onClick={() => setActiveSubcategoryId("all-subcategories")}
                >
                  All
                </button>
                {normalizedSidebarSubcategories.map((subcategory) => (
                  <button
                    type="button"
                    key={subcategory._id}
                    className={`w-full rounded-xl px-1.5 py-2 border flex flex-col items-center gap-1.5 ${
                      activeSubcategoryId === subcategory._id
                        ? "bg-[#fff4cc] border-[#facc15]"
                        : "bg-white border-slate-200"
                    }`}
                    onClick={() => setActiveSubcategoryId(subcategory._id)}
                  >
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-50"
                    />
                    <span className="text-[10px] font-semibold text-slate-700 leading-tight line-clamp-2">
                      {subcategory.name}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-base sm:text-lg font-[800] text-[#3e2723]">
                  {activeSubcategoryId === "all-subcategories"
                    ? activeTab
                    : normalizedSidebarSubcategories.find((subcat) => subcat._id === activeSubcategoryId)?.name || "Products"}
                </h3>
                <span className="text-xs font-semibold text-slate-500">{visibleLayoutProducts.length} items</span>
              </div>

              {visibleLayoutProducts.length === 0 ? (
                <p className="px-1 py-6 text-sm text-slate-500">No products found in this subcategory.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {visibleLayoutProducts.map((product) => {
                    const productId = product?._id || product?.id;
                    const alreadyInCart = isInCart(productId);

                    return (
                      <div
                        key={`layout-product-${productId}`}
                        className="rounded-2xl border border-slate-200 bg-white shadow-sm p-2.5 sm:p-3"
                      >
                        <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                          <img
                            src={getProductImage(product)}
                            alt={product?.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[12px] sm:text-sm font-semibold text-slate-900 line-clamp-2 min-h-[34px]">
                          {product?.name || "Product"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {product?.unit || "Unit not specified"}
                        </p>
                        <div className="mt-2 flex items-end justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900">Rs {Number(product?.sellingPrice || 0)}</p>
                            {Number(product?.mrp || 0) > Number(product?.sellingPrice || 0) && (
                              <p className="text-[10px] text-slate-400 line-through">Rs {Number(product?.mrp || 0)}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold ${
                              alreadyInCart
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-emerald-600 text-white"
                            }`}
                            onClick={() => handleAddProductToCart(product)}
                          >
                            {alreadyInCart ? "ADDED" : "ADD"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {hasActiveSearch && (
        <div className="px-4 pt-4 pb-2 relative z-10 md:max-w-6xl md:mx-auto">
          <h3 className="text-lg font-[800] text-[#3e2723]">
            Search results for "{searchQuery.trim()}"
          </h3>
        </div>
      )}

      {hasActiveSearch && visibleBestSellers.length > 0 && (
        <div className="px-4 pt-2 pb-2 relative z-10 md:max-w-6xl md:mx-auto">
          <h4 className="text-base font-[800] text-[#3e2723] mb-3">Related Bestsellers</h4>
          <div className="grid grid-cols-3 gap-2.5">
            {visibleBestSellers.map((item, idx) => {
              const cardImages = Array.from({ length: 4 }).map(
                (_, imageIndex) => item.previewImages?.[imageIndex] || item.image
              );

              return (
                <button
                  type="button"
                  key={`search-bestseller-${item.id}-${idx}`}
                  className="p-2.5 bg-[#e9edf2] rounded-[16px] border border-[#dde3ea] shadow-sm text-left active:scale-95 transition-transform"
                  onClick={() => handleBestSellerClick(item)}
                >
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {cardImages.map((imageSrc, imageIdx) => (
                      <div
                        key={`${item.id}-search-${imageIdx}`}
                        className="h-10 rounded-[8px] bg-white border border-[#eceff3] overflow-hidden flex items-center justify-center p-1"
                      >
                        <img src={imageSrc} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 leading-none mb-1 text-center min-h-[10px]">
                    {item.countLabel || ""}
                  </p>
                  <p className="text-[13px] font-[700] text-[#2b2b2b] leading-[1.2] text-center line-clamp-2 min-h-[32px]">
                    {item.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasActiveSearch && visibleSearchProducts.length > 0 && (
        <div className="px-4 pt-2 pb-2 relative z-10 md:max-w-6xl md:mx-auto">
          <h4 className="text-base font-[800] text-[#3e2723] mb-3">Products</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visibleSearchProducts.map((product) => {
              const primarySubcategory =
                (Array.isArray(product?.subcategories) && product.subcategories[0]?._id) ||
                product?.subcategory?._id ||
                null;

              return (
                <button
                  type="button"
                  key={`search-product-${product._id}`}
                  className="rounded-2xl border border-slate-200 p-3 bg-white shadow-sm text-left"
                  onClick={() =>
                    primarySubcategory
                      ? navigate(`/grocery/subcategory/${primarySubcategory}`)
                      : navigate("/categories")
                  }
                >
                  <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                    <img
                      src={Array.isArray(product?.images) && product.images[0] ? product.images[0] : "https://via.placeholder.com/200"}
                      alt={product?.name || "Product"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">{product?.name}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product?.unit || "Unit not specified"}</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">Rs {Number(product?.sellingPrice || 0)}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasActiveSearch && !hasAnySearchMatch && (
        <div className="px-4 pt-4 pb-24 relative z-10 md:max-w-6xl md:mx-auto">
          <p className="text-sm text-slate-500">No matching results found.</p>
        </div>
      )}

      {!hasActiveSearch && activeCategoryId === "all" && homepageCategoryDisplaySections.map((category, sectionIndex) => (
        <div
          key={category._id || category.slug || category.name}
          className={`px-4 relative z-10 md:max-w-6xl md:mx-auto ${
            sectionIndex === homepageCategoryDisplaySections.length - 1 ? "pb-24" : "pb-6"
          }`}
        >
          <h3 className="text-lg font-[800] text-[#3e2723] mb-4">{category.name}</h3>
          {(!category.homepageCards || category.homepageCards.length === 0) && (
            <p className="text-sm text-slate-500 mb-2">No subcategories available.</p>
          )}
          <div className="grid grid-cols-4 gap-2">
            {(category.homepageCards || []).map((card) => (
              <div
                key={card._id}
                className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  if (card.targetSubcategoryId) {
                    navigate(`/grocery/subcategory/${card.targetSubcategoryId}`);
                    return;
                  }

                  const selectedCategoryId = String(
                    category?._id || category?.slug || category?.name || "all"
                  );
                  setActiveTab(category?.name || "All");
                  setActiveCategoryId(selectedCategoryId);
                  setActiveSubcategoryId("all-subcategories");
                }}
              >
                <div
                  className="w-full h-[72px] rounded-[12px] flex items-center justify-center p-2 shadow-sm border border-[#dce7eb] overflow-hidden relative bg-[#e9f4f7]"
                >
                  <img
                    src={card.image || "https://via.placeholder.com/120"}
                    alt={card.name}
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                </div>
                <div className="h-9 flex items-start justify-center w-full">
                  <p className="text-[11px] font-[700] text-center text-[#2b2b2b] leading-tight px-0.5 line-clamp-2">
                    {card.name}
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
          className={`flex flex-col items-center gap-1 cursor-pointer ${isGroceryCategoriesRoute ? "text-slate-400 hover:text-slate-600" : ""}`}
          onClick={handleHomeNavClick}
        >
          <Home size={24} className={isGroceryCategoriesRoute ? "text-slate-400" : "text-slate-900 fill-current"} />
          <span className={`text-[10px] ${isGroceryCategoriesRoute ? "font-medium text-slate-400" : "font-bold text-slate-900"}`}>Home</span>
          {!isGroceryCategoriesRoute && <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>}
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/plans")}
        >
          <ShoppingBag size={24} />
          <span className="text-[10px] font-medium">Plan</span>
        </div>

        <div
          className={`flex flex-col items-center gap-1 cursor-pointer ${isGroceryCategoriesRoute ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          onClick={handleCategoriesNavClick}
        >
          <LayoutGrid size={24} />
          <span className={`text-[10px] ${isGroceryCategoriesRoute ? "font-bold text-slate-900" : "font-medium"}`}>Categories</span>
          {isGroceryCategoriesRoute && <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>}
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
