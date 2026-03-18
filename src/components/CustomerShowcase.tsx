import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ShowcaseItem {
  id: string;
  customer_name: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

const CustomerShowcase = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);

  useEffect(() => {
    const fetchShowcase = async () => {
      const { data } = await supabase
        .from("customer_showcase")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      if (data) setItems(data);
    };
    fetchShowcase();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      
      <div className="container relative mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-primary" />
            <span className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              عملاءنا
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            <span className="text-gradient-pulse">سيت أب</span> عملاءنا
          </h2>
          <p className="text-muted-foreground text-sm mt-2">صور حقيقية من عملاء نوفا</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-square"
            >
              <img
                src={item.image_url}
                alt={item.customer_name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <p className="text-white text-sm font-medium">{item.customer_name}</p>
                  </div>
                  {item.description && (
                    <p className="text-white/70 text-xs mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerShowcase;
