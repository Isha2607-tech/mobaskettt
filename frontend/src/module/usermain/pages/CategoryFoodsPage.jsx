import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Heart, Clock, Search, ChevronRight } from 'lucide-react';

// Assets
import imgCoriander from '@/assets/bestseller/coriandar-removebg-preview.png';
import imgChili from '@/assets/bestseller/mirchi-removebg-preview.png';
import imgPotato from '@/assets/bestseller/aalu-removebg-preview.png';
import imgOnion from '@/assets/bestseller/onion-removebg-preview.png';

const sidebarCategories = [
  { id: 'all', name: 'All', icon: imgCoriander },
  { id: 'fresh-veg', name: 'Fresh Vegetables', icon: imgChili },
  { id: 'fresh-fruit', name: 'Fresh Fruits', icon: 'https://cdn-icons-png.flaticon.com/512/1625/1625099.png' },
  { id: 'exotics', name: 'Exotics', icon: 'https://cdn-icons-png.flaticon.com/512/765/765593.png' },
  { id: 'coriander', name: 'Coriander & Others', icon: imgCoriander },
  { id: 'flowers', name: 'Flowers & Leaves', icon: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' },
  { id: 'seasonal', name: 'Seasonal', icon: 'https://cdn-icons-png.flaticon.com/512/4264/4264726.png' },
];

const products = [
  {
    id: 1,
    name: 'Coriander Bunch (Dhaniya Patta)',
    weight: '100 g',
    price: 1,
    mrp: 7,
    time: '8 MINS',
    image: imgCoriander,
    discount: '85% OFF',
    recipeCount: 8,
    category: 'coriander'
  },
  {
    id: 2,
    name: 'Green Chilli (Hari Mirch)',
    weight: '100 g',
    price: 19,
    mrp: 22,
    time: '8 MINS',
    image: imgChili,
    discount: '13% OFF',
    recipeCount: 9,
    category: 'fresh-veg'
  },
  {
    id: 3,
    name: 'Potato - New Crop (Aloo)',
    weight: '1 kg',
    price: 18,
    mrp: 21,
    time: '8 MINS',
    image: imgPotato,
    discount: '14% OFF',
    recipeCount: 30,
    options: '2 options',
    category: 'fresh-veg'
  },
  {
    id: 4,
    name: 'Onion (Pyaz)',
    weight: '1 kg',
    price: 30,
    mrp: 38,
    time: '8 MINS',
    image: imgOnion,
    discount: '21% OFF',
    recipeCount: 30,
    category: 'fresh-veg'
  },
  {
    id: 5,
    name: 'Hybrid Tomato (Tamatar)',
    weight: '500 g',
    price: 14,
    mrp: 20,
    time: '8 MINS',
    image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png', // Placeholder
    discount: '12% OFF',
    recipeCount: 30,
    options: '2 options',
    category: 'fresh-veg'
  },
  {
    id: 6,
    name: 'Ginger (Adrak)',
    weight: '100 g',
    price: 12,
    mrp: 20,
    time: '8 MINS',
    image: 'https://cdn-icons-png.flaticon.com/512/5108/5108190.png',
    discount: '40% OFF',
    recipeCount: 12,
    category: 'coriander'
  }
];

export function CategoryFoodsContent({ onClose, isModal = false }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products based on selected sidebar category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory || selectedCategory === 'all');

  return (
    <div className={`bg-[#f4f6fb] flex flex-col md:max-w-md md:mx-auto shadow-2xl overflow-hidden font-sans ${isModal ? 'h-full rounded-t-[20px]' : 'min-h-screen h-full'}`}>

      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm rounded-t-[20px] relative">
        <div className="flex flex-col">
          <h1 className="text-sm font-black text-slate-800 tracking-wide">
            Vegetables, Fruits & More
          </h1>
          <span className="text-[10px] text-slate-500 font-bold">1285 items</span>
        </div>

        {/* Floating Close Button Center Top */}
        <button
          onClick={onClose}
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] p-2 rounded-full shadow-lg border border-white/20 active:scale-95 transition-transform z-[80]"
        >
          <X size={20} className="text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Content Area: Sidebar + Grid */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-[23%] bg-white h-full overflow-y-auto pb-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)] no-scrollbar z-10">
          {sidebarCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative flex flex-col items-center gap-1 py-4 px-1 cursor-pointer transition-all ${selectedCategory === cat.id ? 'bg-[#ebf7e8]' : 'bg-white'
                }`}
            >
              {/* Green Indicator Bar */}
              {selectedCategory === cat.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#1aa03f] rounded-l-lg"></div>
              )}

              {/* Icon Container */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center p-1.5 ${selectedCategory === cat.id ? 'bg-[#d8edd6]' : 'bg-slate-50'
                }`}>
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png'} />
              </div>

              <span className={`text-[9px] text-center leading-tight px-1 font-bold ${selectedCategory === cat.id ? 'text-slate-900' : 'text-slate-500'
                }`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Right Grid Content */}
        <div className="flex-1 bg-white h-full overflow-y-auto pb-24 px-3 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((item) => (
              <div key={item.id} className="flex flex-col gap-1 relative group">
                {/* Card Image Container */}
                <div className="relative w-full h-[170px] bg-white border border-slate-100 rounded-[12px] p-2 flex items-center justify-center shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />

                  {/* Discount Badge */}
                  <div className="absolute top-0 left-0 bg-[#4a72d3] text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-xl rounded-br-lg shadow-sm z-10">
                    {item.discount}
                  </div>

                  {/* Like Button */}
                  <button className="absolute top-1.5 right-1.5 z-10">
                    <Heart size={16} className="text-slate-400 hover:text-red-500 transition-colors" />
                  </button>

                  {/* ADD Button Floating */}
                  <div className="absolute -bottom-3 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <button className="bg-white border border-[#26a541] text-[#26a541] text-[12px] font-extrabold px-6 py-2 rounded-lg shadow-sm uppercase active:scale-95 transition-transform bg-[#f7fff9] pb-3">
                        ADD
                      </button>
                      {item.options && (
                        <div className="absolute bottom-[2px] left-0 right-0 text-center">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{item.options}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="mt-4 px-0.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Clock size={10} className="text-slate-400 bg-slate-100 rounded-full p-[1px]" />
                    <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 py-[1px] rounded">{item.time}</span>
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2 min-h-[2.4em]">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mb-1.5">{item.weight}</p>

                  {/* Price Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-[#fec007] text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black shadow-sm">
                        ₹{item.price}
                      </div>
                      <span className="text-[10px] text-slate-400 line-through decoration-slate-400 decoration-1 font-semibold">₹{item.mrp}</span>
                    </div>
                  </div>

                  {/* Recipe Link */}
                  <div className="border border-[#e0f2fe] bg-[#f0f9ff] rounded px-2 py-1 flex items-center justify-between cursor-pointer">
                    <span className="text-[9px] font-bold text-sky-600">See {item.recipeCount} recipes</span>
                    <ChevronRight size={10} className="text-sky-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </div>
  );
}

export default function CategoryFoodsPage() {
  const navigate = useNavigate();
  return <CategoryFoodsContent onClose={() => navigate(-1)} />;
}