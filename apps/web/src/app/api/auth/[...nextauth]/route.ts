import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthApi, Configuration } from '@abc-admin/api-lib';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

interface ExtendedUser extends User {
  role?: string;
  accessToken?: string;
}

interface ExtendedJWT extends JWT {
  role?: string;
  accessToken?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const config = new Configuration({
            basePath: backendUrl,
            baseOptions: { withCredentials: true },
          });

          const authApi = new AuthApi(config);

          const response = await authApi.authControllerLogin({
            data: {
              email: credentials.email,
              password: credentials.password,
            },
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.data.user) {
            return null;
          }

          // Get token
          const tokenResponse = await authApi.authControllerGetToken({
            data: {
              email: credentials.email,
              password: credentials.password,
            },
            headers: { 'Content-Type': 'application/json' },
          });

          const user = response.data.user;
          const tokenData = tokenResponse.data as any;
          const token = tokenData.access_token;

          // Ensure we return a valid User object
          return {
            id: String(user.id || ''),
            email: user.email || '',
            // User may not have name or image properties, provide defaults
            name: '', // Default empty string
            image: '', // Default empty string
            role: user.role || '',
            accessToken: token,
          } as ExtendedUser;
        } catch (error) {
          console.error('Authorization failed:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as ExtendedUser).role;
        token.accessToken = (user as ExtendedUser).accessToken;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      if (token) {
        const extendedToken = token as ExtendedJWT;
        const extendedSession = session as ExtendedSession;

        // Create a new user object with all properties
        extendedSession.user = {
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
          id: token.sub || '',
          role: extendedToken.role || '',
        };

        extendedSession.accessToken = extendedToken.accessToken;
        return extendedSession;
      }
      return session as ExtendedSession;
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page if needed
  },
});

export { handler as GET, handler as POST };
