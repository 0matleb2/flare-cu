import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import type { AppColors } from "../theme";
import { darkColors, lightColors } from "../theme";

type ColorMode = "system" | "light" | "dark";

interface ThemeContextValue {
	isDark: boolean;
	colorMode: ColorMode;
	setColorMode: (mode: ColorMode) => void;
	colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue>({
	isDark: false,
	colorMode: "system",
	setColorMode: () => {},
	colors: lightColors,
});

export const useAppTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemScheme = useColorScheme();
	const [colorMode, setColorMode] = useState<ColorMode>("system");

	const isDark = useMemo(() => {
		if (colorMode === "system") return systemScheme === "dark";
		return colorMode === "dark";
	}, [colorMode, systemScheme]);

	const activeColors = isDark ? darkColors : lightColors;

	const value = useMemo(
		() => ({ isDark, colorMode, setColorMode, colors: activeColors }),
		[isDark, colorMode, activeColors],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
