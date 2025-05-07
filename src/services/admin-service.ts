
import { generateId, mockApiCall, handleApiError } from "./api";
import { toast } from "sonner";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "editor";
  lastActive: Date;
  avatar: string;
  status: "active" | "inactive";
}

// Initial mock admins
const initialAdmins: Admin[] = [
  {
    id: "admin-1",
    name: "Jean Dupont",
    email: "jean.dupont@mtps.fr",
    role: "super-admin",
    lastActive: new Date(2023, 6, 15),
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "active",
  },
  {
    id: "admin-2",
    name: "Marie Laurent",
    email: "marie.laurent@mtps.fr",
    role: "admin",
    lastActive: new Date(2023, 6, 10),
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "active",
  },
  {
    id: "admin-3",
    name: "Pierre Martin",
    email: "pierre.martin@mtps.fr",
    role: "editor",
    lastActive: new Date(2023, 6, 5),
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "inactive",
  },
];

// Mock admins data store
let admins = [...initialAdmins];

export const adminService = {
  // Get all admins
  getAdmins: async (): Promise<Admin[]> => {
    try {
      return await mockApiCall(admins);
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Get admin by id
  getAdminById: async (id: string): Promise<Admin | null> => {
    try {
      const admin = admins.find((a) => a.id === id);
      return await mockApiCall(admin || null);
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  // Create admin
  createAdmin: async (adminData: Omit<Admin, "id">): Promise<Admin> => {
    try {
      const newAdmin: Admin = {
        id: generateId(),
        ...adminData,
      };
      
      admins = [...admins, newAdmin];
      await mockApiCall(null);
      
      toast.success("Administrateur créé", {
        description: `${adminData.name} a été ajouté avec succès.`,
      });
      
      return newAdmin;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Update admin
  updateAdmin: async (id: string, adminData: Partial<Admin>): Promise<Admin | null> => {
    try {
      const index = admins.findIndex((a) => a.id === id);
      if (index === -1) return null;

      const updatedAdmin = {
        ...admins[index],
        ...adminData,
      };

      admins = [
        ...admins.slice(0, index),
        updatedAdmin,
        ...admins.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Administrateur mis à jour", {
        description: `${updatedAdmin.name} a été mis à jour avec succès.`,
      });
      
      return updatedAdmin;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (id: string): Promise<boolean> => {
    try {
      const index = admins.findIndex((a) => a.id === id);
      if (index === -1) return false;

      const deletedAdmin = admins[index];
      admins = [
        ...admins.slice(0, index),
        ...admins.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Administrateur supprimé", {
        description: `${deletedAdmin.name} a été supprimé avec succès.`,
      });
      
      return true;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
