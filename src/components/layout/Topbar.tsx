'use client';

import { LogOut, Menu } from 'lucide-react';
import Image from 'next/image';

import { useAuth } from '@/components/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function Topbar({ onMenuClick, isSidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-savannah-purple/30 bg-gradient-to-r from-white to-savannah-purple-light px-3 text-white backdrop-blur-sm sm:h-16 sm:px-4 lg:px-6">
      {/* Left side - Logo and menu (desktop) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Logo - large */}
        <div className="relative h-10 w-48 overflow-hidden sm:h-12 sm:w-56">
          <Image
            src="/logo.png"
            alt="StockCare Logo"
            fill
            className="object-contain object-left"
            sizes="224px"
            priority
          />
        </div>

        {/* Menu button - desktop only (left side) */}
        <button
          className="ml-2 hidden h-8 w-8 text-savannah-purple hover:text-savannah-purple/70 sm:h-9 sm:w-9 lg:block"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Right side - Menu (mobile/tablet) and Account info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Menu button - mobile/tablet only (right side) */}
        <button
          className="flex h-8 w-8 items-center justify-center text-savannah-purple hover:text-savannah-purple/70 sm:h-9 sm:w-9 lg:hidden"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:gap-3 sm:p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-savannah-purple text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-medium leading-none text-white sm:text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[0.625rem] text-white/70 sm:text-xs">{user.email}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
