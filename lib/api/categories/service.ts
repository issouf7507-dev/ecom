import { categoryRepository } from "./repository";
import type {
  Category,
  CategoryWithChildren,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
  CategoryStats,
} from "./types";

export class CategoryService {
  async getAllCategories(filters?: CategoryFilters): Promise<Category[]> {
    const categories = await categoryRepository.findAll(filters);
    
    // Ajouter le productCount à chaque catégorie et retirer _count
    return categories.map((category: any) => {
      const { _count, ...rest } = category;
      return {
        ...rest,
        productCount: _count?.products || 0,
      } as Category;
    });
  }

  async getCategoryById(id: string): Promise<CategoryWithChildren | null> {
    return categoryRepository.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) return null;
    
    const { _count, ...rest } = category;
    return {
      ...rest,
      productCount: _count?.products || 0,
    } as Category;
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    // Vérifier si le slug existe déjà
    const existing = await categoryRepository.findBySlug(data.slug);
    if (existing) {
      throw new Error(`Une catégorie avec le slug "${data.slug}" existe déjà`);
    }

    const category = await categoryRepository.create(data);
    const { _count, ...rest } = category;
    return {
      ...rest,
      productCount: _count?.products || 0,
    } as Category;
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    // Vérifier si la catégorie existe
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new Error("Catégorie non trouvée");
    }

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await categoryRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error(`Une catégorie avec le slug "${data.slug}" existe déjà`);
      }
    }

    const category = await categoryRepository.update(id, data);
    const { _count, ...rest } = category;
    return {
      ...rest,
      productCount: _count?.products || 0,
    } as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Catégorie non trouvée");
    }

    // Vérifier s'il y a des produits associés
    if (category.productCount && category.productCount > 0) {
      throw new Error(
        "Impossible de supprimer une catégorie qui contient des produits"
      );
    }

    // Vérifier s'il y a des catégories enfants
    if (category.children && category.children.length > 0) {
      throw new Error(
        "Impossible de supprimer une catégorie qui contient des sous-catégories"
      );
    }

    await categoryRepository.delete(id);
  }

  async getStats(): Promise<CategoryStats> {
    return categoryRepository.getStats();
  }
}

export const categoryService = new CategoryService();
