
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Package, Users, LogOut, Settings } from 'lucide-react';
import Logo from './Logo';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
    { 
      name: 'Produits', 
      path: '/products', 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      name: 'Administrateurs', 
      path: '/admins', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Paramètres', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="bg-mtps-darker border-r border-mtps-dark h-screen w-64 fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-mtps-dark">
        <Logo />
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`mtps-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-mtps-dark">
        <Link to="/login" className="mtps-sidebar-item text-gray-400 hover:text-red-400">
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
