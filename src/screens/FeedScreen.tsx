import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
	FlatList,
	Image,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";
import { Appbar, FAB, type MD3Theme, Text, useTheme } from "react-native-paper";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { useFlares } from "../hooks/useFlares";
import type { FeedScreenNavigationProp } from "../navigation/types";
import type { Flare } from "../types";

export const FeedScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const theme = useTheme();
	const styles = makeStyles(theme);
	const navigation = useNavigation<FeedScreenNavigationProp>();

	// Refetch when screen comes into focus
	useFocusEffect(() => {
		refetch();
	});

	const renderItem = ({ item }: { item: Flare }) => <FlareCard flare={item} />;

	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.header}>
				<View style={styles.headerContent}>
					<Image
						source={require("../../assets/icon.png")}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
						Flare CU
					</Text>
				</View>
			</Appbar.Header>

			<FlatList
				data={flares}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={refetch} />
				}
				ListEmptyComponent={!isLoading ? <EmptyState /> : null}
			/>
			<FAB
				icon="plus"
				style={styles.fab}
				color="white"
				label="Raise Flare"
				onPress={() => navigation.navigate("RaiseFlare")}
			/>
		</View>
	);
};

const makeStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		header: {
			backgroundColor: theme.colors.primary,
		},
		headerContent: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			gap: 12,
		},
		logo: {
			width: 32,
			height: 32,
			borderRadius: 4,
		},
		list: {
			padding: 16,
			paddingBottom: 80,
		},
		fab: {
			position: "absolute",
			margin: 16,
			right: 0,
			bottom: 0,
			backgroundColor: theme.colors.primary,
		},
	});
