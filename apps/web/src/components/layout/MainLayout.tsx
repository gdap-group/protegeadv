import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Sheet, SheetContent } from '../ui/sheet';

export function MainLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
      {/* Sidebar Desktop (Oculta em telas menores que 768px) */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Gaveta Mobile (Sheet lateral abaixo de 768px) */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-xs border-r border-[var(--color-border)]">
          <Sidebar
            isMobileDrawer
            onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

