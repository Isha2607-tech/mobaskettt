import HeroSection from "../components/HeroSection";
import SectionTitle from "../components/SectionTitle";
import CategoryGrid from "../components/CategoryGrid";

const groceryItems = [
  {
    title: "Vegetables & Fruits",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Atta, Rice & Dal",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Oil, Ghee & Masala",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Dairy, Bread & Eggs",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Bakery & Biscuits",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Dry Fruits & Cereals",
    image: "https://via.placeholder.com/80",
  },
];

const snacksItems = [
  {
    title: "Chips & Namkeen",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Sweets & Chocolates",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Drinks & Juices",
    image: "https://via.placeholder.com/80",
  },
  {
    title: "Tea, Coffee & Milk",
    image: "https://via.placeholder.com/80",
  },
];

export default function Home() {
  return (
    <div className="pb-24 bg-white min-h-screen">
      <HeroSection />

      <SectionTitle title="Grocery & Kitchen" />
      <CategoryGrid items={groceryItems} />

      <SectionTitle title="Snacks & Drinks" />
      <CategoryGrid items={snacksItems} />
    </div>
  );
}
