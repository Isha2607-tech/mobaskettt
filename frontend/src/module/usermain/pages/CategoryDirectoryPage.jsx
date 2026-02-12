import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Mic,
  Home,
  ShoppingBag,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

// Assets
import imgCoriander from "@/assets/bestseller/coriandar-removebg-preview.png";
import imgFreshFruits from "@/assets/grocery&kitchen/Fruits-removebg-preview.png";
import imgAtta from "@/assets/bestseller/aata-removebg-preview.png";
import imgOil from "@/assets/grocery&kitchen/fortuneoil.jpeg";
import imgMilk from "@/assets/grocery&kitchen/amulmilk.jpeg";
import imgChips from "@/assets/bestseller/BlueLays-removebg-preview.png";
import imgChocolate from "@/assets/bestseller/choclate-removebg-preview.png";
import imgCoke from "@/assets/ColdDrinks/cocacola-removebg-preview.png";
import imgIceCream from "@/assets/Beauty&PersonalCare/icecream-removebg-preview.png";
import imgBeauty from "@/assets/Beauty&PersonalCare/Beauty_Cosmetics-removebg-preview.png";
import imgOilMasala from "@/assets/grocery&kitchen/oilMasala-removebg-preview.png";
import imgBakery from "@/assets/grocery&kitchen/cookies.png";
import imgDryFruits from "@/assets/grocery&kitchen/dryFruits-removebg-preview.png";
import imgFishMeat from "@/assets/grocery&kitchen/fishMeat-removebg-preview.png";
import imgKitchenWare from "@/assets/grocery&kitchen/kitchenWare1-removebg-preview.png";
import imgTea from "@/assets/grocery&kitchen/teaCoffee-removebg-preview.png";
import imgInstantFood from "@/assets/grocery&kitchen/noodles-removebg-preview.png";
import imgSauces from "@/assets/grocery&kitchen/sauce.png";
import imgPaan from "@/assets/grocery&kitchen/paan.png";
import imgHousehold from "@/assets/grocery&kitchen/household.png";

export default function CategoryDirectoryPage() {
  const navigate = useNavigate();

  // handleCategoryClick removed in favor of Link component logic

  const categories = [
    {
      title: "Grocery & Kitchen",
      items: [
        { id: "fresh-veg", name: "Vegetables & Fruits", image: imgCoriander },
        { id: "atta-rice-dal", name: "Atta, Rice & Dal", image: imgAtta },
        { id: "oil-masala", name: "Oil, Ghee & Masala", image: imgOilMasala },
        { id: "dairy-bread", name: "Dairy, Bread & Eggs", image: imgMilk },
      ],
    },
    {
      title: "Snacks & Drinks",
      items: [
        {
          id: "bakery-biscuits",
          name: "Bakery & Biscuits",
          image: imgBakery,
        },
        {
          id: "dry-fruits",
          name: "Dry Fruits & Cereals",
          image: imgDryFruits,
        },
        {
          id: "chicken-meat",
          name: "Chicken, Meat & Fish",
          image: imgFishMeat,
        },
        {
          id: "kitchenware",
          name: "Kitchenware & Appliances",
          image: imgKitchenWare,
        },
        { id: "chips-namkeen", name: "Chips & Namkeen", image: imgChips },
        { id: "sweets-choc", name: "Sweets & Chocolates", image: imgChocolate },
        { id: "drinks-juices", name: "Drinks & Juices", image: imgCoke },
        {
          id: "tea-coffee",
          name: "Tea, Coffee & Milk Drinks",
          image: imgTea,
        },
        {
          id: "instant-food",
          name: "Instant Food",
          image: imgInstantFood,
        },
        {
          id: "sauces",
          name: "Sauces & Spreads",
          image: imgSauces,
        },
        {
          id: "paan",
          name: "Paan Corner",
          image: imgPaan,
        },
        { id: "ice-creams", name: "Ice Creams & More", image: imgIceCream },
      ],
    },
    {
      title: "Beauty & Personal Care",
      items: [
        { id: "beauty", name: "Beauty & Cosmetics", image: imgBeauty },
        {
          id: "cleaning",
          name: "Cleaning & Household",
          image: imgHousehold,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 font-sans w-full">
      {/* Top Navbar Header */}
      <div className="bg-[#FACC15] rounded-b-[2.5rem] pb-10 shadow-sm">
        <div className="px-4 pt-6 md:max-w-7xl md:mx-auto">
          {/* Top Info Row */}
          <div className="flex justify-between items-start mb-0">
            <div className="flex flex-col text-[#3e3212]">
              <h1 className="text-[10px] uppercase font-black tracking-[0.15em] leading-none mb-1">
                MOBASKET IN
              </h1>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-[24px] font-[900] tracking-tight">
                  8 minutes
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 cursor-pointer">
                <span className="text-[13px] font-bold tracking-tight line-clamp-1">
                  Vandana Nagar, Indore
                </span>
                <ChevronDown size={16} className="stroke-[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4 mb-2 md:max-w-xl md:mx-auto">
        <div className="bg-gray-100 rounded-xl h-11 flex items-center px-4 shadow-sm w-full">
          <Search className="text-slate-400 w-5 h-5 stroke-[2.5] mr-3" />
          <input
            type="text"
            placeholder='Search "milk"'
            className="flex-1 bg-transparent text-slate-800 text-[14px] font-semibold outline-none placeholder:text-slate-400"
            disabled
          />
          <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>
          <Mic className="text-slate-400 w-5 h-5 stroke-[2.5]" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 py-2 md:max-w-7xl md:mx-auto">
        {categories.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-[15px] font-[800] text-slate-800 mb-3 ml-1">
              {section.title}
            </h2>
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 md:grid-cols-6 lg:grid-cols-8 md:gap-6">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/grocery/category/${item.id}`}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className="w-full aspect-square bg-[#e6f7f5] rounded-2xl p-2.5 flex items-center justify-center relative overflow-hidden group-hover:bg-[#d8edd6] transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain drop-shadow-[0_10px_8px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-center text-slate-800 leading-tight px-1 break-words w-full">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3 px-6 flex justify-between md:justify-center md:gap-28 items-end z-50 md:max-w-md md:mx-auto">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/grocery")}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </div>

        <div
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600"
          onClick={() => navigate("/plans")}
        >
          <ShoppingBag size={24} />
          <span className="text-[10px] font-medium">Plan</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <LayoutGrid
            size={24}
            className="text-slate-900 fill-current bg-green-100 rounded-sm p-0.5"
          />
          <span className="text-[10px] font-bold text-slate-900">
            Categories
          </span>
          <div className="w-8 h-1 bg-slate-900 rounded-full mt-0.5"></div>
        </div>

        <button
          className="mb-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          onClick={() => navigate("/home")}
        >
          <span className="font-black italic text-lg tracking-tighter">
            Mofood
          </span>
        </button>
      </div>
    </div>
  );
}
