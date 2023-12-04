import { Console } from "console";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getCookie, hasCookie, setCookie } from 'cookies-next';

function getIngredients(profile){
    fetch(`http://18.191.166.59:5000/get-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: profile.email}),
    })
    .then((response) => {
        console.log(`[${profile.email}]`);
        if (!response.ok) {
            console.log("net error")
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        //console.log(data.exist);
        console.log(`[${profile.email}]`);
        if(hasCookie('userID')){
            setCookie('userID', data.exist);
        }
        else{
            setCookie('userID', data.exist);
        }
        return data.exist != 0;
    })
  }

const handler = NextAuth({

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {

                return profile.email_verified && profile.email.endsWith("@tamu.edu") && getIngredients(profile);
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
    }
})

export { handler as GET, handler as POST }
