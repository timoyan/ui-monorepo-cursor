import type { AppProps } from "next/app";
import { ToastProvider } from "ui-react18/Toast";
import "ui-react18/Toast/style.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<style jsx global>{`
				html,
				body {
					position: relative;
					width: 100%;
					height: 100%;
				}
			`}</style>
			<ToastProvider position="top-right">
				<Component {...pageProps} />
			</ToastProvider>
		</>
	);
}
