import client from "@/lib/apollo";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Task from "./task";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_KEY}
    >
      <ApolloProvider client={client}>
        <UserButton />

        <Component {...pageProps} />
      </ApolloProvider>
    </ClerkProvider>
  );
}
