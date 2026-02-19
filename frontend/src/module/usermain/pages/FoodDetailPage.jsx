import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Share2, Clock, ChevronDown, CheckCircle, X, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "../../user/context/CartContext";

import imgStrawberry from "@/assets/grocery&kitchen/strawberry2.jpeg";
import imgCauliflower from "@/assets/grocery&kitchen/cauliflower-removebg-preview.png";
import imgTomato from "@/assets/grocery&kitchen/tomato-removebg-preview.png";
import imgApple from "@/assets/grocery&kitchen/apple-removebg-preview.png";

const FALLBACK_TOP_PRODUCTS = [
  { id: 301, name: "Cauliflower (Gobi)", weight: "1 pc", price: 33, mrp: 42, image: imgCauliflower },
  { id: 302, name: "Hybrid Tomato", weight: "500 g", price: 14, mrp: 20, image: imgTomato },
  { id: 303, name: "Fresh Strawberry", weight: "200 g", price: 99, mrp: 120, image: imgStrawberry },
  { id: 304, name: "Red Apple", weight: "4 pcs", price: 111, mrp: 140, image: imgApple },
];

const normalizeProduct = (item = {}, fallbackId = "") => {
  const id = item?.id || item?._id || fallbackId;
  const price = Number(item?.price ?? item?.sellingPrice ?? 0);
  const mrp = Number(item?.mrp ?? price);
  const discountPercent = mrp > price && mrp > 0 ? Math.max(1, Math.round(((mrp - price) / mrp) * 100)) : 0;

  return {
    ...item,
    id,
    name: item?.name || "Product",
    weight: item?.weight || item?.unit || "200 g",
    price,
    mrp,
    discount: item?.discount || (discountPercent > 0 ? `${discountPercent}% OFF` : ""),
    time: item?.time || "8 MINS",
    description: item?.description || "",
    image: item?.image || (Array.isArray(item?.images) ? item.images[0] : "") || imgStrawberry,
    categoryId: item?.categoryId || item?.category?._id || item?.category?.id || item?.category || "",
    subcategoryId:
      item?.subcategoryId ||
      item?.subcategory?._id ||
      item?.subcategory?.id ||
      item?.subcategory ||
      (Array.isArray(item?.subcategories) ? item.subcategories[0]?._id : "") ||
      "",
    platform: item?.platform || "mogrocery",
  };
};

