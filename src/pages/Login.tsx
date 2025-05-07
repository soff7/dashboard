
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Lock, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionButton } from '@/components/ui/action-button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une connexion
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        toast.success('Connexion réussie', {
          description: 'Bienvenue dans le tableau de bord MTPS',
        });
        navigate('/dashboard');
      } else {
        toast.error('Erreur de connexion', {
          description: 'Identifiants incorrects. Essayez admin/admin',
        });
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="min-h-screen bg-mtps-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,174,219,0.15),transparent_50%)]"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-mtps-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-mtps-blue/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        className="relative z-10 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
      >
        <motion.div 
          className="flex flex-col items-center mb-8"
          variants={itemAnimation}
        >
          <div className="relative">
            <div className="animate-pulse-glow absolute inset-0 bg-mtps-blue/20 rounded-full blur-xl"></div>
            <div className="text-4xl font-bold text-mtps-blue mb-2 relative">mtps</div>
          </div>
          <h1 className="text-2xl font-medium text-white">Administration</h1>
          <p className="text-gray-400 mt-2">Manufacture de Tubes Plastiques et Services</p>
        </motion.div>
        
        <motion.div 
          className="bg-mtps-darker border border-mtps-dark rounded-lg shadow-2xl p-8 backdrop-blur-sm"
          variants={itemAnimation}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemAnimation} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mtps-blue" size={18} />
                <input
                  id="username"
                  type="text"
                  className="w-full bg-mtps-dark border border-gray-800 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-mtps-blue"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mtps-blue" size={18} />
                <input
                  id="password"
                  type="password"
                  className="w-full bg-mtps-dark border border-gray-800 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-mtps-blue"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <ActionButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                icon={<LogIn size={18} />}
              >
                Se connecter
              </ActionButton>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-4 text-center text-gray-500 text-sm"
            variants={itemAnimation}
          >
            Utilisez admin/admin pour vous connecter
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-8 text-sm text-gray-500"
          variants={itemAnimation}
        >
          &copy; 2023 MTPS - Tous droits réservés
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
