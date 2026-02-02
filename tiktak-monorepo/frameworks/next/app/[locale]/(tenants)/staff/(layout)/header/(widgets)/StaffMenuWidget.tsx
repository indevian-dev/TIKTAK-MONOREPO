"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import Link
  from 'next/link';
import { useRouter }
  from 'next/navigation';
import {
  PiTagSimple,
  PiNotebook,
  PiUsers,
  PiSignOut,
  PiPlugs,
  PiPackage,
  PiBook,
  PiKey,
  PiFile,
  PiArticle,
  PiAcorn,
  PiStorefront,
  PiEnvelope,
  PiUsersFill,
  PiGrainsFill,
  PiStorefrontFill,
  PiTextT,
  PiHouse
} from 'react-icons/pi';

interface MenuItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
}

interface SubMenuItemProps {
  href: string;
  label: string;
  disabled?: boolean;
}

interface BaseMenuItem {
  href: string;
  label: string;
  permission?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: BaseMenuItem[];
}

interface StaffMenuWidgetProps {
  isMenuOpen: boolean;
  setIsMenuOpen?: (value: boolean) => void;
  authData?: {
    permissions?: string[];
  };
}

export function StaffMenuWidget({ isMenuOpen, authData }: StaffMenuWidgetProps) {
  const router = useRouter();
  
  // Menu configuration with required permissions
  const menuGroups: Record<string, MenuGroup> = {
    content: {
      label: 'Platform',
      items: [
        { 
          href: '/staff', 
          icon: PiHouse, 
          label: 'Provider',
          permission: 'CONSOLE_ACCESS'
        },
        { 
          href: '/staff/adds', 
          icon: PiNotebook, 
          label: 'Adds',
          permission: 'CONSOLE_ADDS_READ'
        },
        { 
          href: '/staff/blogs', 
          icon: PiArticle, 
          label: 'Blogs',
          permission: 'CONSOLE_BLOGS_READ'
        },
      ]
    },
    management: {
      label: 'Management',
      icon: PiPlugs,
      items: [
        { 
          href: '/staff/leads', 
          icon: PiUsers, 
          label: 'Leads',
          permission: 'CONSOLE_LEADS_READ'
        },
        { 
          href: '/staff/support', 
          icon: PiUsers, 
          label: 'Support',
          permission: 'CONSOLE_SUPPORT_READ'
        },
      ]
    },
    catalog: {
      label: 'Catalog',
      icon: PiPackage,
      items: [
        { 
          href: '/staff/categories', 
          icon: PiTagSimple, 
          label: 'Categories',
          permission: 'CONSOLE_CATEGORY_READ'
        },
        { 
          href: '/staff/cards', 
          icon: PiPackage, 
          label: 'Cards',
          permission: 'CONSOLE_CARD_READ'
        },
        { 
          href: '/staff/open-search', 
          icon: PiAcorn, 
          label: 'Search Service',
          permission: 'CONSOLE_OPENSEARCH_READ'
        },
        { 
          href: '/staff/mail', 
          icon: PiEnvelope, 
          label: 'Mail Service',
          permission: 'CONSOLE_MAIL_READ'
        },
      ]
    },
    access_management: {
      label: 'Access Management',
      icon: PiKey,
      items: [
        { 
          href: '/staff/stores', 
          icon: PiStorefront, 
          label: 'Stores',
          permission: 'CONSOLE_STORE_READ'
        },
        { 
          href: '/staff/stores/applications', 
          icon: PiStorefrontFill, 
          label: 'Store Applications',
          permission: 'CONSOLE_STORE_APPLICATION_READ'
        },
      ]
    },
    users: {
      label: 'Users',
      icon: PiUsersFill,
      items: [
        { 
          href: '/staff/roles', 
          icon: PiGrainsFill, 
          label: 'Roles',
          permission: 'CONSOLE_ROLE_READ'
        },
        { 
          href: '/staff/users', 
          icon: PiUsersFill, 
          label: 'Users',
          permission: 'CONSOLE_USER_READ'
        },
      ]
    },
    docs: {
      label: 'Pages',
      icon: PiBook,
      items: [
        { 
          href: '/staff/pages/faq', 
          icon: PiFile, 
          label: 'Faq',
          permission: 'CONSOLE_DOCS_UPDATE'
        },
        { 
          href: '/staff/pages/terms', 
          icon: PiFile, 
          label: 'Terms',
          permission: 'CONSOLE_DOCS_UPDATE'
        },
        { 
          href: '/staff/pages/privacy', 
          icon: PiFile, 
          label: 'Privacy',
          permission: 'CONSOLE_DOCS_UPDATE'
        },
        { 
          href: '/staff/pages/about', 
          icon: PiFile, 
          label: 'About',
          permission: 'CONSOLE_DOCS_UPDATE'
        },
        { 
          href: '/staff/pages/rules', 
          icon: PiFile, 
          label: 'Rules',
          permission: 'CONSOLE_DOCS_UPDATE'
        },
      ]
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      ConsoleLogger.error('Logout failed:', error);
    }
  }

  // Check if user has permission for a menu item
  const hasPermission = (requiredPermission?: string) => {
    if (!requiredPermission) return true; // No permission required
    return authData?.permissions?.includes(requiredPermission) || false;
  };

  const MenuItem = ({ href, icon: Icon, label, disabled }: MenuItemProps) => (
    <li className="text-left w-full p-2">
      {disabled ? (
        <span className="text-lg flex items-center rounded-md text-dark/30 cursor-not-allowed">
          <Icon className="mr-2 text-semidark/30" />
          {label}
        </span>
      ) : (
        <Link
          href={href}
          className="text-lg flex items-center rounded-md text-dark hover:text-brandPrimary"
          tabIndex={0}
        >
          <Icon className="mr-2 text-semidark" />
          {label}
        </Link>
      )}
    </li>
  );

  const SubMenuItem = ({ href, label, disabled }: SubMenuItemProps) => (
    <li className="text-left w-full py-2">
      {disabled ? (
        <span className="text-lg flex items-center rounded-md text-dark/30 cursor-not-allowed">
          <PiTextT className="mr-2 text-semidark/30" />
          {label}
        </span>
      ) : (
        <Link
          href={href}
          className="text-lg flex items-center rounded-md text-dark hover:text-brandPrimary"
          tabIndex={0}
        >
          <PiTextT className="mr-2 text-semidark" />
          {label}
        </Link>
      )}
    </li>
  );

  return (
    <div className={`absolute md:static top-0 left-0 right-0 w-full ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-1/2 md:translate-x-0 opacity-0 md:opacity-100'} transition-all duration-500 bg-white px-4 md:p-0 md:bg-transparent`} >
      <ul className="flex-col justify-center items-center">
        {Object.entries(menuGroups).map(([key, group]: [string, MenuGroup]) => (
          <li key={key} className="text-left w-full mb-4 bg-brandPrimaryLightBg/50 p-2 rounded">
            <button className="w-full text-xs flex items-center font-bold text-dark/40">
              {group.label}
            </button>
            <ul className='py-2'>
              {group.items.map((item: BaseMenuItem, index: number) => {
                const disabled = !hasPermission(item.permission);
                return item.icon ?
                  <MenuItem key={index} href={item.href} icon={item.icon} label={item.label} disabled={disabled} /> :
                  <SubMenuItem key={index} href={item.href} label={item.label} disabled={disabled} />;
              })}
            </ul>
          </li>
        ))}

        <li className="text-left w-full mb-4">
          <button onClick={() => {
            signOut();
          }} className="text-md flex items-center p-2 bg-danger text-dark rounded-md hover:text-brandPrimary">
            <PiSignOut className="mr-2 text-semidark" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
