
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { Message, messageService } from '@/services/message-service';
import { format } from 'date-fns';
import { MessageSquare, Search, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MessageFormData {
  sender: string;
  email: string;
  subject: string;
  content: string;
  priority: "high" | "medium" | "low";
}

const Messages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [formData, setFormData] = useState<MessageFormData>({
    sender: '',
    email: '',
    subject: '',
    content: '',
    priority: 'medium',
  });

  // Get messages query
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getMessages,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: messageService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setSelectedMessage(null);
      setConfirmDeleteDialog(false);
      setDetailsOpen(false);
    }
  });

  // Create message mutation
  const createMutation = useMutation({
    mutationFn: messageService.createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setComposeOpen(false);
      resetForm();
    }
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      sender: '',
      email: '',
      subject: '',
      content: '',
      priority: 'medium',
    });
  };

  // View message details
  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setDetailsOpen(true);
    
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Delete message
  const handleDeleteClick = (message: Message) => {
    setSelectedMessage(message);
    setConfirmDeleteDialog(true);
  };

  // New message
  const handleNewMessage = () => {
    resetForm();
    setComposeOpen(true);
  };

  // Submit new message form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sender || !formData.email || !formData.subject || !formData.content) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter messages by search query
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      !filter ||
      (filter === "unread" && !message.isRead) ||
      (filter === "high" && message.priority === "high") ||
      (filter === "medium" && message.priority === "medium") ||
      (filter === "low" && message.priority === "low");

    return matchesSearch && matchesFilter;
  });

  // Get priority badge class
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-700 text-white text-xs px-2 py-1 rounded';
      case 'medium':
        return 'bg-yellow-700 text-white text-xs px-2 py-1 rounded';
      case 'low':
        return 'bg-green-700 text-white text-xs px-2 py-1 rounded';
      default:
        return 'bg-blue-700 text-white text-xs px-2 py-1 rounded';
    }
  };

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Consultez et gérez les messages reçus"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Message list */}
        <div className="w-full lg:w-1/3">
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#111] border-[#333] text-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={filter === null ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilter(null)}
                className={filter === null ? "bg-[#1EAEDB] text-white" : "border-[#333] text-gray-300"}
              >
                Tous
              </Button>
              <Button 
                variant={filter === "unread" ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilter("unread")}
                className={filter === "unread" ? "bg-[#1EAEDB] text-white" : "border-[#333] text-gray-300"}
              >
                Non lus
              </Button>
              <Button 
                variant={filter === "high" ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilter("high")}
                className={filter === "high" ? "bg-[#1EAEDB] text-white" : "border-[#333] text-gray-300"}
              >
                Priorité haute
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-400">{filteredMessages.length} message(s)</div>
              <Button 
                onClick={handleNewMessage}
                size="sm"
                className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white"
              >
                <Plus size={16} className="mr-1" /> Nouveau
              </Button>
            </div>
          </div>

          <div className="bg-[#111] rounded-lg overflow-y-auto max-h-[calc(100vh-300px)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-[#1EAEDB]">Chargement...</div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Aucun message trouvé
              </div>
            ) : (
              <div className="divide-y divide-[#222]">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-[#222] ${
                      selectedMessage?.id === message.id ? 'bg-[#222]' : ''
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold flex items-center gap-2">
                        {!message.isRead && (
                          <div className="h-2 w-2 rounded-full bg-[#1EAEDB]"></div>
                        )}
                        <span className="text-white">
                          {message.sender}
                        </span>
                      </div>
                      <span className={getPriorityBadgeStyle(message.priority)}>
                        {message.priority}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1 text-gray-300">
                      {message.subject}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                      {message.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.createdAt), 'dd/MM/yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(message);
                        }}
                      >
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right content - Message details or empty state */}
        <div className="w-full lg:w-2/3">
          {detailsOpen && selectedMessage ? (
            <div className="bg-[#111] rounded-lg p-6 h-full">
              <h2 className="text-2xl font-semibold mb-4">{selectedMessage.subject}</h2>
              <p className="text-gray-400 mb-2">De: {selectedMessage.sender} ({selectedMessage.email})</p>
              <p className="text-gray-400 mb-4">Date: {format(new Date(selectedMessage.createdAt), 'dd/MM/yyyy')}</p>
              <div className="bg-[#0a0a0a] p-4 rounded-lg text-white">
                {selectedMessage.content}
              </div>
            </div>
          ) : (
            <div className="bg-[#111] rounded-lg flex flex-col items-center justify-center text-center h-[400px]">
              <MessageSquare size={48} className="text-[#1EAEDB]/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sélectionnez un message</h3>
              <p className="text-gray-400 max-w-md mb-4">
                Sélectionnez un message dans la liste pour afficher son contenu ou créez un nouveau message.
              </p>
              <Button 
                onClick={handleNewMessage}
                className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white"
              >
                <Plus size={16} className="mr-2" />
                Nouveau message
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog}
        onOpenChange={setConfirmDeleteDialog}
        title="Supprimer le message"
        description="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        onConfirm={() => selectedMessage && deleteMutation.mutate(selectedMessage.id)}
      />

      {/* New Message Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="bg-[#111] border border-[#333] text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau message</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sender">Expéditeur</Label>
              <Input
                id="sender"
                name="sender"
                placeholder="Nom de l'expéditeur"
                value={formData.sender}
                onChange={handleChange}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemple.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Sujet du message"
                value={formData.subject}
                onChange={handleChange}
                className="bg-[#222] border-[#333] text-white"
              />
            </div>
            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Contenu du message"
                value={formData.content}
                onChange={handleChange}
                className="bg-[#222] border-[#333] text-white min-h-[150px]"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="bg-[#222] border-[#333] text-white">
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] text-white">
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setComposeOpen(false)}
                className="border-[#333]"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white">
                Envoyer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Messages;
