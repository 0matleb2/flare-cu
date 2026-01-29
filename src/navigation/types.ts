import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
	Feed: undefined;
	RaiseFlare: undefined;
};

export type FeedScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Feed"
>;
export type RaiseFlareScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"RaiseFlare"
>;
