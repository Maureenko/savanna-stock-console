'use client';

import { LogOut, Menu, Shield, User } from 'lucide-react';

import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Topbar({ onMenuClick, isSidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-savannah-purple/30 bg-savannah-purple/90 px-4 text-white backdrop-blur-sm lg:px-6">
      {/* Left side - Menu button and branding */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-savannah-purple-light lg:hidden"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-white hover:bg-savannah-purple-light lg:flex"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-savannah-lime">
            <Shield className="h-4 w-4 text-savannah-purple" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-none">SAVANNAH</h1>
            <p className="text-[10px] text-white/80">Informatics</p>
          </div>
        </div>

        {/* Page title - visible on larger screens */}
        <div className="ml-4 hidden border-l border-white/20 pl-4 md:block">
          <span className="text-sm font-medium text-white/90">Clinic Stock Console</span>
        </div>
      </div>

      {/* Right side - Account info */}
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-savannah-purple-light">
                <User className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label="Sign out"
              className="text-white/80 hover:bg-savannah-purple-light hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
