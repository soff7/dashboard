
import { generateId, mockApiCall, handleApiError } from "./api";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: "disponible" | "rupture" | "arrivage";
  imageUrl: string;
  createdAt: Date;
}

// Initial mock products
const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Tube PVC 110mm",
    category: "Plomberie",
    description: "Tube PVC pression pour eau potable",
    price: 12.99,
    stock: 65,
    status: "disponible",
    imageUrl: "https://placehold.co/200x150",
    createdAt: new Date(2023, 3, 15),
  },
  {
    id: "prod-2",
    name: "Raccord PE 50mm",
    category: "Raccords",
    description: "Raccord pour tube polyéthylène",
    price: 7.50,
    stock: 0,
    status: "rupture",
    imageUrl: "https://placehold.co/200x150",
    createdAt: new Date(2023, 2, 22),
  },
  {
    id: "prod-3",
    name: "Tube PEHD 63mm",
    category: "Plomberie",
    description: "Tube polyéthylène haute densité",
    price: 15.75,
    stock: 42,
    status: "disponible",
    imageUrl: "https://placehold.co/200x150",
    createdAt: new Date(2023, 5, 7),
  },
  {
    id: "prod-4",
    name: "Coude PVC 90°",
    category: "Raccords",
    description: "Coude à 90 degrés pour tube PVC",
    price: 3.25,
    stock: 18,
    status: "arrivage",
    imageUrl: "https://placehold.co/200x150",
    createdAt: new Date(2023, 4, 30),
  },
];

// Mock products data store
let products = [...initialProducts];

export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      return await mockApiCall(products);
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Get product by id
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const product = products.find((p) => p.id === id);
      return await mockApiCall(product || null);
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  // Create product
  createProduct: async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    try {
      const newProduct: Product = {
        id: generateId(),
        ...productData,
        createdAt: new Date(),
      };
      
      products = [...products, newProduct];
      await mockApiCall(null);
      
      toast.success("Produit créé", {
        description: `${productData.name} a été ajouté avec succès.`,
      });
      
      return newProduct;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;

      const updatedProduct = {
        ...products[index],
        ...productData,
      };

      products = [
        ...products.slice(0, index),
        updatedProduct,
        ...products.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Produit mis à jour", {
        description: `${updatedProduct.name} a été mis à jour avec succès.`,
      });
      
      return updatedProduct;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return false;

      const deletedProduct = products[index];
      products = [
        ...products.slice(0, index),
        ...products.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Produit supprimé", {
        description: `${deletedProduct.name} a été supprimé avec succès.`,
      });
      
      return true;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
