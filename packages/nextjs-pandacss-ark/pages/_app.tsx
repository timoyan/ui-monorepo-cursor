import "@/global.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { useMSWReady } from "@/hooks/useMSWReady";

function AppContent({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default function App(props: AppProps) {
	const isMSWReady = useMSWReady();

	if (!isMSWReady) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily: "system-ui, sans-serif",
					color: "#666",
				}}
			>
				Loading…
			</div>
		);
	}

	return <AppContent {...props} />;
}
