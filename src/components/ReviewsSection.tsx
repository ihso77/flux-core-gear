import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, MessageSquare, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  message: string;
  created_at: string;
}

const maskName = (name: string) => {
  if (!name || name.length <= 2) return name;
  return name.slice(0, 2) + "***";
};

const saudiReviews: Omit<Review, "id">[] = [
  { customer_name: "محمد الشمري", rating: 5, message: "والله المنتج رهيب! الكيبورد حلو مرره وصوته يجنن 🔥", created_at: "2026-03-10T10:00:00Z" },
  { customer_name: "عبدالله القحطاني", rating: 5, message: "أفضل ماوس جربته بحياتي، السرعة خيالية والدقة عالية جداً 💯", created_at: "2026-03-08T14:00:00Z" },
  { customer_name: "فهد العتيبي", rating: 4, message: "السماعة نظيفة والصوت واضح، بس كنت أتمنى لو فيها إلغاء ضوضاء أقوى", created_at: "2026-03-05T09:00:00Z" },
  { customer_name: "سارة الدوسري", rating: 5, message: "طلبت ماوس باد وكيبورد، وصلوني بسرعة والتغليف مرتب، شكراً نوفا ❤️", created_at: "2026-03-01T16:00:00Z" },
  { customer_name: "خالد المالكي", rating: 5, message: "أنا من زمان أدور متجر كذا، المنتجات أصلية والأسعار معقولة 👌", created_at: "2026-02-28T11:00:00Z" },
  { customer_name: "نورة الحربي", rating: 4, message: "الكيبورد اللي شريته مرره حلو بس تمنيت يكون فيه ألوان أكثر", created_at: "2026-02-25T08:00:00Z" },
  { customer_name: "عمر السبيعي", rating: 5, message: "ما توقعت الجودة تكون بهالمستوى، فعلاً يستاهل كل ريال! 🎮", created_at: "2026-02-20T13:00:00Z" },
  { customer_name: "ريم العنزي", rating: 5, message: "شريت هدية لأخوي وانبسط مرره، الباكج كان أنيق والمنتج ممتاز", created_at: "2026-02-15T10:00:00Z" },
  { customer_name: "سلطان الغامدي", rating: 4, message: "المنتج جميل والتوصيل كان سريع، بس أتمنى يكون فيه خيارات دفع أكثر", created_at: "2026-02-10T15:00:00Z" },
  { customer_name: "هند الزهراني", rating: 5, message: "أول مرة أشتري أونلاين وأكون مرتاحة بهالشكل، متجر موثوق 100% ✅", created_at: "2026-02-05T12:00:00Z" },
];

const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => onRate?.(star)}
        whileHover={interactive ? { scale: 1.2 } : undefined}
        whileTap={interactive ? { scale: 0.9 } : undefined}
        className={interactive ? "cursor-pointer" : "cursor-default"}
      >
        <Star
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          }`}
        />
      </motion.button>
    ))}
  </div>
);

const ReviewsSection = () => {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data && data.length > 0) {
      setReviews(data);
    } else {
      // Show default Saudi reviews
      setReviews(saudiReviews.map((r, i) => ({ ...r, id: `default-${i}` })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast.error("سجّل دخول عشان تقدر تقيّم");
      return;
    }
    if (rating === 0) {
      toast.error("اختر عدد النجوم");
      return;
    }
    if (!message.trim()) {
      toast.error("اكتب رسالتك");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      customer_name: profile.full_name || profile.email || "عميل",
      rating,
      message: message.trim(),
    });

    if (error) {
      toast.error("حصل خطأ، حاول مرة ثانية");
    } else {
      toast.success("شكراً على تقييمك! ⭐");
      setRating(0);
      setMessage("");
      setShowForm(false);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="container relative mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
              آراء العملاء
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            ايش قالوا عملاءنا{" "}
            <span className="text-gradient-pulse">عن تجربتهم</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="font-display text-xl font-bold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} تقييم)</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {reviews.slice(0, 9).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 sm:p-6"
            >
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/10" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {review.customer_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{maskName(review.customer_name)}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed" dir="rtl">
                {review.message}
              </p>

              <p className="text-[10px] text-muted-foreground/50 mt-3">
                {new Date(review.created_at).toLocaleDateString("ar-SA")}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Add Review Button / Form */}
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!user) {
                      toast.error("سجّل دخول أول عشان تقدر تقيّم");
                      return;
                    }
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl gradient-pulse px-8 py-3 font-body text-sm font-semibold text-primary-foreground"
                >
                  <Star className="h-4 w-4" />
                  قيّم تجربتك معنا
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 space-y-4"
                dir="rtl"
              >
                <h3 className="font-display text-lg font-semibold text-foreground text-center">شاركنا رأيك ⭐</h3>
                
                <div className="flex justify-center">
                  <StarRating rating={rating} interactive onRate={setRating} />
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب تجربتك هنا..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none"
                  maxLength={500}
                />

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl gradient-pulse px-6 py-3 font-body text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "جاري الإرسال..." : "أرسل التقييم"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    إلغاء
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