export default function FoodDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { addToCart, groceryCart, updateQuantityByPlatform } = useCart();

  const [product, setProduct] = useState(
    normalizeProduct(
      location.state?.item || {
        id,
        name: "Strawberry (Mahabaleshwar)",
        weight: "200 g",
        price: 99,
        mrp: 113,
        image: imgStrawberry,
      },
      id,
    ),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const wishlistItem = useMemo(() => ({ ...product, id: product?.id || id }), [product, id]);
  const productId = String(product?.id || id || "");
  const groceryCartItem = useMemo(
    () => groceryCart.find((item) => String(item?.id || "") === productId),
    [groceryCart, productId],
  );
  const isAddedToCart = Boolean(groceryCartItem);
  const currentQuantity = Number(groceryCartItem?.quantity || 0);

  useEffect(() => {
    const onScroll = () => setShowStickyHeader(window.scrollY > 260);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      window.scrollTo(0, 0);
      setIsDetailsOpen(false);

      if (location.state?.item) {
        const normalizedStateProduct = normalizeProduct(location.state.item, id);
        setProduct(normalizeProduct(location.state.item, id));
        if (normalizedStateProduct.description) {
          return;
        }
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/grocery/products/${id}`);
        const data = response?.data?.data;
        if (data) {
          setProduct(normalizeProduct(data, id));
        }
      } catch (error) {
        console.error("Failed to load product detail:", error);
        toast.error("Unable to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, location.state]);

  const handleSearchClick = () => navigate("/grocery");

  const handleShareClick = async () => {
    const url = window.location.href;
    const payload = {
      title: product.name,
      text: `Check this on MoBasket: ${product.name}`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied");
        return;
      }
    } catch (error) {
      console.error("Share failed:", error);
    }

    toast.error("Unable to share right now");
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();

    addToCart({
      ...product,
      id: product.id || id,
      restaurantId: "grocery-store",
      restaurant: "MoGrocery",
      platform: "mogrocery",
    });

    toast.custom(
      (t) => (
        <div className="bg-white border-l-4 border-emerald-500 shadow-lg rounded-lg p-4 flex flex-col gap-3 min-w-[280px] overflow-hidden relative">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-1.5 rounded-full">
              <CheckCircle className="text-emerald-600 w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Added to Cart</p>
              <p className="text-xs text-gray-500">{product.name}</p>
            </div>
            <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-full" />
        </div>
      ),
      { duration: 1600, position: "bottom-right" },
    );
  };

  const handleIncreaseQuantity = (e) => {
    if (e) e.stopPropagation();
    if (!isAddedToCart) {
      handleAddToCart(e);
      return;
    }
    updateQuantityByPlatform(productId, currentQuantity + 1, "mogrocery");
  };

  const handleDecreaseQuantity = (e) => {
    if (e) e.stopPropagation();
    if (!isAddedToCart) return;
    updateQuantityByPlatform(productId, currentQuantity - 1, "mogrocery");
  };

  const quickActions = (
    <div className="flex items-center gap-2">
      <WishlistButton item={wishlistItem} type="food" className="w-10 h-10 bg-white/70 backdrop-blur-md border border-white/60" />
      <button
        onClick={handleSearchClick}
        className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 flex items-center justify-center"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-slate-900" />
      </button>
      <button
        onClick={handleShareClick}
        className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 flex items-center justify-center"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5 text-slate-900" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#edf5ff] via-[#f5f8ff] to-white relative pb-24">
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold">Loading product...</div>
        </div>
      )}

      <div className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 px-4 py-3 flex items-center gap-3 shadow-sm transition-transform duration-300 ${showStickyHeader ? "translate-y-0" : "-translate-y-full"}`}>
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="flex-1 text-sm font-bold text-slate-800 truncate">{product.name}</h1>
        <div className="scale-90 origin-right">{quickActions}</div>
      </div>

      <div className="relative w-full h-[44vh] bg-gradient-to-br from-[#ffd9b1] via-[#ffd1a8] to-[#ffc68f]">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-7" />

        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/55 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          {quickActions}
        </div>

        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/70 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-10" />

        {isAddedToCart ? (
          <div className="absolute bottom-4 right-4 z-20 h-10 px-2 rounded-xl bg-white border border-emerald-300 shadow-sm flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[20px] text-center text-sm font-black text-emerald-800">{currentQuantity}</span>
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 text-xs font-black px-6 py-2 rounded-md shadow-sm transition-colors z-20 border bg-white border-[#facc15] text-slate-900 hover:bg-[#facc15]"
          >
            ADD
          </button>
        )}
      </div>

      <div className="relative -mt-10 z-10">
        <div className="bg-white rounded-t-[26px] shadow-[0_-6px_26px_rgba(15,23,42,0.08)] px-5 pt-5 pb-4 border-t border-slate-100">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold mb-2">
            <Clock size={12} />
            {product.time}
          </div>

          <h1 className="text-[20px] font-[900] text-slate-900 leading-snug">{product.name}</h1>
          <p className="text-[13px] font-semibold text-slate-500 mt-1">{product.weight}</p>

          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-xl font-[900] text-slate-900">Rs {product.price}</span>
            {product.mrp > product.price && (
              <span className="text-[11px] font-bold text-slate-400 line-through">MRP Rs {product.mrp}</span>
            )}
            {product.discount && (
              <span className="bg-[#e8f0fe] text-[#2c73eb] text-[10px] font-[800] px-1.5 py-0.5 rounded-md">
                {product.discount}
              </span>
            )}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              type="button"
              className="flex items-center gap-1 text-[13px] font-[700] text-[#11a652]"
              onClick={() => setIsDetailsOpen((prev) => !prev)}
            >
              View product details
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDetailsOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isDetailsOpen ? "max-h-64 mt-3" : "max-h-0"}`}>
              <div className="bg-[#f8f9ff] rounded-xl p-3 text-[12px] text-slate-600 leading-relaxed">
                {product.description || "Fresh quality grocery item delivered quickly. Store in a cool place and consume before expiry for best taste."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-base font-[800] text-slate-900 mb-3">Top products in this category</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {FALLBACK_TOP_PRODUCTS.map((item) => {
            const discountPercent = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/food/${item.id}`, { state: { item: normalizeProduct(item, item.id) } })}
                className="min-w-[130px] max-w-[130px] flex flex-col gap-2 text-left"
              >
                <div className="w-full aspect-[3/3.2] bg-white rounded-2xl border border-slate-100 overflow-hidden relative">
                  <img src={item.image} className="w-full h-full object-contain p-2" alt={item.name} />
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-500">{item.weight}</p>
                <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-2 min-h-[30px]">{item.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">Rs {item.price}</span>
                  <span className="text-[10px] text-slate-400 line-through">Rs {item.mrp}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
        <button
          onClick={() => {
            if (isAddedToCart) {
              navigate("/grocery/cart");
              return;
            }
            handleAddToCart();
          }}
          className={`w-full h-12 rounded-xl text-white font-bold text-base shadow-md ${
            isAddedToCart ? "bg-emerald-700 hover:bg-emerald-700" : "bg-[#16a34a] hover:bg-[#15803d]"
          }`}
        >
          {isAddedToCart ? "Added to cart" : "Add to cart"}
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
