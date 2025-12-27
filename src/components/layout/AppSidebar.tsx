import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Users,
  ClipboardList,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wrench, label: 'Equipment', path: '/equipment' },
  { icon: Users, label: 'Teams', path: '/teams' },
  { icon: ClipboardList, label: 'Requests', path: '/requests' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-screen border-r-2 border-border bg-sidebar flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b-2 border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <Wrench className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-lg tracking-tight">GearGuard</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-foreground flex items-center justify-center mx-auto">
            <Wrench className="w-5 h-5 text-background" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 font-medium transition-all border-2',
                isActive
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'border-transparent hover:bg-accent hover:border-border'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t-2 border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>

      {/* Settings */}
      <div className="p-2 border-t-2 border-border">
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 font-medium transition-all border-2 border-transparent hover:bg-accent hover:border-border',
            location.pathname === '/settings' &&
              'bg-foreground text-background border-foreground'
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
