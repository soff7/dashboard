
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, User, ShieldCheck, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Plomberie Pro",
    email: "contact@plomberiepro.fr",
    phone: "01 23 45 67 89",
    address: "123 Rue des Artisans, 75001 Paris",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newMessages: true,
    updates: false,
    marketing: false,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSecurityChange = (name: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Paramètres enregistrés",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="Paramètres"
        subtitle="Gérez les paramètres de votre application"
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md bg-[#111]">
          <TabsTrigger 
            value="general" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
          >
            <SettingsIcon size={16} />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
          >
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black"
          >
            <ShieldCheck size={16} />
            <span>Sécurité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="border-[#333] bg-[#111]">
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Configurez les informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input 
                  id="companyName" 
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                  className="bg-[#222] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  value={generalSettings.email}
                  onChange={handleGeneralChange}
                  className="bg-[#222] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={generalSettings.phone}
                  onChange={handleGeneralChange}
                  className="bg-[#222] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  className="bg-[#222] border-[#333] text-white"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading} className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white">
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border-[#333] bg-[#111]">
            <CardHeader>
              <CardTitle>Paramètres des notifications</CardTitle>
              <CardDescription>Configurez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                  <span>Notifications par email</span>
                  <span className="font-normal text-sm text-gray-400">Recevoir toutes les notifications par email</span>
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  className="data-[state=checked]:bg-[#1EAEDB]"
                />
              </div>
              <Separator className="bg-[#333]" />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="newMessages" className="flex flex-col space-y-1">
                  <span>Nouveaux messages</span>
                  <span className="font-normal text-sm text-gray-400">Notifications pour les nouveaux messages</span>
                </Label>
                <Switch
                  id="newMessages"
                  checked={notificationSettings.newMessages}
                  onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
                  className="data-[state=checked]:bg-[#1EAEDB]"
                />
              </div>
              <Separator className="bg-[#333]" />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="updates" className="flex flex-col space-y-1">
                  <span>Mises à jour du système</span>
                  <span className="font-normal text-sm text-gray-400">Notifications pour les mises à jour disponibles</span>
                </Label>
                <Switch
                  id="updates"
                  checked={notificationSettings.updates}
                  onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                  className="data-[state=checked]:bg-[#1EAEDB]"
                />
              </div>
              <Separator className="bg-[#333]" />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Communications marketing</span>
                  <span className="font-normal text-sm text-gray-400">Newsletters et offres promotionnelles</span>
                </Label>
                <Switch
                  id="marketing"
                  checked={notificationSettings.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  className="data-[state=checked]:bg-[#1EAEDB]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading} className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white">
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="border-[#333] bg-[#111]">
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>Gérez les options de sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="twoFactorAuth" className="flex flex-col space-y-1">
                  <span>Authentification à deux facteurs</span>
                  <span className="font-normal text-sm text-gray-400">Ajoute une couche de sécurité supplémentaire</span>
                </Label>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  className="data-[state=checked]:bg-[#1EAEDB]"
                />
              </div>
              <Separator className="bg-[#333]" />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="flex flex-col space-y-1">
                  <span>Délai d'expiration de la session (minutes)</span>
                  <span className="font-normal text-sm text-gray-400">Durée d'inactivité avant déconnexion automatique</span>
                </Label>
                <Input 
                  id="sessionTimeout" 
                  name="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                  className="bg-[#222] border-[#333] text-white max-w-[200px]"
                />
              </div>
              <Separator className="bg-[#333]" />
              <div className="space-y-2">
                <Label className="flex flex-col space-y-1">
                  <span>Changer le mot de passe</span>
                </Label>
                <Button variant="outline" className="flex gap-2 border-[#333] text-white hover:bg-[#222] hover:text-white">
                  <Lock size={16} />
                  <span>Modifier le mot de passe</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading} className="bg-[#1EAEDB] hover:bg-[#1a9bc3] text-white">
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsPage;
