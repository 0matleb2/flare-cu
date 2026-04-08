import * as Network from "expo-network";
import { useEffect, useState } from "react";

export function useNetworkState() {
	const [isConnected, setIsConnected] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			const state = await Network.getNetworkStateAsync();
			if (isMounted) setIsConnected(state.isConnected ?? false);
		};

		void init();

		const subscription = Network.addNetworkStateListener((state) => {
			if (isMounted) setIsConnected(state.isConnected ?? false);
		});

		return () => {
			isMounted = false;
			subscription.remove();
		};
	}, []);

	return { isConnected };
}
