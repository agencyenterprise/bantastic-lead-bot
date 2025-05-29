import React from 'react';
import Link from 'next/link';

export interface SideMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: SideMenuItem[];
}

export interface SideMenuSection {
  label: string;
  items: SideMenuItem[];
}

export interface SideMenuProps {
  sections: SideMenuSection[];
}

const SideMenu: React.FC<SideMenuProps> = ({ sections }) => {
  return (
    <nav className="w-64 min-h-screen bg-neutral-900 border-r border-gray-800 p-4 flex flex-col gap-6 fixed top-0 left-0 h-screen z-40">
      {sections.map((section, idx) => (
        <div key={section.label + idx}>
          <div className="text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">
            {section.label}
          </div>
          <ul className="space-y-1">
            {section.items.map((item, i) => (
              <SideMenuListItem key={item.label + i} item={item} depth={0} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const SideMenuListItem: React.FC<{ item: SideMenuItem; depth: number }> = ({ item, depth }) => {
  const hasChildren = item.children && item.children.length > 0;
  return (
    <li>
      <div className={`flex items-center ${depth > 0 ? 'pl-4' : ''}`}>
        {item.href ? (
          <Link
            href={item.href}
            className="block w-full py-2 px-3 rounded hover:bg-indigo-700/30 text-gray-200 hover:text-indigo-300 transition-colors"
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </Link>
        ) : (
          <span className="block w-full py-2 px-3 rounded text-gray-300">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </span>
        )}
      </div>
      {hasChildren && (
        <ul className="ml-2 border-l border-gray-700 pl-2 mt-1">
          {item.children!.map((child, idx) => (
            <SideMenuListItem key={child.label + idx} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SideMenu; 