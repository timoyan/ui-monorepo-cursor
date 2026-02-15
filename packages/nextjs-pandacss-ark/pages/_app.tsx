import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import { MSWProvider } from "@/providers/MSWProvider";
import "@/global.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MSWProvider>
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</MSWProvider>
	);
}
