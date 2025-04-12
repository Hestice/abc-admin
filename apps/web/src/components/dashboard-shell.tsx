'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobile && mobileOpen) {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.getElementById('mobile-toggle');

        if (
          sidebar &&
          !sidebar.contains(e.target as Node) &&
          mobileToggle &&
          !mobileToggle.contains(e.target as Node)
        ) {
          setMobileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobile, mobileOpen]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex h-14 items-center border-b px-4 sticky top-0 bg-background z-20">
        <Button
          variant="ghost"
          size="icon"
          id="mobile-toggle"
          className="mr-2"
          onClick={toggleMobileSidebar}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <span className="font-semibold">Animal Bite Records</span>
      </div>

      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <aside
          id="sidebar"
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 border-r bg-muted/40 transition-transform duration-300 ease-in-out md:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full max-h-screen flex-col gap-2 pt-14">
            <DashboardNav
              collapsed={false}
              onNavItemClick={() => setMobileOpen(false)}
            />
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside
          className={cn(
            'relative border-r bg-muted/40 transition-all duration-300 ease-in-out hidden md:block',
            collapsed ? 'w-16' : 'w-64'
          )}
        >
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <span
                className={cn(
                  'font-semibold transition-opacity duration-300',
                  collapsed ? 'opacity-0' : 'opacity-100'
                )}
              >
                Animal Bite Records
              </span>
            </div>
            <DashboardNav collapsed={collapsed} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
            <span className="sr-only">
              {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </span>
          </Button>
        </aside>

        {/* Overlay for mobile */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 transition-all duration-300 overflow-hidden w-full',
            collapsed ? 'md:ml-16' : 'md:ml-0'
          )}
        >
          <div className="w-full max-w-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
