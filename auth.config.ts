// auth.config.ts
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      role?: string;
    };
  }
}
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email, password:credentials?.password },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        
        // Return user object without the password
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Add a secret to .env
};
export const auth = () => getServerSession(authOptions);
