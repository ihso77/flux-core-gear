import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      setSent(true);
      toast.success("Password reset email sent!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full border border-primary/5"
        />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-bold text-foreground">
              NOV<span className="text-gradient-pulse">A</span>
            </span>
          </Link>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Reset your password
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">
                Check your email
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                We sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-body text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Forgot Password?
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-pulse py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center font-body text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
