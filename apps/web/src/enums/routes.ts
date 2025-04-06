export enum AppRoutes {
  // Public routes
  HOME = '/',
  LOGIN = '/login',
  
  // Protected routes
  DASHBOARD = '/dashboard',
  DASHBOARD_PATIENTS = '/dashboard/patients',
  DASHBOARD_APPOINTMENTS = '/dashboard/appointments',
  DASHBOARD_USERS = '/dashboard/users',
  DASHBOARD_SETTINGS = '/dashboard/settings',
  DASHBOARD_PROFILE = '/dashboard/profile',
}
export function isProtectedRoute(route: string): boolean {
  return route.startsWith(AppRoutes.DASHBOARD);
}

export function getDashboardRoutes(): string[] {
  return Object.values(AppRoutes).filter(route => 
    typeof route === 'string' && route.startsWith(AppRoutes.DASHBOARD)
  );
} 