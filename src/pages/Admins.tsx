
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { Admin, adminService } from '@/services/admin-service';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { format } from 'date-fns';

// Admin form interface
interface AdminFormData {
  name: string;
  email: string;
  role: "super-admin" | "admin" | "editor";
  avatar: string;
  status: "active" | "inactive";
}

const Admins = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150',
    status: 'active',
  });

  // Get admins query
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: adminService.getAdmins,
  });

  // Create admin mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<Admin, "id">) => adminService.createAdmin({
      ...data,
      lastActive: new Date(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la création",
        description: "Impossible de créer l'administrateur.",
        variant: "destructive",
      });
    }
  });

  // Update admin mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admin> }) =>
      adminService.updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setOpenDialog(false);
      setSelectedAdmin(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Impossible de mettre à jour l'administrateur.",
        variant: "destructive",
      });
    }
  });

  // Delete admin mutation
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setSelectedAdmin(null);
      setConfirmDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la suppression",
        description: "Impossible de supprimer l'administrateur.",
        variant: "destructive",
      });
    }
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select field changes
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150',
      status: 'active',
    });
  };

  // Open dialog for creating a new admin
  const handleCreate = () => {
    resetForm();
    setSelectedAdmin(null);
    setOpenDialog(true);
  };

  // Open dialog for editing an admin
  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      status: admin.status,
    });
    setOpenDialog(true);
  };

  // Confirm delete dialog
  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setConfirmDeleteDialog(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (selectedAdmin) {
      updateMutation.mutate({
        id: selectedAdmin.id,
        data: formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
        lastActive: new Date(),
      });
    }
  };

  // Filter admins by search query
  const filteredAdmins = searchQuery
    ? admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : admins;

  // Get role badge class
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-purple-800 text-white px-3 py-1 rounded-full text-xs';
      case 'admin':
        return 'bg-[#1EAEDB] text-white px-3 py-1 rounded-full text-xs';
      case 'editor':
        return 'bg-green-800 text-white px-3 py-1 rounded-full text-xs';
      default:
        return 'bg-[#1EAEDB] text-white px-3 py-1 rounded-full text-xs';
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <PageHeader
        title="Gestion des Administrateurs"
        subtitle="Consultez et gérez tous les administrateurs de la plateforme"
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un administrateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#111] border-[#333] text-white"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white whitespace-nowrap"
        >
          <Plus size={16} className="mr-1" /> Nouvel Administrateur
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse text-[#1EAEDB]">Chargement...</div>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-[#111] rounded-lg">
          Aucun administrateur trouvé
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#333] text-left">
              <th className="px-4 py-3 text-gray-400 font-normal">Nom</th>
              <th className="px-4 py-3 text-gray-400 font-normal">Email</th>
              <th className="px-4 py-3 text-gray-400 font-normal">Rôle</th>
              <th className="px-4 py-3 text-gray-400 font-normal">Dernière activité</th>
              <th className="px-4 py-3 text-gray-400 font-normal">Statut</th>
              <th className="px-4 py-3 text-gray-400 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {filteredAdmins.map((admin) => (
              <tr 
                key={admin.id}
                className="hover:bg-[#111] "
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={admin.avatar} alt={admin.name} />
                      <AvatarFallback className="bg-[#1EAEDB]/20 text-[#1EAEDB]">
                        {getInitials(admin.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{admin.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{admin.email}</td>
                <td className="px-4 py-3">
                  <span className={getRoleBadgeClass(admin.role)}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(admin.lastActive), 'dd/MM/yyyy')}
                </td>
                <td className="px-4 py-3">
                  {admin.status === 'active' ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle size={14} />
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <XCircle size={14} />
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(admin)}
                    className="text-[#1EAEDB]"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(admin)}
                    className="text-[#1EAEDB]"
                    disabled={admin.role === 'super-admin'}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Admin Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#111] border border-[#333] text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAdmin ? "Modifier l'administrateur" : "Ajouter un nouvel administrateur"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                  disabled={selectedAdmin?.role === 'super-admin'}
                >
                  <SelectTrigger className="mt-1 bg-[#222] border-[#333]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border border-[#333] text-white">
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled={selectedAdmin?.role === 'super-admin'}
                >
                  <SelectTrigger className="mt-1 bg-[#222] border-[#333]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border border-[#333] text-white">
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="avatar">URL de l'avatar</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="border-[#333]"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedAdmin ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog}
        onOpenChange={setConfirmDeleteDialog}
        title="Supprimer l'administrateur"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedAdmin?.name} ? Cette action est irréversible.`}
        onConfirm={() => selectedAdmin && deleteMutation.mutate(selectedAdmin.id)}
      />
    </>
  );
};

export default Admins;
