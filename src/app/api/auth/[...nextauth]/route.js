import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';


export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/gmail.send',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account) {
  //       token.accessToken = account.access_token;
  //       token.refreshToken = account.refresh_token;
  //       token.accessTokenExpires = account.expires_at * 1000;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user.accessToken = token.accessToken;
  //     session.user.refreshToken = token.refreshToken;
  //     return session;
  //   },
  //   async redirect({ url, baseUrl }) {
  //   return '/dashboard'; // always redirect here
  // },
  // },

  callbacks: {
  // async jwt({ token, account }) {
  //   if (account) {
  //     token.accessToken = account.access_token;
  //     token.refreshToken = account.refresh_token;
  //     token.accessTokenExpires = account.expires_at * 1000;
  //     token.user = account.providerAccountId; // store user id here for debugging
  //   }
  //   console.log('JWT callback token:', token);
  //   return token;
  // },
  async jwt({ token, account }) {
  if (account) {
    return {
      ...token,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      accessTokenExpires: account.expires_at * 1000,
    };
  }
  // Return the previous token for all other cases
  return token;
},

  // async session({ session, token }) {
  //   session.user.accessToken = token.accessToken;
  //   session.user.refreshToken = token.refreshToken;
  //   console.log('Session callback session:', session);
  //   return session;
  // },
  async session({ session, token }) {
  // Safely add tokens only if they exist
  if (token?.accessToken) {
    session.user.accessToken = token.accessToken;
  }
  if (token?.refreshToken) {
    session.user.refreshToken = token.refreshToken;
  }
  return session;
},
  async redirect({ url, baseUrl }) {
    return '/dashboard';
  },
},
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// 👇 These are required!
export { handler as GET, handler as POST };
