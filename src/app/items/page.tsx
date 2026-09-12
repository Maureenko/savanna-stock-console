'use client';

import { useAuth, ProtectedRoute } from '@/components/auth';
import { Button } from '@/components/ui/button';

export default function ItemsPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Console</h1>
            {user && (
              <p className="text-muted-foreground">
                Welcome, {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </header>

        <main>
          <p className="text-muted-foreground">Stock list will be implemented here...</p>
        </main>
      </div>
    </ProtectedRoute>
  );
}
