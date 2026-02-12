"use client";

import { ClerkProvider, SignInButton, SignUpButton, useAuth, } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import { ThemeProvider } from "./theme-provider";
import { dark } from '@clerk/themes'
import { usePathname } from "next/navigation";
import { UnauthenticatedView } from "@/app/features/auth-screen/unauthenticated-view";
import { AuthLoadingView } from "@/app/features/auth-screen/auth-loading-view";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const Providers = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

    return(
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>

            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {isAuthPage ? (
                    children
                ) : (
                    <>
                        <Authenticated>
                            {children}
                        </Authenticated>

                        <Unauthenticated>
                            <UnauthenticatedView />
                        </Unauthenticated>

                        <AuthLoading>
                            <AuthLoadingView />
                        </AuthLoading>
                    </>
                )}

            </ThemeProvider>

            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}