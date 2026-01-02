"use client";

import {dark} from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";

interface Props{
    showName?: boolean;
}

// Displays the logged-in user's profile button with their avatar.
// Users can click this to access profile settings, sign out, etc.
// The button appearance adjusts based on the current theme (light/dark).
export const UserControl = ({showName}: Props) =>{
    const currentTheme = useCurrentTheme();
    return(
        <UserButton
            showName={showName}
            appearance={{
                elements:{
                    userButtonBox: "rounded-md!",
                    userButtonAvatarBox: "rounded-md! size-8!",
                    userButtonTrigger: "rounded-md!"
                },
                baseTheme: currentTheme === 'dark' ? dark : undefined,
            }}
        />
    )
}