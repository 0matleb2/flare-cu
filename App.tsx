import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { RootStackParamList } from "./src/navigation/types";
import { FeedScreen } from "./src/screens/FeedScreen";
import { RaiseFlareScreen } from "./src/screens/RaiseFlareScreen";
import { theme } from "./src/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider theme={theme}>
					<NavigationContainer>
						<Stack.Navigator
							initialRouteName="Feed"
							screenOptions={{
								headerStyle: { backgroundColor: theme.colors.primary },
								headerTintColor: "#fff",
							}}
						>
							<Stack.Screen
								name="Feed"
								component={FeedScreen}
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="RaiseFlare"
								component={RaiseFlareScreen}
								options={{ headerShown: false }}
							/>
						</Stack.Navigator>
					</NavigationContainer>
				</PaperProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}
