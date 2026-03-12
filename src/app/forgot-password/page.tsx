"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      setIsSent(true);
      toast.success("Reset email sent! Check your inbox.");
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
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-[400px] w-[400px] rounded-full border border-primary/5"
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
          <Link href="/" className="inline-block">
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
          className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-xl"
        >
          {!isSent ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                Forgot Password?
              </h2>
              <p className="font-body text-sm text-muted-foreground text-center mb-6">
                No worries! Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground">
                    Email Address
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

                {/* Submit */}
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
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Check Your Email
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="font-body text-sm font-medium text-primary mb-6">
                  {email}
                </p>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                  <p className="font-body text-xs text-muted-foreground">
                    💡 Didn&apos;t receive the email? Check your spam folder or make sure you entered the correct email address.
                  </p>
                </div>

                <motion.button
                  onClick={() => setIsSent(false)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full rounded-xl border border-border bg-card py-3 font-body text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
                >
                  Try Another Email
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-border">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>

        {/* Help Text */}
        <p className="mt-6 text-center font-body text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="#" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
