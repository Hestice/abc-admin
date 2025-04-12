import { AppRoutes } from '../constants/routes';

const PROTECTED_ROUTES = [
  AppRoutes.DASHBOARD,
  AppRoutes.PATIENTS,
  AppRoutes.REGISTER,
  AppRoutes.ADMINS,
];

export function isProtectedRoute(route: string): boolean {
  return PROTECTED_ROUTES.some(
    (protectedRoute) =>
      route === protectedRoute || route.startsWith(`${protectedRoute}/`)
  );
}
