import { Card, CardContent } from "./ui/card";
import { 
  Smartphone, 
  Laptop, 
  Wallet, 
  Key, 
  Glasses, 
  Backpack, 
  BookOpen, 
  Watch,
  Headphones,
  UmbrellaIcon,
  MoreHorizontal,
  IdCard
} from "lucide-react";
import { useItems } from "../hooks/useItems";
import { useMemo } from "react";
import { CATEGORIES } from "../types/item";
import { useNavigate } from "react-router-dom";

const categoryIcons = {
  Electronics: Smartphone,
  Accessories: Wallet,
  Bags: Backpack,
  Documents: BookOpen,
  "ID Card": IdCard,
  Keys: Key,
  Clothing: Watch,
  Books: BookOpen,
  Others: MoreHorizontal,
};

const categoryColors = {
  Electronics: "bg-blue-500",
  Accessories: "bg-green-500",
  Bags: "bg-purple-500",
  Documents: "bg-orange-500",
  "ID Card": "bg-teal-500",
  Keys: "bg-yellow-500",
  Clothing: "bg-pink-500",
  Books: "bg-indigo-500",
  Others: "bg-gray-500",
};

const CategoriesSection = () => {
  const { items } = useItems();
  const navigate = useNavigate();

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const categories = CATEGORIES.map(category => ({
    name: category,
    icon: categoryIcons[category],
    color: categoryColors[category],
    count: countsByCategory[category] ?? 0,
  }));

  const handleCategoryClick = (categoryName: string) => {
    // Convert category name to URL-friendly format (replace spaces with hyphens)
    const urlCategory = categoryName.replace(/\s+/g, '-');
    navigate(`/category/${urlCategory}`);
  };
  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-foreground animate-slide-down">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Find your lost item or browse found items by category. Each category shows the current number of available items.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.name}
                className="group cursor-pointer hover-lift hover-glow border-0 shadow-soft bg-card hover:bg-card/80 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} text-white group-hover:scale-110 transition-all duration-300 animate-bounce-in`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {category.count} total items
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;