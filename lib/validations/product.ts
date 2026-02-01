// Validations pour les produits

import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.number().positive("Le prix doit être positif"),
  category: z.string().min(1, "La catégorie est requise"),
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  image: z.string().url("L'image doit être une URL valide"),
});

export type ProductFormData = z.infer<typeof productSchema>;

