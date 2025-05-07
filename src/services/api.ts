
import { toast } from "sonner";

// Mock data service for demo purposes
export const mockApiCall = <T>(data: T, delay: number = 800, shouldSucceed: boolean = true): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(data);
      } else {
        reject(new Error("API call failed"));
      }
    }, delay);
  });
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Handle API errors
export const handleApiError = (error: any): void => {
  const message = error?.message || "Une erreur s'est produite";
  toast.error("Erreur", {
    description: message,
  });
  console.error("API Error:", error);
};
