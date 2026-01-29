import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
	Appbar,
	Button,
	HelperText,
	type MD3Theme,
	SegmentedButtons,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { useCreateFlare } from "../hooks/useFlares";
import type { RaiseFlareScreenNavigationProp } from "../navigation/types";
import type { FlareType } from "../types";

export const RaiseFlareScreen = () => {
	const navigation = useNavigation<RaiseFlareScreenNavigationProp>();
	const createFlare = useCreateFlare();
	const theme = useTheme();
	const styles = makeStyles(theme);

	const [type, setType] = useState<string>("safety");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = () => {
		if (!location || !description) {
			return; // Basic validation
		}

		createFlare.mutate(
			{
				type: type as FlareType,
				location,
				description,
			},
			{
				onSuccess: () => {
					navigation.goBack();
				},
				onError: () => {
					Alert.alert("Error", "Could not raise flare. Please try again.");
				},
			},
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.header}>
				<Appbar.BackAction
					onPress={() => navigation.goBack()}
					color={theme.colors.onPrimary}
				/>
				<Appbar.Content title="Raise a Flare" color={theme.colors.onPrimary} />
			</Appbar.Header>

			<ScrollView contentContainerStyle={styles.content}>
				<Text variant="titleMedium" style={styles.label}>
					What kind of issue is it?
				</Text>
				<SegmentedButtons
					value={type}
					onValueChange={setType}
					buttons={[
						{ value: "safety", label: "Safety" },
						{ value: "maintenance", label: "Maint." },
						{ value: "medical", label: "Medical" },
						{ value: "other", label: "Other" },
					]}
					style={styles.segmented}
					theme={{ colors: { secondaryContainer: theme.colors.secondary } }}
				/>

				<Text variant="titleMedium" style={styles.label}>
					Where is it?
				</Text>
				<TextInput
					mode="outlined"
					placeholder="e.g. Hall Building, 8th floor"
					value={location}
					onChangeText={setLocation}
					style={styles.input}
				/>
				<HelperText type="info" visible={true}>
					Be specific so others can find or avoid it.
				</HelperText>

				<Text variant="titleMedium" style={styles.label}>
					What's happening?
				</Text>
				<TextInput
					mode="outlined"
					placeholder="Describe the issue..."
					value={description}
					onChangeText={setDescription}
					multiline
					numberOfLines={3}
					style={[styles.input, styles.multilineInput]}
				/>

				<Button
					mode="contained"
					onPress={handleSubmit}
					loading={createFlare.isPending}
					disabled={createFlare.isPending || !location || !description}
					style={styles.button}
					contentStyle={styles.buttonContent}
					buttonColor={theme.colors.primary}
					textColor={theme.colors.onPrimary}
				>
					Raise Flare
				</Button>
			</ScrollView>
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
		content: {
			padding: 24,
		},
		label: {
			marginBottom: 8,
			marginTop: 16,
		},
		segmented: {
			marginBottom: 8,
		},
		input: {
			marginBottom: 4,
			backgroundColor: theme.colors.surface,
		},
		multilineInput: {
			paddingVertical: 16,
		},
		button: {
			marginTop: 32,
		},
		buttonContent: {
			paddingVertical: 8,
		},
	});
