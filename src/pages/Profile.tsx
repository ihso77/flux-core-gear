import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Gamepad2, Camera, Save, Loader2, 
  LogOut, Shield, Bell, ShoppingBag, Heart, Settings, Edit3, Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Saudi Arabia",
    preferred_platform: "",
    gaming_experience: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        address_line1: profile.address_line1 || "",
        city: profile.city || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        country: profile.country || "Saudi Arabia",
        preferred_platform: profile.preferred_platform || "",
        gaming_experience: profile.gaming_experience || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await updateProfile(formData);
    setIsLoading(false);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { icon: ShoppingBag, label: "Orders", value: profile?.total_orders || 0 },
    { icon: Heart, label: "Wishlist", value: 0 },
    { icon: Award, label: "Points", value: profile?.loyalty_points || 0 },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-primary/3 blur-[80px]" />
      </div>

      <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-primary-foreground">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary touch-manipulation">
                <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                {profile?.full_name || "Gamer"}
              </h1>
              <p className="font-body text-xs sm:text-sm text-muted-foreground truncate">
                {profile?.email}
              </p>
              {profile?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-body text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                isEditing 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-foreground hover:border-primary/30"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{isEditing ? "Editing" : "Edit Profile"}</span>
              <span className="sm:hidden">{isEditing ? "Editing" : "Edit"}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-card border border-border text-muted-foreground font-body text-xs sm:text-sm font-medium hover:text-red-500 hover:border-red-500/30 transition-colors touch-manipulation"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-lg sm:rounded-xl border border-border bg-card/50 p-3 sm:p-4 text-center"
            >
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
              <div className="font-display text-base sm:text-lg md:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="font-body text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Personal Information */}
            <div className="rounded-lg sm:rounded-xl border border-border bg-card/50 p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.full_name || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">@{formData.username || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Email</label>
                  <p className="font-body text-xs sm:text-sm text-foreground flex items-center gap-1.5 sm:gap-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{formData.email}</span>
                  </p>
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground flex items-center gap-1.5 sm:gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span>{formData.phone || "—"}</span>
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary resize-none"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.bio || "—"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-lg sm:rounded-xl border border-border bg-card/50 p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Address Line</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address_line1}
                      onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.address_line1 || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.city || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.state || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.postal_code || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Country</label>
                  <p className="font-body text-xs sm:text-sm text-foreground">{formData.country}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full rounded-xl gradient-pulse py-2.5 sm:py-3 font-body text-xs sm:text-sm font-semibold text-primary-foreground touch-manipulation"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Right Column - Gaming & Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Gaming Profile */}
            <div className="rounded-lg sm:rounded-xl border border-border bg-card/50 p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Gaming Profile
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Platform</label>
                  {isEditing ? (
                    <select
                      value={formData.preferred_platform}
                      onChange={(e) => setFormData({ ...formData, preferred_platform: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="">Select</option>
                      <option value="PC">PC</option>
                      <option value="PlayStation">PlayStation</option>
                      <option value="Xbox">Xbox</option>
                      <option value="Nintendo">Nintendo</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground">{formData.preferred_platform || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body text-[10px] sm:text-xs text-muted-foreground mb-1">Level</label>
                  {isEditing ? (
                    <select
                      value={formData.gaming_experience}
                      onChange={(e) => setFormData({ ...formData, gaming_experience: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="">Select</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Pro</option>
                    </select>
                  ) : (
                    <p className="font-body text-xs sm:text-sm text-foreground capitalize">{formData.gaming_experience || "—"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="rounded-lg sm:rounded-xl border border-border bg-card/50 p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Quick Settings
              </h2>
              <div className="space-y-1 sm:space-y-2">
                {[
                  { icon: Bell, label: "Notifications" },
                  { icon: Shield, label: "Security" },
                  { icon: Heart, label: "Wishlist" },
                  { icon: ShoppingBag, label: "Orders" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5 transition-colors touch-manipulation"
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span className="font-body text-xs sm:text-sm text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
