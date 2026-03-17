import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Github, Chrome, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Password strength
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast.error(error.message || "Failed to create account");
      setIsLoading(false);
    } else {
      toast.success("Account created successfully! Welcome to Nova!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-3 sm:px-4 py-12 sm:py-20 overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -top-1/4 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[600px] md:w-[600px] rounded-full border border-primary/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] rounded-full border border-primary/5"
        />
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px] sm:blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm sm:max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5 sm:mb-8"
        >
          <Link to="/" className="inline-block">
            <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              NOV<span className="text-gradient-pulse">A</span>
            </span>
          </Link>
          <p className="mt-1.5 sm:mt-2 font-body text-xs sm:text-sm text-muted-foreground">
            Join the gaming elite
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl sm:rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-xl"
        >
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 font-body text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 sm:focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 font-body text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 sm:focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 pl-9 sm:pl-11 pr-9 sm:pr-11 font-body text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 sm:focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              {/* Password Strength */}
              {password && (
                <div className="space-y-1 sm:space-y-1.5 pt-1">
                  <div className="flex gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Strength: {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="font-body text-xs sm:text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 pl-9 sm:pl-11 pr-9 sm:pr-11 font-body text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 sm:focus:ring-2 focus:ring-primary/20"
                />
                {confirmPassword && password === confirmPassword && (
                  <Check className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer py-1">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 sm:h-5 sm:w-5 rounded border transition-colors flex items-center justify-center ${
                  agreeTerms ? "bg-primary border-primary" : "border-border bg-background"
                }`}>
                  {agreeTerms && <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-foreground" />}
                </div>
              </div>
              <span className="font-body text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 rounded-lg sm:rounded-xl gradient-pulse py-2.5 sm:py-3 font-body text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 touch-manipulation"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-4 sm:my-6 flex items-center gap-3 sm:gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-body text-[10px] sm:text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 font-body text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-card touch-manipulation"
            >
              <Chrome className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Google</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-border bg-background py-2.5 sm:py-3 font-body text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-card touch-manipulation"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>GitHub</span>
            </motion.button>
          </div>

          {/* Sign In Link */}
          <p className="mt-4 sm:mt-6 text-center font-body text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
