import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
// 使用包裝組件處理 SSR hydration 警告
import { MyButton } from "../components/MyButtonWrapper";
// 載入組件 CSS
import "module-library/components/my-button/css";
// 動態導入 Credit Card Form（禁用 SSR）
const CreditCardForm = dynamic(
	() =>
		import("module-library/react").then((mod) => ({
			default: mod.CreditCardForm,
		})),
	{
		ssr: false, // 禁用 SSR，因為 Adyen SDK 需要在客戶端載入
		loading: () => <div style={{ color: "#666", padding: 20 }}>載入中...</div>,
	},
);
import type { CreditCardFormData, AdyenConfig } from "module-library";

export default function Home() {
	const [clickCount, setClickCount] = useState(0);
	const [formData, setFormData] = useState<CreditCardFormData | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [isFormReady, setIsFormReady] = useState(false);

	const handleButtonClick = () => {
		setClickCount((prev) => prev + 1);
		console.log("Button clicked!");
	};

	// Adyen 配置
	// 使用環境變量，避免將敏感信息上傳到 GitHub
	// 環境變量從 .env.local 文件讀取（該文件已包含在 .gitignore 中）
	const adyenConfig: AdyenConfig = {
		environment:
			(process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT as "test" | "live") || "test",
		clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY || "", // 如果未設置，將為空字符串（會導致錯誤，提醒設置環境變量）
		locale: process.env.NEXT_PUBLIC_ADYEN_LOCALE || "en-US",
		countryCode: process.env.NEXT_PUBLIC_ADYEN_COUNTRY_CODE || "US",
		showPayButton: false,
	};

	// Adyen Card 樣式配置（用於 iframe 內的輸入字段）
	// 現在作為單獨的 prop，不屬於 CoreConfiguration
	const cardStyles = {
		base: {
			color: "#001b2b",
			fontSize: "16px",
			fontWeight: "800",
		},
		placeholder: {
			color: "#90a2bd",
			fontWeight: "400",
		},
		error: {
			color: "#001b2b",
		},
		validated: {
			color: "green",
		},
	};

	const handleFormReady = () => {
		setIsFormReady(true);
		console.log("Credit card form is ready");
	};

	const handleFormChange = (e: { detail: CreditCardFormData }) => {
		setFormData(e.detail);
		setFormError(null);
		console.log("Form changed:", e.detail);
	};

	const handleFormSubmit = (e: { detail: CreditCardFormData }) => {
		setFormData(e.detail);
		setFormError(null);
		console.log("Form submitted:", e.detail);
		// 這裡可以發送到後端進行支付處理
		alert("表單已提交！請在控制台查看數據。");
	};

	const handleFormError = (e: {
		detail: { message: string; error: unknown };
	}) => {
		setFormError(e.detail.message);
		console.error("Form error:", e.detail);
	};

	return (
		<>
			<Head>
				<title>Module Library - Next.js 14 + React 18</title>
				<meta
					name="description"
					content="Testing module-library in Next.js 14"
				/>
			</Head>
			<main
				style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}
				suppressHydrationWarning
			>
				<h1>Module Library - Next.js 14 + React 18</h1>
				<p style={{ color: "#666", marginBottom: 32 }}>
					使用 module-library React 組件在 Next.js 14 中（通過 React Output
					Target）
				</p>

				<section style={{ marginBottom: 40 }}>
					<h2>1. 基本按鈕</h2>
					<div
						style={{
							display: "flex",
							gap: 16,
							flexWrap: "wrap",
							marginBottom: 20,
						}}
					>
						<MyButton variant="primary">Primary</MyButton>
						<MyButton variant="secondary">Secondary</MyButton>
						<MyButton variant="success">Success</MyButton>
						<MyButton variant="danger">Danger</MyButton>
					</div>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>2. 不同尺寸</h2>
					<div
						style={{
							display: "flex",
							gap: 16,
							alignItems: "center",
							marginBottom: 20,
						}}
					>
						<MyButton size="sm" variant="primary">
							Small
						</MyButton>
						<MyButton size="md" variant="primary">
							Medium
						</MyButton>
						<MyButton size="lg" variant="primary">
							Large
						</MyButton>
					</div>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>3. 禁用狀態</h2>
					<div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
						<MyButton disabled>Disabled</MyButton>
						<MyButton variant="primary" disabled>
							Disabled Primary
						</MyButton>
					</div>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>4. 事件處理</h2>
					<div
						style={{
							display: "flex",
							gap: 16,
							alignItems: "center",
							marginBottom: 20,
						}}
					>
						<MyButton variant="primary" onButtonClick={handleButtonClick}>
							點擊我
						</MyButton>
						<span style={{ fontSize: 18, fontWeight: 600 }}>
							點擊次數: {clickCount}
						</span>
					</div>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>5. 主題定制</h2>
					<div style={{ marginBottom: 20 }}>
						<MyButton
							className="custom-theme"
							variant="primary"
							style={
								{
									"--button-primary-bg": "#9b59b6",
									"--button-primary-hover": "#8e44ad",
								} as React.CSSProperties
							}
						>
							自定義主題（紫色）
						</MyButton>
					</div>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>6. 使用範例</h2>
					<pre
						style={{
							background: "#f5f5f5",
							padding: 16,
							borderRadius: 8,
							overflow: "auto",
						}}
					>
						<code>{`// 使用 React Output Target 生成的組件
import { MyButton } from 'module-library/react';
import 'module-library/components/my-button/css';

// 在組件中使用（像原生 React 組件一樣）
<MyButton variant="primary" onButtonClick={handleClick}>
  Click me
</MyButton>`}</code>
					</pre>
				</section>

				<section style={{ marginBottom: 40 }}>
					<h2>7. Credit Card Form (Adyen)</h2>
					<div
						style={{
							background: "#fff",
							padding: 24,
							borderRadius: 8,
							border: "1px solid #e0e0e0",
							maxWidth: 600,
							marginBottom: 20,
						}}
					>
						<CreditCardForm
							adyenConfig={adyenConfig}
							cardStyles={cardStyles}
							placeholder={{
								cardNumber: "1234 5678 9012 3456",
								expiryDate: "MM/YY",
								securityCodeThreeDigits: "123",
								securityCodeFourDigits: "1234",
								holderName: "John Doe",
							}}
							onFormReady={handleFormReady}
							onFormChange={handleFormChange}
							onFormSubmit={handleFormSubmit}
							onFormError={handleFormError}
						/>
						{formError && (
							<div
								style={{
									marginTop: 16,
									padding: 12,
									background: "#fee",
									border: "1px solid #fcc",
									borderRadius: 4,
									color: "#c33",
								}}
							>
								錯誤: {formError}
							</div>
						)}
					</div>

					{formData && (
						<div
							style={{
								background: "#f5f5f5",
								padding: 16,
								borderRadius: 8,
								marginTop: 16,
							}}
						>
							<h3 style={{ marginTop: 0, marginBottom: 12 }}>
								表單數據（已加密）：
							</h3>
							<pre
								style={{
									margin: 0,
									fontSize: 12,
									overflow: "auto",
								}}
							>
								{JSON.stringify(formData, null, 2)}
							</pre>
							<p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
								注意：所有卡號數據都是加密的，符合 PCI DSS 要求。
							</p>
						</div>
					)}

					<div style={{ marginTop: 20 }}>
						<h3>使用說明：</h3>
						<ul style={{ color: "#666", lineHeight: 1.8 }}>
							<li>
								請在代碼中替換 <code>clientKey</code> 為您的實際 Adyen Client
								Key
							</li>
							<li>
								測試環境可以使用 Adyen 提供的測試卡號：{" "}
								<code>4111 1111 1111 1111</code>
							</li>
							<li>
								Adyen Web SDK 已通過 CDN 在 <code>_app.tsx</code> 中載入
							</li>
							<li>
								確保 <code>environment</code> 配置與 CDN
								載入的環境一致（test/live）
							</li>
							<li>所有卡號數據都是加密的，可以直接發送到後端進行支付處理</li>
						</ul>
					</div>
				</section>
			</main>
		</>
	);
}
