import React from 'react';
import { Search } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { ProjectSelector } from './ProjectSelector';

export function Header() {
  return (
    <header className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TQ</span>
              </div>
              <span className="font-bold text-lg text-white">TracelQ</span>
            </div>
            <ProjectSelector />
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search errors..."
                className="bg-[#2A2A2A] rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
              />
            </div>
          </div>
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}