import { Console } from "console";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getCookie, hasCookie, setCookie } from 'cookies-next';

const handler = NextAuth({

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {

                // var temp = getEmail(profile)
                // session.user.user = 
                return profile.email_verified && profile.email.endsWith("@tamu.edu");
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
    }
})

export { handler as GET, handler as POST }
