import { useEffect, useMemo, useState } from "react"
import { Edit, Loader2, Plus, Trash2, X } from "lucide-react"
import { adminAPI } from "@/lib/api"
import { toast } from "sonner"

const DEFAULT_FORM = {
  name: "",
  description: "",
  itemsLabel: "",
  productCount: 0,
  deliveries: 0,
  frequency: "",
  price: 0,
  durationDays: 30,
  iconKey: "zap",
  color: "bg-emerald-500",
  headerColor: "bg-emerald-500",
  popular: false,
  order: 0,
  isActive: true,
  benefitsText: "",
  vegProducts: [],
  nonVegProducts: [],
}

const parseBenefits = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export default function GroceryPlans() {
  const [plans, setPlans] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [vegSelection, setVegSelection] = useState({ productId: "", qty: "" })
  const [nonVegSelection, setNonVegSelection] = useState({ productId: "", qty: "" })

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    [plans]
  )

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getGroceryPlans()
      if (response?.data?.success) {
        setPlans(Array.isArray(response.data.data) ? response.data.data : [])
      } else {
        setPlans([])
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load plans")
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getGroceryProducts()
      if (response?.data?.success) {
        const payload = Array.isArray(response.data.data) ? response.data.data : []
        setProducts(payload.filter((item) => item?.name))
      } else {
        setProducts([])
      }
    } catch (error) {
      setProducts([])
      toast.error(error?.response?.data?.message || "Failed to load grocery products")
    }
  }

  useEffect(() => {
    fetchPlans()
    fetchProducts()
  }, [])

  const resetModal = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setVegSelection({ productId: "", qty: "" })
    setNonVegSelection({ productId: "", qty: "" })
    setIsModalOpen(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setVegSelection({ productId: "", qty: "" })
    setNonVegSelection({ productId: "", qty: "" })
    setIsModalOpen(true)
  }

  const openEdit = (plan) => {
    const vegProducts = Array.isArray(plan.vegProducts)
      ? plan.vegProducts
      : Array.isArray(plan.products)
      ? plan.products
      : []
    const nonVegProducts = Array.isArray(plan.nonVegProducts) ? plan.nonVegProducts : []

    setEditingId(plan._id)
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      itemsLabel: plan.itemsLabel || "",
      productCount: Number(plan.productCount || 0),
      deliveries: Number(plan.deliveries || 0),
      frequency: plan.frequency || "",
      price: Number(plan.price || 0),
      durationDays: Number(plan.durationDays || 30),
      iconKey: plan.iconKey || "zap",
      color: plan.color || "bg-emerald-500",
      headerColor: plan.headerColor || "bg-emerald-500",
      popular: Boolean(plan.popular),
      order: Number(plan.order || 0),
      isActive: plan.isActive !== false,
      benefitsText: Array.isArray(plan.benefits) ? plan.benefits.join("\n") : "",
      vegProducts,
      nonVegProducts,
    })
    setVegSelection({ productId: "", qty: "" })
    setNonVegSelection({ productId: "", qty: "" })
    setIsModalOpen(true)
  }

  const addPlanProduct = (type) => {
    const selection = type === "veg" ? vegSelection : nonVegSelection
    if (!selection.productId || !selection.qty.trim()) {
      toast.error("Select product and enter quantity")
      return
    }

    const selectedProduct = products.find((item) => item._id === selection.productId)
    if (!selectedProduct) {
      toast.error("Selected product not found")
      return
    }

    const productToAdd = {
      name: selectedProduct.name.trim(),
      qty: selection.qty.trim(),
    }

    if (type === "veg") {
      setForm((prev) => ({ ...prev, vegProducts: [...prev.vegProducts, productToAdd] }))
      setVegSelection({ productId: "", qty: "" })
      return
    }

    setForm((prev) => ({ ...prev, nonVegProducts: [...prev.nonVegProducts, productToAdd] }))
    setNonVegSelection({ productId: "", qty: "" })
  }

  const removePlanProduct = (type, index) => {
    if (type === "veg") {
      setForm((prev) => ({
        ...prev,
        vegProducts: prev.vegProducts.filter((_, itemIndex) => itemIndex !== index),
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      nonVegProducts: prev.nonVegProducts.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const vegProducts = Array.isArray(form.vegProducts) ? form.vegProducts : []
      const nonVegProducts = Array.isArray(form.nonVegProducts) ? form.nonVegProducts : []
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        itemsLabel: form.itemsLabel.trim(),
        productCount: Number(form.productCount || 0),
        deliveries: Number(form.deliveries || 0),
        frequency: form.frequency.trim(),
        price: Number(form.price || 0),
        durationDays: Number(form.durationDays || 30),
        iconKey: form.iconKey,
        color: form.color.trim() || "bg-emerald-500",
        headerColor: form.headerColor.trim() || form.color.trim() || "bg-emerald-500",
        popular: Boolean(form.popular),
        order: Number(form.order || 0),
        isActive: Boolean(form.isActive),
        benefits: parseBenefits(form.benefitsText),
        products: [...vegProducts, ...nonVegProducts],
        vegProducts,
        nonVegProducts,
      }

      if (editingId) {
        await adminAPI.updateGroceryPlan(editingId, payload)
        toast.success("Plan updated")
      } else {
        await adminAPI.createGroceryPlan(payload)
        toast.success("Plan created")
      }
      resetModal()
      fetchPlans()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save plan")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (plan) => {
    try {
      await adminAPI.toggleGroceryPlanStatus(plan._id, !plan.isActive)
      setPlans((prev) => prev.map((item) => (item._id === plan._id ? { ...item, isActive: !item.isActive } : item)))
      toast.success("Status updated")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status")
    }
  }

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"?`)) return
    try {
      await adminAPI.deleteGroceryPlan(plan._id)
      setPlans((prev) => prev.filter((item) => item._id !== plan._id))
      toast.success("Plan deleted")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete plan")
    }
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Grocery Plans</h1>
            <p className="text-sm text-slate-500 mt-1">Configure plans shown on the grocery plans page.</p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="py-16 text-center text-slate-500">No plans found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPlans.map((plan) => (
                <tr key={plan._id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{plan.name}</p>
                    <p className="text-xs text-slate-500">{plan.itemsLabel || `${plan.productCount || 0} items`}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">Rs {Number(plan.price || 0).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{plan.durationDays} days</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{plan.order || 0}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        plan.isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(plan)} className="p-2 rounded hover:bg-blue-50 text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(plan)} className="p-2 rounded hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/50" onClick={resetModal} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit Plan" : "Add Plan"}</h2>
              <button onClick={resetModal} className="p-1 rounded hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="px-3 py-2 border rounded-lg" placeholder="Plan name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" placeholder="Items label (e.g. 31 items)" value={form.itemsLabel} onChange={(e) => setForm({ ...form, itemsLabel: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" type="number" min="0" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" type="number" min="1" placeholder="Duration days" required value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" type="number" min="0" placeholder="Product count" value={form.productCount} onChange={(e) => setForm({ ...form, productCount: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" type="number" min="0" placeholder="Deliveries" value={form.deliveries} onChange={(e) => setForm({ ...form, deliveries: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" placeholder="Frequency (e.g. Weekly)" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
                <input className="px-3 py-2 border rounded-lg" type="number" min="0" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                <select className="px-3 py-2 border rounded-lg" value={form.iconKey} onChange={(e) => setForm({ ...form, iconKey: e.target.value })}>
                  <option value="zap">Zap</option>
                  <option value="check">Check</option>
                  <option value="star">Star</option>
                  <option value="crown">Crown</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
                  Mark as popular
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              </div>

              <textarea className="w-full px-3 py-2 border rounded-lg min-h-[70px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <textarea className="w-full px-3 py-2 border rounded-lg min-h-[90px]" placeholder={"Benefits (one per line)"} value={form.benefitsText} onChange={(e) => setForm({ ...form, benefitsText: e.target.value })} />

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Veg Products</p>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
                  <select
                    className="px-3 py-2 border rounded-lg"
                    value={vegSelection.productId}
                    onChange={(e) => setVegSelection((prev) => ({ ...prev, productId: e.target.value }))}
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="px-3 py-2 border rounded-lg"
                    placeholder="Qty (e.g. 1 kg)"
                    value={vegSelection.qty}
                    onChange={(e) => setVegSelection((prev) => ({ ...prev, qty: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => addPlanProduct("veg")}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.vegProducts.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">{item.name}</span> - {item.qty}
                      </p>
                      <button type="button" onClick={() => removePlanProduct("veg", index)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.vegProducts.length === 0 && <p className="text-xs text-slate-500">No veg products selected</p>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Non-veg Products</p>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
                  <select
                    className="px-3 py-2 border rounded-lg"
                    value={nonVegSelection.productId}
                    onChange={(e) => setNonVegSelection((prev) => ({ ...prev, productId: e.target.value }))}
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="px-3 py-2 border rounded-lg"
                    placeholder="Qty (e.g. 500 g)"
                    value={nonVegSelection.qty}
                    onChange={(e) => setNonVegSelection((prev) => ({ ...prev, qty: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => addPlanProduct("nonVeg")}
                    className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.nonVegProducts.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">{item.name}</span> - {item.qty}
                      </p>
                      <button type="button" onClick={() => removePlanProduct("nonVeg", index)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.nonVegProducts.length === 0 && <p className="text-xs text-slate-500">No non-veg products selected</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetModal} className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
