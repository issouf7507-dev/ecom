import { productRepository } from "./repository";
import { prisma } from "@/lib/prisma";
import { Status } from "@/lib/constants/status";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "./types";

export class ProductService {
  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    const products = await productRepository.findAll(filters);
    return products as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    return productRepository.findById(id) as Promise<Product | null>;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return productRepository.findBySlug(slug) as Promise<Product | null>;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    // Validate images count
    if (data.images && data.images.length > 4) {
      throw new Error("Un produit ne peut avoir que 4 images maximum");
    }

    // Vérifier si le slug existe déjà
    const existing = await productRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error(`Un produit avec le slug "${data.slug}" existe déjà`);
    }

    // Vérifier si le SKU existe déjà (si variants)
    if (data.variants) {
      for (const variant of data.variants) {
        const existingVariant = await prisma.productVariant.findUnique({
          where: { sku: variant.sku },
        });
        if (existingVariant) {
          throw new Error(
            `Un variant avec le SKU "${variant.sku}" existe déjà`
          );
        }
      }
    }

    return productRepository.create(data) as Promise<Product>;
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    // Vérifier si la catégorie existe
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new Error("Produit non trouvé");
    }

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await productRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error(`Un produit avec le slug "${data.slug}" existe déjà`);
      }
    }

    return productRepository.update(id, data) as Promise<Product>;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Produit non trouvé");
    }

    await productRepository.delete(id);
  }
}

export const productService = new ProductService();
