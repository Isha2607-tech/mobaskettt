import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Download, ChevronDown, Eye, Settings, ArrowUpDown, Loader2, X, MapPin, Phone, Mail, Star, Building2, User, FileText, ShieldX, Trash2, Plus } from "lucide-react"
import { adminAPI } from "../../../../lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { exportRestaurantsToPDF } from "../../components/restaurants/restaurantsExportUtils"

// Import icons from Dashboard-icons
import locationIcon from "../../assets/Dashboard-icons/image1.png"
import restaurantIcon from "../../assets/Dashboard-icons/image2.png"
import inactiveIcon from "../../assets/Dashboard-icons/image3.png"

export default function GroceryStoresList() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeDetails, setStoreDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [banConfirmDialog, setBanConfirmDialog] = useState(null) // { store, action: 'ban' | 'unban' }
  const [banning, setBanning] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(null) // { store }
  const [deleting, setDeleting] = useState(false)

  // Format Store ID (e.g., STOR000001)
  const formatStoreId = (id) => {
    if (!id) return "STOR000000"
    const idString = String(id)
    const hash = idString.split("").reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0) | 0
    }, 0)
    const lastDigits = Math.abs(hash).toString().slice(-6).padStart(6, "0")
    return `STOR${lastDigits}`
  }

  // Fetch stores from backend API
  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await adminAPI.getGroceryStores()
      
      if (response.data && response.data.success && response.data.data) {
        const storesData = response.data.data.stores || []
        
        const mappedStores = storesData.map((store, index) => ({
          id: store._id || store.id || index + 1,
          _id: store._id,
          name: store.name || "N/A",
          ownerName: store.ownerName || "N/A",
          ownerPhone: store.ownerPhone || store.phone || "N/A",
          zone: store.location?.area || store.location?.city || store.zone || "N/A",
          status: store.isActive !== false,
          rating: store.ratings?.average || store.rating || 0,
          logo: store.profileImage?.url || store.logo || "https://via.placeholder.com/40",
          originalData: store,
        }))
        
        setStores(mappedStores)
      } else {
        setStores([])
      }
    } catch (err) {
      console.error("Error fetching grocery stores:", err)
      setError(err.message || "Failed to fetch grocery stores")
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const [filters, setFilters] = useState({
    all: "All",
    zone: "",
  })

  const filteredStores = useMemo(() => {
    let result = [...stores]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.ownerName.toLowerCase().includes(query) ||
        store.ownerPhone.includes(query)
      )
    }

    if (filters.all !== "All") {
      if (filters.all === "Active") {
        result = result.filter(store => store.status === true)
      } else if (filters.all === "Inactive") {
        result = result.filter(store => store.status === false)
      }
    }

    if (filters.zone) {
      result = result.filter(store => store.zone === filters.zone)
    }

    return result
  }, [stores, searchQuery, filters])

  const handleToggleStatus = async (id) => {
    const store = stores.find(s => s.id === id)
    if (!store) return

    try {
      const newStatus = !store.status
      await adminAPI.updateGroceryStoreStatus(store._id, newStatus)
      setStores(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    } catch (err) {
      console.error("Error updating store status:", err)
      alert("Failed to update status")
    }
  }

  const handleViewDetails = async (store) => {
    setSelectedStore(store)
    setLoadingDetails(true)
    if (store.originalData) {
      setStoreDetails(store.originalData)
      setLoadingDetails(false)
    } else {
      try {
        const response = await adminAPI.getGroceryStoreById(store._id)
        if (response.data?.success) {
          setStoreDetails(response.data.data.store || response.data.data)
        }
      } catch (err) {
        console.error("Error fetching store details:", err)
        setStoreDetails(store)
      } finally {
        setLoadingDetails(false)
      }
    }
  }

  const handleBanStore = (store) => {
    setBanConfirmDialog({ store, action: store.status ? 'ban' : 'unban' })
  }

  const confirmBanStore = async () => {
    if (!banConfirmDialog) return
    const { store, action } = banConfirmDialog
    const newStatus = action !== 'ban'
    
    try {
      setBanning(true)
      await adminAPI.updateGroceryStoreStatus(store._id, newStatus)
      setStores(prev => prev.map(s => s._id === store._id ? { ...s, status: newStatus } : s))
      setBanConfirmDialog(null)
    } catch (err) {
      console.error("Error banning store:", err)
    } finally {
      setBanning(false)
    }
  }

  const handleDeleteStore = (store) => {
    setDeleteConfirmDialog({ store })
  }

  const confirmDeleteStore = async () => {
    if (!deleteConfirmDialog) return
    const { store } = deleteConfirmDialog
    
    try {
      setDeleting(true)
      await adminAPI.deleteGroceryStore(store._id)
      setStores(prev => prev.filter(s => s._id !== store._id))
      setDeleteConfirmDialog(null)
    } catch (err) {
      console.error("Error deleting store:", err)
    } finally {
      setDeleting(false)
    }
  }

  const handleExport = () => {
    const dataToExport = filteredStores.length > 0 ? filteredStores : stores
    exportRestaurantsToPDF(dataToExport, "grocery_stores_list")
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Grocery Stores List</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Stores</p>
                <p className="text-2xl font-bold text-slate-900">{stores.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <img src={locationIcon} alt="Location" className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Active Stores</p>
                <p className="text-2xl font-bold text-slate-900">{stores.filter(s => s.status).length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <img src={restaurantIcon} alt="Store" className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Inactive Stores</p>
                <p className="text-2xl font-bold text-slate-900">{stores.filter(s => !s.status).length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <img src={inactiveIcon} alt="Inactive" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Stores List</h2>
            <div className="flex items-center gap-3">
              {stores.length === 0 && (
                <button
                  onClick={() => navigate("/admin/grocery-stores/add")}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Store</span>
                </button>
              )}
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by store name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button onClick={handleExport} className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading stores...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-600">
                <p className="font-semibold">Error Loading Data</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SL</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Store Info</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Owner Info</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredStores.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500">No stores found</td></tr>
                  ) : (
                    filteredStores.map((store, index) => (
                      <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={store.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900">{store.name}</span>
                              <span className="text-xs text-slate-500">{formatStoreId(store._id)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{store.ownerName}</span>
                            <span className="text-slate-500">{store.ownerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{store.zone}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(store.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.status ? "bg-blue-600" : "bg-slate-300"}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${store.status ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button onClick={() => handleViewDetails(store)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleBanStore(store)} className={`p-1.5 rounded ${store.status ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}><ShieldX className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteStore(store)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStore(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Store Details</h2>
              <button onClick={() => setSelectedStore(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {loadingDetails ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <img src={storeDetails?.logo || "https://via.placeholder.com/96"} className="w-24 h-24 rounded-lg object-cover" />
                    <div>
                      <h3 className="text-2xl font-bold">{storeDetails?.name}</h3>
                      <div className="flex gap-4 text-sm text-slate-600 mt-2">
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{storeDetails?.rating || 0}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{formatStoreId(storeDetails?._id)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Owner Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" />{storeDetails?.ownerName}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" />{storeDetails?.ownerPhone}</div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" />{storeDetails?.email}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Location</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-slate-400 mt-1" />{storeDetails?.location?.address || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ban/Unban Confirm Dialog */}
      {banConfirmDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => !banning && setBanConfirmDialog(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {banConfirmDialog.action === "ban" ? "Disable Store" : "Enable Store"}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to {banConfirmDialog.action === "ban" ? "disable" : "enable"}{" "}
              <span className="font-semibold text-slate-900">{banConfirmDialog.store?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={banning}
                onClick={() => setBanConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={banning}
                onClick={confirmBanStore}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50 ${
                  banConfirmDialog.action === "ban"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {banning
                  ? (banConfirmDialog.action === "ban" ? "Disabling..." : "Enabling...")
                  : (banConfirmDialog.action === "ban" ? "Disable" : "Enable")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirmDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => !deleting && setDeleteConfirmDialog(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Store</h3>
            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone. Delete{" "}
              <span className="font-semibold text-slate-900">{deleteConfirmDialog.store?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDeleteStore}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
