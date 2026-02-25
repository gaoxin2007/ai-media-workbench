import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Video, Menu } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'IP 定位中心', path: '/', icon: LayoutDashboard },
    { name: '对标账号库', path: '/benchmark', icon: Users },
    { name: '文案改写工厂', path: '/script', icon: FileText },
    { name: '数字人生成', path: '/avatar', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Video className="w-6 h-6" />
            AI 自媒体工作台
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
