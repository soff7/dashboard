
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 animate-slide-up">
      <h1 className="text-3xl font-bold text-white mtps-heading">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-4">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
