import { motion } from "framer-motion";
import { 
  Keyboard, 
  Mouse, 
  Headphones, 
  Monitor, 
  Gamepad2,
  Cable,
  Package,
  Sparkles
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ComponentType<{ className?: string }>;
  query: string;
  priority: number; // For sorting
}

export const categories: Category[] = [
  {
    id: "all",
    label: "All Products",
    labelAr: "جميع المنتجات",
    icon: Sparkles,
    query: "",
    priority: 0,
  },
  {
    id: "keyboards",
    label: "Keyboards",
    labelAr: "لوحات المفاتيح",
    icon: Keyboard,
    query: "keyboard",
    priority: 1,
  },
  {
    id: "mouse",
    label: "Mouse",
    labelAr: "الفأرة",
    icon: Mouse,
    query: "mouse",
    priority: 2,
  },
  {
    id: "headsets",
    label: "Headsets",
    labelAr: "سماعات الرأس",
    icon: Headphones,
    query: "headset OR headphone",
    priority: 3,
  },
  {
    id: "monitors",
    label: "Monitors",
    labelAr: "الشاشات",
    icon: Monitor,
    query: "monitor",
    priority: 4,
  },
  {
    id: "controllers",
    label: "Controllers",
    labelAr: "وحدات التحكم",
    icon: Gamepad2,
    query: "controller OR gamepad",
    priority: 5,
  },
  {
    id: "accessories",
    label: "Accessories",
    labelAr: "الإكسسوارات",
    icon: Cable,
    query: "accessory OR cable OR pad OR stand OR mousepad",
    priority: 6,
  },
  {
    id: "bundles",
    label: "Bundles",
    labelAr: "الحزم",
    icon: Package,
    query: "bundle OR kit OR set",
    priority: 7,
  },
].sort((a, b) => a.priority - b.priority); // Sort by priority

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 min-w-max px-1">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center gap-2 rounded-xl px-4 py-3 font-body text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  layoutId="category-glow"
                  className="absolute inset-0 rounded-xl bg-primary opacity-20 blur-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Icon className={`h-4 w-4 relative z-10 ${isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`} />
              </motion.div>
              
              <span className="relative z-10">{category.label}</span>
              
              {/* Hover shimmer effect */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
