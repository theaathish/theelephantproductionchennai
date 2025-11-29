'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';
import { 
  Home, 
  Info, 
  Briefcase, 
  BookOpen, 
  Mail, 
  MapPin, 
  LogOut,
  Settings,
  Inbox
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const menuItems = [
    { icon: Home, label: 'Home Page', href: '/admin/dashboard/home' },
    { icon: Info, label: 'About Page', href: '/admin/dashboard/about' },
    { icon: Briefcase, label: 'Services', href: '/admin/dashboard/services' },
    { icon: BookOpen, label: 'Stories', href: '/admin/dashboard/stories' },
    { icon: MapPin, label: 'Destination', href: '/admin/dashboard/destination' },
    { icon: Mail, label: 'Contact', href: '/admin/dashboard/contact' },
    { icon: Inbox, label: 'Inquiries', href: '/admin/dashboard/inquiries' },
    { icon: Settings, label: 'Site Settings', href: '/admin/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2c2420] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-serif">THE ELEPHANT</h1>
          <p className="text-xs text-white/60 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/10 transition-colors mb-1 text-sm"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/10 transition-colors w-full text-sm text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
