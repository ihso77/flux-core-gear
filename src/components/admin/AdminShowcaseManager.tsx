import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Trash2, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShowcaseItem {
  id: string;
  customer_name: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

const AdminShowcaseManager = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("customer_showcase")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !customerName.trim()) {
      toast.error("أدخل اسم العميل واختر صورة");
      return;
    }

    setUploading(true);
    try {
      const ext = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("showcase")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("showcase")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("customer_showcase")
        .insert({
          customer_name: customerName.trim(),
          image_url: urlData.publicUrl,
          description: description.trim() || null,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (insertError) throw insertError;

      toast.success("تمت الإضافة بنجاح! ✅");
      setCustomerName("");
      setDescription("");
      setSelectedFile(null);
      setPreview(null);
      setShowForm(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || "حصل خطأ");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("customer_showcase").delete().eq("id", id);
    if (!error) {
      toast.success("تم الحذف");
      fetchItems();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Customer Showcase</h3>
            <p className="text-xs text-muted-foreground">{items.length} photos uploaded</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg gradient-pulse px-3 py-2 text-xs font-medium text-primary-foreground"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? "Cancel" : "Add Photo"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleUpload}
            className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4 overflow-hidden"
          >
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
            />

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {preview ? (
              <div className="relative rounded-lg overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-border py-8 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click to upload image</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={uploading}
              className="w-full rounded-lg gradient-pulse px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload Photo"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Showcase Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
            <img src={item.image_url} alt={item.customer_name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-white text-xs font-medium">{item.customer_name}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="h-7 w-7 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No customer photos yet. Click "Add Photo" to upload.
        </div>
      )}
    </div>
  );
};

export default AdminShowcaseManager;
