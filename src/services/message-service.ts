
import { generateId, mockApiCall, handleApiError } from "./api";
import { toast } from "sonner";

export interface Message {
  id: string;
  sender: string;
  email: string;
  subject: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  status?: "new" | "in-progress" | "completed" | "archived";
}

// Initial mock messages
const initialMessages: Message[] = [
  {
    id: "msg-1",
    sender: "Société Plomberie Générale",
    email: "contact@plomberie-generale.fr",
    subject: "Demande d'information technique",
    content: "Bonjour, nous souhaiterions obtenir des précisions sur les caractéristiques techniques des tubes PVC diamètre 110mm. Pourriez-vous nous faire parvenir la fiche technique complète ? Cordialement, Jean Dupont, Directeur technique",
    createdAt: new Date(2023, 6, 15),
    isRead: false,
    priority: "high",
    status: "new"
  },
  {
    id: "msg-2",
    sender: "Marie Dubois",
    email: "m.dubois@gmail.com",
    subject: "Demande de disponibilité",
    content: "Bonjour, je souhaite savoir si vous avez en stock des raccords PE de 32mm ? Merci d'avance pour votre réponse.",
    createdAt: new Date(2023, 6, 10),
    isRead: true,
    priority: "medium",
    status: "in-progress"
  },
  {
    id: "msg-3",
    sender: "Entreprise Construction Moderne",
    email: "contact@construction-moderne.com",
    subject: "Problème avec commande #45789",
    content: "Nous avons reçu notre commande aujourd'hui mais il manque les coudes PVC 90° que nous avions commandés. Pouvez-vous résoudre ce problème rapidement ?",
    createdAt: new Date(2023, 6, 8),
    isRead: true,
    priority: "high",
    status: "completed"
  },
  {
    id: "msg-4",
    sender: "Pierre Martin",
    email: "p.martin@hotmail.fr",
    subject: "Demande d'information",
    content: "Bonjour, pourriez-vous m'indiquer si vos tubes PEHD sont certifiés pour usage alimentaire ? Merci d'avance.",
    createdAt: new Date(2023, 6, 5),
    isRead: false,
    priority: "low",
    status: "new"
  },
  {
    id: "msg-5",
    sender: "Cabinet Architecture Durable",
    email: "projets@archi-durable.fr",
    subject: "Demande de partenariat",
    content: "Bonjour, notre cabinet d'architecture spécialisé dans les constructions écologiques cherche des fournisseurs engagés dans une démarche durable. Pourrions-nous échanger sur une possible collaboration ? Cordialement, Sophie Laurent, Directrice des partenariats",
    createdAt: new Date(2023, 6, 3),
    isRead: true,
    priority: "medium",
    status: "archived"
  },
];

// Mock messages data store
let messages = [...initialMessages];

export const messageService = {
  // Get all messages
  getMessages: async (): Promise<Message[]> => {
    try {
      return await mockApiCall(messages);
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Get message by id
  getMessageById: async (id: string): Promise<Message | null> => {
    try {
      const message = messages.find((m) => m.id === id);
      return await mockApiCall(message || null);
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  // Create message
  createMessage: async (messageData: Omit<Message, "id" | "createdAt" | "isRead" | "status">): Promise<Message> => {
    try {
      const newMessage: Message = {
        id: generateId(),
        ...messageData,
        createdAt: new Date(),
        isRead: false,
        status: "new"
      };
      
      messages = [...messages, newMessage];
      await mockApiCall(null);
      
      toast.success("Message créé", {
        description: `Le message de ${messageData.sender} a été ajouté avec succès.`,
      });
      
      return newMessage;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Mark message as read
  markAsRead: async (id: string): Promise<Message | null> => {
    try {
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) return null;

      const updatedMessage = {
        ...messages[index],
        isRead: true,
      };

      messages = [
        ...messages.slice(0, index),
        updatedMessage,
        ...messages.slice(index + 1),
      ];

      await mockApiCall(null);
      return updatedMessage;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Update message status
  updateMessageStatus: async (id: string, status: Message["status"]): Promise<Message | null> => {
    try {
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) return null;

      const updatedMessage = {
        ...messages[index],
        status,
      };

      messages = [
        ...messages.slice(0, index),
        updatedMessage,
        ...messages.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Statut mis à jour", {
        description: `Le statut du message a été mis à jour.`,
      });
      
      return updatedMessage;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (id: string): Promise<boolean> => {
    try {
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) return false;

      messages = [
        ...messages.slice(0, index),
        ...messages.slice(index + 1),
      ];

      await mockApiCall(null);
      
      toast.success("Message supprimé", {
        description: "Le message a été supprimé avec succès.",
      });
      
      return true;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
