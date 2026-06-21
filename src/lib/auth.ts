import NextAuth from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { nodeLogin } from "@/app/actions/auth/login";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await nodeLogin({
            email: credentials.email,
            password: credentials.password,
          });

          if (result.success && result.data) {
            return {
              id: result.data.sub,
              name: result.data.name,
              email: result.data.email,
              role: result.data.role,
              document: result.data.document,
              gender: result.data.gender,
              isDisabled: result.data.isDisabled,
              disabledDetails: result.data.disabledDetails,
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
            };
          } else {
            throw new Error(result.message || "Falha na autenticação");
          }
        } catch (error: any) {
          throw new Error(error?.message || "Falha na autenticação");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        // Atualiza o token com os dados do usuário na primeira autenticação
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.document = user.document;
        token.gender = user.gender;
        token.isDisabled = user.isDisabled;
        token.disabledDetails = user.disabledDetails;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Passa os dados do token para a sessão
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        document: token.document,
        gender: token.gender,
        isDisabled: token.isDisabled,
        disabledDetails: token.disabledDetails,
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

export default NextAuth(authOptions);
