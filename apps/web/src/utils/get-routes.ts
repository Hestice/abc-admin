import { AppRoutes } from '../constants/routes';

const PROTECTED_ROUTES = [
    AppRoutes.DASHBOARD,
    AppRoutes.PATIENTS,
    AppRoutes.USERS,
    AppRoutes.SETTINGS,
    AppRoutes.REGISTER
  ];

export function isProtectedRoute(route: string): boolean {
    return PROTECTED_ROUTES.includes(route);
}
  