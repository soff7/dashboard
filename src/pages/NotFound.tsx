
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-mtps-dark flex flex-col items-center justify-center text-white p-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,174,219,0.15),transparent_50%)]"></div>
      </div>
      
      <div className="text-center z-10 animate-fade-in">
        <div className="text-8xl font-bold text-mtps-blue mb-6">404</div>
        <h1 className="text-3xl font-medium mb-4">Page non trouvée</h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Link to="/dashboard" className="mtps-button inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
