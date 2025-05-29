import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { SideMenuSection } from './SideMenu';

interface SideMenuContextType {
  sections: SideMenuSection[];
  setSections: (sections: SideMenuSection[]) => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

export const SideMenuProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<SideMenuSection[]>([]);
  return (
    <SideMenuContext.Provider value={{ sections, setSections }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export function useSideMenu() {
  const ctx = useContext(SideMenuContext);
  if (!ctx) throw new Error('useSideMenu must be used within a SideMenuProvider');
  return ctx;
} 