import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		// Primary Brand Colors
		primary: "#912338", // Burgundy (Concordia Red)
		onPrimary: "#FFFFFF", // White text on Burgundy

		// Secondary Brand Colors
		secondary: "#B8AB85", // Gold/Beige from the logo icon
		onSecondary: "#000000", // Black text on Gold/Beige

		// Tertiary/Accent Colors
		tertiary: "#897334", // Darker Gold/Bronze from the logo text
		onTertiary: "#FFFFFF", // White text on Dark Gold

		// Backgrounds & Surfaces
		background: "#F5F5F5", // Light Grey background
		surface: "#FFFFFF", // White cards
		onSurface: "#000000", // Black text on white surface

		// Error
		error: "#B00020",
		onError: "#FFFFFF",

		// Specific UI elements
		outline: "#897334", // Use the Dark Gold for outlines/borders
		outlineVariant: "#dbd2c6", // Lighter beige for subtle dividers
	},
};
