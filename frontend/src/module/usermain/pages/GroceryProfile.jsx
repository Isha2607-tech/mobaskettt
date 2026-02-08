import React from "react";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Wallet,
  Headphones,
  Smartphone,
  Moon,
  EyeOff,
  MapPin,
  Bookmark,
  Heart,
  FileText,
  Gift,
  Pill,
  CreditCard,
  Ticket,
  Trophy,
  HeartHandshake,
  Share2,
  Info,
  Lock,
  Bell,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProfile } from "@/module/user/context/ProfileContext";
import { clearModuleAuth } from "@/lib/utils/auth";
import { authAPI } from "@/lib/api";

const GroceryProfile = () => {
  const navigate = useNavigate();
  const { userProfile, vegMode, setVegMode } = useProfile();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("Logout API failed, cleaning up locally");
    }
    clearModuleAuth("user");
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("userAuthChanged"));
    navigate("/user/auth/sign-in", { replace: true });
  };

  const [appearance, setAppearance] = React.useState(() => {
    return localStorage.getItem("appTheme") || "light";
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (appearance === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("appTheme", appearance);
  }, [appearance]);

  const displayName = userProfile?.name || "Your account";
  const displayPhone = userProfile?.phone || "8877901155";
  const avatarInitial = userProfile?.name?.charAt(0)?.toUpperCase() || "U";
  const walletBalance = userProfile?.wallet?.balance?.toFixed(0) || "0";
  const hasBirthday = !!userProfile?.dateOfBirth;

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    rightElement,
    onClick,
    color = "text-slate-600",
  }) => (
    <div
      className="flex items-center justify-between py-4 px-4 bg-white active:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-slate-50 ${color}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-slate-800">{title}</h4>
          {subtitle && (
            <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightElement}
        <ChevronRight size={18} className="text-slate-300" />
      </div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <h3 className="text-[16px] font-bold text-slate-800 px-4 pt-6 pb-2 bg-slate-50/50">
      {title}
    </h3>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-sans pb-10">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-b from-[#FFF9C4] to-[#F7F9FB] pt-4 pb-8 px-4 relative">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-800" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-800">Profile</h1>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-3 border-4 border-white overflow-hidden">
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              {userProfile?.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-slate-300">
                  {avatarInitial}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-[24px] font-black text-slate-900 tracking-tight">
            {displayName}
          </h2>
          <p className="text-slate-500 font-bold tracking-wide">
            {displayPhone}
          </p>
        </div>

        {/* Birthday Banner */}
        {!hasBirthday && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate("/profile/edit")}
            className="bg-gradient-to-r from-[#FFFDE7] to-[#FFF9C4] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-yellow-100 mx-1 cursor-pointer"
          >
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 tracking-tight">
                Add your birthday
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-green-600 font-bold text-xs uppercase tracking-wider">
                  Enter details
                </span>
                <ChevronRight size={12} className="text-green-600 stroke-[3]" />
              </div>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-white/50 rounded-xl overflow-hidden">
              <span className="text-4xl animate-bounce">🎂</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- QUICK ACTIONS --- */}
      <div className="px-4 -mt-4 grid grid-cols-3 gap-3 mb-6">
        {[
          {
            icon: ShoppingBag,
            label: "Your orders",
            bg: "bg-white",
            color: "text-blue-500",
            onClick: () => navigate("/orders"),
          },
          {
            icon: Wallet,
            label: "MoBasket Money",
            bg: "bg-white",
            color: "text-orange-500",
            onClick: () => navigate("/wallet"),
          },
          {
            icon: Headphones,
            label: "Need help?",
            bg: "bg-white",
            color: "text-slate-700",
            onClick: () => navigate("/help"),
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={item.onClick}
            className={`${item.bg} rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-slate-100 cursor-pointer`}
          >
            <div className={`${item.color} mb-2`}>
              <item.icon size={24} />
            </div>
            <span className="text-[12px] font-bold text-slate-800 text-center leading-tight">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* --- MENU SECTIONS --- */}

      <div className="bg-white mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6 font-sans">
        <MenuItem
          icon={Moon}
          title="Appearance"
          onClick={() =>
            setAppearance(appearance === "light" ? "dark" : "light")
          }
          rightElement={
            <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider">
              {appearance}
            </span>
          }
        />
      </div>

      <div className="bg-white mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6">
        <SectionTitle title="Your information" />
        <MenuItem
          icon={MapPin}
          title="Address book"
          onClick={() => navigate("/profile/edit")}
        />
        <MenuItem
          icon={Bookmark}
          title="Bookmarked recipes"
          onClick={() => navigate("/profile/favorites")}
        />
        <MenuItem
          icon={Heart}
          title="Your wishlist"
          onClick={() => navigate("/wishlist")}
        />
        <MenuItem
          icon={FileText}
          title="GST details"
          onClick={() => navigate("/profile/edit")}
        />
        <MenuItem
          icon={Gift}
          title="E-gift cards"
          onClick={() => navigate("/gift-card")}
        />
      </div>

      <div className="bg-white mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6">
        <SectionTitle title="Payment and coupons" />
        <MenuItem
          icon={Wallet}
          title="Wallet"
          onClick={() => navigate("/wallet")}
        />
        <MenuItem
          icon={Wallet}
          title="MoBasket Money"
          subtitle={`Balance: ₹${walletBalance}`}
          onClick={() => navigate("/wallet")}
        />
        <MenuItem
          icon={CreditCard}
          title="Payment settings"
          onClick={() => navigate("/profile/payments")}
        />
        <MenuItem
          icon={Ticket}
          title="Claim Gift card"
          onClick={() => navigate("/gift-card")}
        />
        <MenuItem icon={Trophy} title="Your collected rewards" />
      </div>

      <div className="bg-white mx-4 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8">
        <SectionTitle title="Other Information" />
        <MenuItem icon={Share2} title="Share the app" />
        <MenuItem icon={Info} title="About us" />
        <MenuItem icon={Lock} title="Account privacy" />
        <MenuItem icon={Bell} title="Notification preferences" />
        <MenuItem
          icon={LogOut}
          title="Log out"
          color="text-red-500"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default GroceryProfile;
