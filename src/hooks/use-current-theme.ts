import { useTheme } from "next-themes";

// Hook that determines the current theme (light or dark).
// If user has selected a specific theme, use that. Otherwise, use system theme preference.
// This is used to style UI components appropriately.
export const useCurrentTheme = () =>{
    const {theme,systemTheme} = useTheme();
    if(theme === "light" || theme === "dark"){
        return theme;
    }
    return systemTheme;
}