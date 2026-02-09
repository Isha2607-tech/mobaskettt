import { Link } from "react-router-dom";

import { ArrowLeft, Clock, MapPin, Heart, Star } from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import TextReveal from "../../components/TextReveal";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "../../context/ProfileContext";

// All restaurants data - same as Home page
const restaurants = [
  {
    id: 1,
    name: "Golden Dragon",
    cuisine: "Chinese",
    rating: 4.8,
    deliveryTime: "25-30 min",
    distance: "1.2 km",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop",
    priceRange: "$$",
  },
  {
    id: 2,
    name: "Burger Paradise",
    cuisine: "American",
    rating: 4.6,
    deliveryTime: "20-25 min",
    distance: "0.8 km",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    priceRange: "$",
  },
  {
    id: 3,
    name: "Sushi Master",
    cuisine: "Japanese",
    rating: 4.9,
    deliveryTime: "30-35 min",
    distance: "2.1 km",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    priceRange: "$$$",
  },
  {
    id: 4,
    name: "Pizza Corner",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "15-20 min",
    distance: "0.5 km",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    priceRange: "$$",
  },
  {
    id: 5,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.5,
    deliveryTime: "20-25 min",
    distance: "1.5 km",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop",
    priceRange: "$",
  },
  {
    id: 6,
    name: "Fresh Salad Bar",
    cuisine: "Healthy",
    rating: 4.4,
    deliveryTime: "15-20 min",
    distance: "0.9 km",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    priceRange: "$$",
  },
];

export default function Restaurants() {
  const { addFavorite, removeFavorite, isFavorite } = useProfile();

  return (
    <AnimatedPage className="min-h-screen bg-gradient-to-b from-yellow-50/30 dark:from-[#0a0a0a] via-white dark:via-[#0a0a0a] to-orange-50/20 dark:to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 md:py-8 lg:py-10 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-4 lg:mb-6">
            <Link to="/user">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-900 dark:text-gray-100" />
              </Button>
            </Link>
            <TextReveal className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                All Restaurants
              </h1>
            </TextReveal>
          </div>
        </ScrollReveal>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 pt-2 sm:pt-3 lg:pt-4">
          {restaurants.map((restaurant, index) => {
            const restaurantSlug = restaurant.name
              .toLowerCase()
              .replace(/\s+/g, "-");
            const favorite = isFavorite(restaurantSlug);

            const handleToggleFavorite = (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (favorite) {
                removeFavorite(restaurantSlug);
              } else {
                addFavorite({
                  slug: restaurantSlug,
                  name: restaurant.name,
                  cuisine: restaurant.cuisine,
                  rating: restaurant.rating,
                  deliveryTime: restaurant.deliveryTime,
                  distance: restaurant.distance,
                  priceRange: restaurant.priceRange,
                  image: restaurant.image,
                });
              }
            };

            return (
              <ScrollReveal key={restaurant.id} delay={index * 0.1}>
                <Link
                  to={`/user/restaurants/${restaurantSlug}`}
                  className="h-full flex"
                >
                  <Card className="overflow-hidden gap-0 cursor-pointer border border-gray-100 dark:border-gray-800 group bg-white dark:bg-[#1a1a1a] transition-all duration-300 py-0 rounded-[24px] flex flex-col h-full w-full relative shadow-sm hover:shadow-md">
                    {/* Image Section */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-[24px]">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />

                      {/* Offer Badge on Image */}
                      <div className="absolute bottom-3 left-0 bg-[#2563eb] text-white text-[10px] font-bold px-2 py-1 shadow-lg z-10 leading-none">
                        50% OFF UPTO ₹100
                      </div>

                      {/* Bookmark Icon */}
                      <motion.div
                        variants={{
                          rest: { scale: 1 },
                          hover: { scale: 1.1 },
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleToggleFavorite}
                          className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                            favorite
                              ? "border-rose-500/80 bg-rose-50 text-rose-500/80"
                              : "border-white bg-white/90 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <Bookmark
                            className={`h-4 w-4 transition-all duration-300 ${
                              favorite ? "fill-rose-500/80" : ""
                            }`}
                          />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-3 sm:px-4 py-3 flex flex-col flex-grow">
                      <div className="flex justify-between items-start">
                        {/* Left Info */}
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="text-[17px] font-bold text-neutral-900 dark:text-gray-100 line-clamp-1 leading-tight mb-0.5">
                            {restaurant.name}
                          </h3>
                          <p className="text-[12px] text-neutral-500 dark:text-gray-500 font-medium truncate">
                            {restaurant.cuisine ||
                              "North Indian, Fast Food, Chinese"}
                          </p>
                        </div>

                        {/* Right Info */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="bg-[#15803d] text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[11px] font-bold">
                            <span>{restaurant.rating}</span>
                            <Star
                              className="h-2.5 w-2.5 fill-white text-white"
                              strokeWidth={3}
                            />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-gray-400 font-medium whitespace-nowrap">
                            {restaurant.priceRange === "$$$"
                              ? "₹500 for one"
                              : restaurant.priceRange === "$$"
                                ? "₹300 for one"
                                : "₹200 for one"}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-gray-400 font-medium">
                            {restaurant.deliveryTime}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
      <Footer />
    </AnimatedPage>
  );
}
