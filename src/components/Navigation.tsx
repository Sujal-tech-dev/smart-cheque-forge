import { NavLink } from './NavLink';
import { Home, Plus, History, Layout, Settings } from 'lucide-react';

export const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/new-cheque', icon: Plus, label: 'New Cheque' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/layouts', icon: Layout, label: 'Layouts' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              activeClassName="text-primary bg-primary/10 hover:bg-primary/15"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
