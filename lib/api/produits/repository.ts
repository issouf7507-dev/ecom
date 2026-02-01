import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "./types";

export class ProductRepository {
  async findAll(filters?: ProductFilters): Promise<any[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters?.isNewArrival !== undefined) {
      where.isNewArrival = filters.isNewArrival;
    }

    if (filters?.isPreOrder !== undefined) {
      where.isPreOrder = filters.isPreOrder;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { slug: { contains: filters.search } },
        { barcode: { contains: filters.search } },
      ];
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { variants: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });
  }

  async create(data: CreateProductInput): Promise<any> {
    const { images, variants, ...productData } = data;

    // Ensure at least one image is primary
    const processedImages =
      images?.map((img, index) => ({
        ...img,
        sortOrder: img.sortOrder ?? index,
        isPrimary: img.isPrimary ?? index === 0,
      })) || [];

    return prisma.product.create({
      data: {
        ...productData,
        status: (productData.status as Status) || Status.ACTIVE,
        taxRate: productData.taxRate ?? 0,
        featured: productData.featured ?? false,
        isNewArrival: productData.isNewArrival ?? false,
        isPreOrder: productData.isPreOrder ?? false,
        trackInventory: productData.trackInventory ?? true,
        stockQuantity: productData.stockQuantity ?? 0,
        lowStockThreshold: productData.lowStockThreshold ?? 10,
        rating: 0,
        reviewCount: 0,
        viewCount: 0,
        images: {
          create: processedImages,
        },
        variants: variants
          ? {
              create: variants.map((variant) => ({
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock ?? 0,
                weight: variant.weight,
              })),
            }
          : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<any> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.shortDescription !== undefined && {
          shortDescription: data.shortDescription,
        }),
        ...(data.barcode !== undefined && { barcode: data.barcode }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.compareAtPrice !== undefined && {
          compareAtPrice: data.compareAtPrice,
        }),
        ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
        ...(data.taxRate !== undefined && { taxRate: data.taxRate }),
        ...(data.status && { status: data.status }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.isNewArrival !== undefined && {
          isNewArrival: data.isNewArrival,
        }),
        ...(data.releaseDate !== undefined && {
          releaseDate: data.releaseDate,
        }),
        ...(data.isPreOrder !== undefined && { isPreOrder: data.isPreOrder }),
        ...(data.availabilityDate !== undefined && {
          availabilityDate: data.availabilityDate,
        }),
        ...(data.availabilityTime !== undefined && {
          availabilityTime: data.availabilityTime,
        }),
        ...(data.trackInventory !== undefined && {
          trackInventory: data.trackInventory,
        }),
        ...(data.stockQuantity !== undefined && {
          stockQuantity: data.stockQuantity,
        }),
        ...(data.lowStockThreshold !== undefined && {
          lowStockThreshold: data.lowStockThreshold,
        }),
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.length !== undefined && { length: data.length }),
        ...(data.width !== undefined && { width: data.width }),
        ...(data.height !== undefined && { height: data.height }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && {
          metaDescription: data.metaDescription,
        }),
        ...(data.metaKeywords !== undefined && {
          metaKeywords: data.metaKeywords,
        }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
