import { Link, useLocation } from "react-router-dom";
import { Bike, Tag, User, ArrowUpRight } from "lucide-react";

export default function BottomNavigation() {
  const location = useLocation();

  // Check active routes - support both /user/* and /* paths
  const isUnder250 =
    location.pathname === "/under-250" ||
    location.pathname === "/user/under-250";
  const isProfile =
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/user/profile");
  const isDelivery =
    !isUnder250 &&
    !isProfile &&
    (location.pathname === "/" ||
      location.pathname === "/user" ||
      (location.pathname.startsWith("/") &&
        !location.pathname.startsWith("/restaurant") &&
        !location.pathname.startsWith("/delivery") &&
        !location.pathname.startsWith("/admin")));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white p-4 border-t border-gray-200 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 1. Delivery Option (Active/Red) */}
        <Link
          to="/"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className={isDelivery ? "text-red-500" : "text-gray-500"}>
            <Bike size={26} strokeWidth={2} />
          </div>
          <span
            className={`text-xs font-bold ${isDelivery ? "text-red-500" : "text-gray-500 font-medium"}`}
          >
            Delivery
          </span>
          {/* Active Line Indicator */}
          {isDelivery && (
            <div className="h-0.5 w-full bg-red-500 mt-1 rounded-full"></div>
          )}
        </Link>

        {/* 2. Under ₹250 Option */}
        <Link
          to="/under-250"
          className={`flex flex-col items-center gap-1 cursor-pointer ${isUnder250 ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Tag size={24} strokeWidth={1.5} />
          <span
            className={`text-xs ${isUnder250 ? "font-bold text-red-500" : "font-medium text-gray-500"}`}
          >
            Under ₹250
          </span>
          {isUnder250 && (
            <div className="h-0.5 w-full bg-red-500 mt-1 rounded-full"></div>
          )}
        </Link>

        {/* 3. Profile Option */}
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 cursor-pointer ${isProfile ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <User size={24} strokeWidth={1.5} />
          <span
            className={`text-xs ${isProfile ? "font-bold text-red-500" : "font-medium text-gray-500"}`}
          >
            Profile
          </span>
          {isProfile && (
            <div className="h-0.5 w-full bg-red-500 mt-1 rounded-full"></div>
          )}
        </Link>

        {/* 4. MoBasket Button */}
        <Link to="/grocery" className="cursor-pointer">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-2 rounded-lg shadow-sm flex items-center gap-1 transition-transform active:scale-95">
            <span
              className="font-extrabold text-sm italic tracking-wide lowercase"
              style={{ fontFamily: "sans-serif" }}
            >
              mobasket
            </span>
            <ArrowUpRight size={16} strokeWidth={3} />
          </div>
        </Link>
      </div>
    </div>
  );
}
