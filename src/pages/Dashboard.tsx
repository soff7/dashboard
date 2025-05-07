
import React, { useState, useEffect } from 'react';
import { MessageSquare, Package, Users, TrendingUp } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import ChartContainer from '@/components/ChartContainer';

// Données factices pour les statistiques et graphiques
const stats = [
  { id: 1, title: 'Messages', value: '156', icon: <MessageSquare className="text-[#1EAEDB]" />, trend: 12 },
  { id: 2, title: 'Produits', value: '43', icon: <Package className="text-[#1EAEDB]" />, trend: 5 },
  { id: 3, title: 'Administrateurs', value: '8', icon: <Users className="text-[#1EAEDB]" />, trend: 0 },
  { id: 4, title: 'Visites Website', value: '2,451', icon: <TrendingUp className="text-[#1EAEDB]" />, trend: 18 },
];

const monthlyData = [
  { name: 'Jan', messages: 65, produits: 24 },
  { name: 'Fév', messages: 78, produits: 26 },
  { name: 'Mar', messages: 90, produits: 29 },
  { name: 'Avr', messages: 81, produits: 30 },
  { name: 'Mai', messages: 95, produits: 32 },
  { name: 'Jun', messages: 110, produits: 35 },
  { name: 'Jul', messages: 129, produits: 37 },
  { name: 'Aoû', messages: 145, produits: 39 },
  { name: 'Sep', messages: 139, produits: 41 },
  { name: 'Oct', messages: 152, produits: 42 },
  { name: 'Nov', messages: 159, produits: 43 },
  { name: 'Déc', messages: 156, produits: 43 },
];

const productCategories = [
  { name: 'Tubes PVC', value: 18 },
  { name: 'Tubes PE', value: 15 },
  { name: 'Accessoires', value: 10 },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-[#1EAEDB]">Chargement du tableau de bord...</div>
      </div>
    );
  }
  
  return (
    <>
      <PageHeader 
        title="Tableau de bord"
        subtitle="Bienvenue sur le tableau de bord administratif de MTPS"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            index={index}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartContainer title="Activité Mensuelle" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="messages"
                name="Messages"
                stroke="#1EAEDB"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="produits"
                name="Produits"
                stroke="#00C49F"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Répartition des Produits">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={productCategories}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar
                dataKey="value"
                name="Produits"
                fill="#1EAEDB"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="bg-[#111] rounded-lg mt-8 p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-medium text-white mb-4">Activités Récentes</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start p-3 border-b border-[#222]">
              <div className="bg-[#1EAEDB]/10 p-2 rounded-full mr-4">
                <MessageSquare className="h-5 w-5 text-[#1EAEDB]" />
              </div>
              <div>
                <p className="text-white">Nouveau message de contact</p>
                <p className="text-sm text-gray-400">Il y a {item * 2} heures</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
