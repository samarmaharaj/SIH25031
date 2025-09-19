
import React from 'react';
import { BuildingOffice2Icon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center h-20">
        <div className="flex items-center space-x-3">
            <BuildingOffice2Icon className="h-8 w-8 text-blue-600"/>
            <h1 className="text-2xl font-bold text-slate-800">CitizenConnect</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
