"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setErrors({
          email: result.error.message || "Erreur de connexion",
          password: result.error.message || "Erreur de connexion",
        });
        toast.error(result.error.message || "Erreur de connexion");
      } else {
        toast.success("Connexion réussie !");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setErrors({
        email: "Une erreur est survenue",
        password: "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold orbitron mb-2"
            >
              Connexion
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-600 text-sm">
              Connectez-vous pour continuer vos achats
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 orbitron"
              >
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="size-4" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2 orbitron"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="size-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </motion.div>

            {/* Forgot password link */}
            <motion.div variants={itemVariants} className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-black transition-colors orbitron"
              >
                Mot de passe oublié ?
              </Link>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                // variant="primary"
                size="lg"
                className="w-full orbitron"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Se connecter
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </motion.div>

          {/* Link to register */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-black font-semibold hover:underline orbitron"
              >
                S'inscrire
              </Link>
            </p>
          </motion.div>

          {/* Back to home */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-black transition-colors orbitron"
            >
              ← Retour à l'accueil
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
