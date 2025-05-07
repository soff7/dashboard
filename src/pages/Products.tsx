
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { Product, productService } from '@/services/product-service';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

// Product form interface
interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: "disponible" | "rupture" | "arrivage";
  imageUrl: string;
}

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"liste" | "grille">("liste");
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    status: 'disponible',
    imageUrl: 'https://placehold.co/200x150',
  });

  // Get products query
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpenDialog(false);
      resetForm();
    }
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpenDialog(false);
      setSelectedProduct(null);
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedProduct(null);
      setConfirmDeleteDialog(false);
    }
  });

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'disponible',
      imageUrl: 'https://placehold.co/200x150',
    });
  };

  // Open dialog for creating a new product
  const handleCreate = () => {
    resetForm();
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  // Open dialog for editing a product
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      imageUrl: product.imageUrl,
    });
    setOpenDialog(true);
  };

  // Confirm delete dialog
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setConfirmDeleteDialog(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (selectedProduct) {
      updateMutation.mutate({
        id: selectedProduct.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Get status badge class
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-800 text-white px-3 py-1 rounded-full text-xs';
      case 'rupture':
        return 'bg-red-700 text-white px-3 py-1 rounded-full text-xs';
      case 'arrivage':
        return 'bg-yellow-700 text-white px-3 py-1 rounded-full text-xs';
      default:
        return 'bg-blue-700 text-white px-3 py-1 rounded-full text-xs';
    }
  };

  return (
    <>
      <PageHeader
        title="Gestion des Produits"
        subtitle="Consultez et gérez tous les produits de l'entreprise"
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#111] border-[#333] text-white"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white whitespace-nowrap"
        >
          <Plus size={16} className="mr-1" /> Nouveau Produit
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Button 
          variant={viewMode === "liste" ? "default" : "outline"} 
          onClick={() => setViewMode("liste")}
          className={viewMode === "liste" 
            ? "bg-white text-black" 
            : "border-[#333] bg-transparent text-gray-300"}
        >
          Liste
        </Button>
        <Button 
          variant={viewMode === "grille" ? "default" : "outline"} 
          onClick={() => setViewMode("grille")}
          className={viewMode === "grille" 
            ? "bg-white text-black" 
            : "border-[#333] bg-transparent text-gray-300"}
        >
          Grille
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse text-[#1EAEDB]">Chargement...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-[#111] rounded-lg">
          Aucun produit trouvé
        </div>
      ) : viewMode === "liste" ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-[#333]">
                <th className="px-4 py-3 text-gray-400 font-normal">Nom du produit</th>
                <th className="px-4 py-3 text-gray-400 font-normal">Catégorie</th>
                <th className="px-4 py-3 text-gray-400 font-normal">Prix</th>
                <th className="px-4 py-3 text-gray-400 font-normal">Stock</th>
                <th className="px-4 py-3 text-gray-400 font-normal">Statut</th>
                <th className="px-4 py-3 text-gray-400 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#333] hover:bg-[#111]">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.price.toFixed(2)} €</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadgeStyle(product.status)}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="text-[#1EAEDB]"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className="text-[#1EAEDB]"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[#111] rounded-lg p-4 hover:bg-[#1a1a1a] transition-colors">
              <div className="relative h-40 mb-4 overflow-hidden rounded-md bg-[#0a0a0a]">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={getStatusBadgeStyle(product.status)}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{product.category}</p>
              <p className="text-sm mb-4 line-clamp-2 text-gray-300">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1EAEDB]">{product.price.toFixed(2)} €</span>
                <span className="text-sm text-gray-400">Stock: {product.stock}</span>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-[#222]">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="text-[#1EAEDB] border-[#333]"
                >
                  <Edit size={14} className="mr-1" /> Modifier
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteClick(product)}
                  className="text-red-400"
                >
                  <Trash2 size={14} className="mr-1" /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#111] border border-[#333] text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom du produit"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Catégorie"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="mt-1 bg-[#222] border-[#333]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border border-[#333] text-white">
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="rupture">Rupture</SelectItem>
                    <SelectItem value="arrivage">Arrivage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Description du produit"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 bg-[#222] border-[#333]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                  value={formData.imageUrl}
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
              >
                {selectedProduct ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog}
        onOpenChange={setConfirmDeleteDialog}
        title="Supprimer le produit"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedProduct?.name} ? Cette action est irréversible.`}
        onConfirm={() => selectedProduct && deleteMutation.mutate(selectedProduct.id)}
      />
    </>
  );
};

export default Products;
