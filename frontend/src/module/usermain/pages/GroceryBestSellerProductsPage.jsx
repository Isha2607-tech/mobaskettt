import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useCart } from "../../user/context/CartContext";

export default function GroceryBestSellerProductsPage() {
  const navigate = useNavigate();
  const { itemType, itemId } = useParams();
  const { addToCart, isInCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("Products");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!itemType || !itemId) {
          throw new Error("Invalid best seller selection");
        }

        if (itemType === "category") {
          const [categoryRes, productsRes] = await Promise.all([
            api.get(`/grocery/categories/${itemId}`),
            api.get("/grocery/products", { params: { categoryId: itemId } }),
          ]);
          setTitle(categoryRes?.data?.data?.name || "Category Products");
          setProducts(Array.isArray(productsRes?.data?.data) ? productsRes.data.data : []);
        } else if (itemType === "subcategory") {
          const [subcategoryRes, productsRes] = await Promise.all([
            api.get(`/grocery/subcategories/${itemId}`),
            api.get("/grocery/products", { params: { subcategoryId: itemId } }),
          ]);
          setTitle(subcategoryRes?.data?.data?.name || "Subcategory Products");
          setProducts(Array.isArray(productsRes?.data?.data) ? productsRes.data.data : []);
        } else if (itemType === "product") {
          const productRes = await api.get(`/grocery/products/${itemId}`);
          const product = productRes?.data?.data;
          setTitle(product?.name || "Product");
          setProducts(product ? [product] : []);
        } else {
          throw new Error("Unsupported item type");
        }
      } catch {
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, itemType]);

  const headerTitle = useMemo(() => title || "Products", [title]);

  const handleAddToCart = (product) => {
    try {
      const image =
        Array.isArray(product?.images) && product.images[0]
          ? product.images[0]
          : "https://via.placeholder.com/200";
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
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/grocery")}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-slate-900 line-clamp-1">{headerTitle}</h1>
      </div>

      {loading && <p className="px-4 py-6 text-sm text-slate-500">Loading products...</p>}
      {!loading && error && <p className="px-4 py-6 text-sm text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          {products.map((product) => (
            <div key={product._id} className="rounded-2xl border border-slate-200 p-3 bg-white shadow-sm">
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
