import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER", // default role for OAuth users
        };
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        name: { type: "text" },
        phone: { type: "text" },
        action: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) {
          throw new Error("Email/Phone and OTP are required");
        }

        // 1. Verify the OTP in the database
        const otpRecord = await prisma.otpToken.findUnique({
          where: {
            identifier_code: {
              identifier: credentials.identifier,
              code: credentials.otp,
            },
          },
        });

        if (!otpRecord) {
          throw new Error("Invalid or expired OTP");
        }

        if (new Date() > otpRecord.expiresAt) {
          await prisma.otpToken.delete({ where: { id: otpRecord.id } });
          throw new Error("OTP has expired");
        }

        const action = credentials.action || "login";

        // 2. Find the user
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier }
            ]
          },
        });

        if (action === "register") {
          if (user) {
            throw new Error("Account with this email or phone already exists");
          }
          if (credentials.phone && credentials.phone !== credentials.identifier) {
            const phoneUser = await prisma.user.findUnique({ where: { phone: credentials.phone } });
            if (phoneUser) throw new Error("Phone number is already registered");
          }

          user = await prisma.user.create({
            data: {
              name: credentials.name || "User",
              email: credentials.identifier.includes("@") ? credentials.identifier : "",
              phone: credentials.phone || credentials.identifier,
              role: "CUSTOMER",
            }
          });
        } else {
          if (!user) {
            throw new Error("No account found with this identifier");
          }
          if (action === "vendor_login" && user.role !== "VENDOR" && user.role !== "ADMIN") {
            throw new Error("This account does not have Vendor privileges.");
          }
        }

        // 3. Delete the OTP since it has been successfully used
        await prisma.otpToken.delete({ where: { id: otpRecord.id } });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
  pages: {
    signIn: "/login",
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
