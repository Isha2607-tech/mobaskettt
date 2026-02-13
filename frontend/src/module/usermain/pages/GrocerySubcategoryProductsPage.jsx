import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useCart } from "../../user/context/CartContext";

export default function GrocerySubcategoryProductsPage() {
  const navigate = useNavigate();
  const { subcategoryId } = useParams();
  const { addToCart, getGroceryCartCount, isInCart } = useCart();
  const cartCount = getGroceryCartCount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [subcategoryRes, productsRes] = await Promise.all([
          api.get(`/grocery/subcategories/${subcategoryId}`),
          api.get("/grocery/products", { params: { subcategoryId } }),
        ]);

        setSubcategory(subcategoryRes?.data?.data || null);
        setProducts(Array.isArray(productsRes?.data?.data) ? productsRes.data.data : []);
      } catch {
        setError("Failed to load subcategory products.");
        setSubcategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (subcategoryId) {
      fetchData();
    }
  }, [subcategoryId]);

  const title = useMemo(() => subcategory?.name || "Subcategory Products", [subcategory]);

  const handleAddToCart = (product) => {
    try {
      const image = Array.isArray(product?.images) && product.images[0] ? product.images[0] : "https://via.placeholder.com/200";
      addToCart({
        id: product?._id || product?.id,
        name: product?.name || "Product",
        price: Number(product?.sellingPrice || 0),
        mrp: Number(product?.mrp || 0),
        weight: product?.unit || "",
        image,
        restaurantId: "grocery-store",
        restaurant: "MoGrocery",
      });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate("/grocery")}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
          <h1 className="text-base font-bold text-slate-900 line-clamp-1">{title}</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/grocery/cart")}
          className="relative w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-sm"
          aria-label="Open cart"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {loading && <p className="px-4 py-6 text-sm text-slate-500">Loading products...</p>}
      {!loading && error && <p className="px-4 py-6 text-sm text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">No products found for this subcategory.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border border-slate-200 p-3 bg-white shadow-sm"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                <img
                  src={Array.isArray(product.images) && product.images[0] ? product.images[0] : "https://via.placeholder.com/200"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</p>
              <p className="text-xs text-slate-500 mt-1">{product.unit || "Unit not specified"}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Rs {product.sellingPrice ?? 0}</p>
                  {product.mrp && Number(product.mrp) > Number(product.sellingPrice) && (
                    <p className="text-xs text-slate-400 line-through">Rs {product.mrp}</p>
                  )}
                </div>
                {isInCart(product?._id || product?.id) && (
                  <p className="text-[11px] font-semibold text-emerald-700">Already added to cart</p>
                )}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    isInCart(product?._id || product?.id)
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {isInCart(product?._id || product?.id) ? "Added" : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
