"use client";

import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

// Navigation bar displayed at the top of the home page.
// Shows the Vibe logo/brand and sign-in/sign-up buttons for unauthenticated users.
// For logged-in users, displays the user profile button.
export const Navbar1 = () => {

    const isScrolled = useScroll();

    return (
        <nav className={cn(
            "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
            isScrolled && "bg-background border-border"
            )}>
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Vibe" width={24} height={24} />
                    <span className="font-semibold text-lg">Vibe</span>
                </Link>
                <div>
                    <SignedOut>
                        <div className="flex gap-2">
                            <SignUpButton>
                                <Button variant="outline" size="sm">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                            <SignInButton>
                                <Button size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </div>
                    </SignedOut>
                    <SignInButton>
                        <UserControl showName />
                    </SignInButton>
                </div>
            </div>
        </nav>
    );
}

