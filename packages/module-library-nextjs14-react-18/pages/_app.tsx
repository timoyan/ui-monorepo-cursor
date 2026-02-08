import type { AppProps } from "next/app";
import { useEffect } from "react";
import { defineCustomElements } from "module-library/loader";

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		// 在客戶端定義自定義元素（確保 Web Components 正確初始化）
		defineCustomElements();
	}, []);

	return (
		<>
			<style jsx global>{`
				html,
				body {
					position: relative;
					width: 100%;
					height: 100%;
					margin: 0;
					padding: 0;
				}
			`}</style>
			<Component {...pageProps} />
		</>
	);
}
