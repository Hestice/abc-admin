import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthApi, Configuration } from '@abc-admin/api-lib';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

interface ExtendedUser extends User {
  username?: string;
  role?: string;
  accessToken?: string;
}

interface ExtendedJWT extends JWT {
  id?: string;
  role?: string;
  accessToken?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    id?: string;
    name?: string | null;
    username?: string | null;
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
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const config = new Configuration({
            basePath: backendUrl,
            baseOptions: { withCredentials: true },
          });

          const authApi = new AuthApi(config);

          const response = await authApi.authControllerLogin({
            username: credentials.username,
            password: credentials.password,
          });

          if (!response.data.user) {
            return null;
          }

          // Get token
          const tokenResponse = await authApi.authControllerGetToken({
            username: credentials.username,
            password: credentials.password,
          });

          const user = response.data.user;
          const tokenData = tokenResponse.data as any;
          const token = tokenData.access_token;

          // Ensure we return a valid User object
          return {
            id: String(user.id || ''),
            username: user.username || '',
            name: '',
            image: '',
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
        token.username = (user as ExtendedUser).username;
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
          username: (session.user as ExtendedUser)?.username || null,
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
