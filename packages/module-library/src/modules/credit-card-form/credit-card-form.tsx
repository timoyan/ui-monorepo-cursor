import { Component, Prop, Event, State, h, Element } from "@stencil/core";
import type { EventEmitter } from "@stencil/core";
// 引入型別定義
import type {
	CoreConfiguration,
	CardConfiguration,
	CardPlaceholders,
	CheckoutAdvancedFlowResponse,
} from "@adyen/adyen-web";

// StylesObject 沒有被導出，我們需要自己定義或使用 any
// 根據 Adyen 文檔，StylesObject 的結構如下：
interface StylesObject {
	base?: Record<string, string>;
	error?: Record<string, string>;
	validated?: Record<string, string>;
	placeholder?: Record<string, string>;
}

// 動態導入 Adyen Web SDK（僅在瀏覽器環境中）
let AdyenCheckout: ((config: unknown) => Promise<unknown>) | null = null;
let Card:
	| (new (
			checkout: unknown,
			config: unknown,
	  ) => { mount: (selector: string) => void; unmount?: () => void })
	| null = null;

// 動態載入 Adyen SDK
async function loadAdyenSDK() {
	if (typeof window === "undefined") {
		return false;
	}

	try {
		// 動態導入 @adyen/adyen-web
		const adyenModule = await import("@adyen/adyen-web");
		AdyenCheckout = adyenModule.AdyenCheckout as (
			config: unknown,
		) => Promise<unknown>;
		Card = adyenModule.Card as new (
			checkout: unknown,
			config: unknown,
		) => { mount: (selector: string) => void; unmount?: () => void };
		return true;
	} catch (error) {
		console.error("Failed to load Adyen SDK:", error);
		return false;
	}
}

// 使用 Adyen 官方的 CoreConfiguration 類型
// 注意：cardStyles 不屬於 CoreConfiguration，將作為單獨的 prop
export type AdyenConfig = CoreConfiguration;

export interface CreditCardFormData {
	cardNumber: string;
	expiryDate: string;
	cvc: string;
	holderName?: string;
}

@Component({
	tag: "credit-card-form",
	styleUrl: "credit-card-form.css",
	shadow: false,
	scoped: true,
})
export class CreditCardForm {
	@Element() el!: HTMLElement;

	@Prop() adyenConfig!: AdyenConfig;
	// 使用 Adyen 官方的 CardPlaceholders 類型
	@Prop() placeholder?: CardPlaceholders;
	// Adyen Card 樣式配置（用於 iframe 內的輸入字段）
	// 不屬於 CoreConfiguration，因此作為單獨的 prop
	@Prop() cardStyles?: StylesObject;
	@Prop() disabled = false;

	@State() isReady = false;
	@State() isValid = false;
	@State() errorMessage = "";

	@Event() formReady!: EventEmitter<void>;
	@Event() formChange!: EventEmitter<CreditCardFormData>;
	@Event() formSubmit!: EventEmitter<CreditCardFormData>;
	@Event() formError!: EventEmitter<{ message: string; error: unknown }>;

	// Adyen v6: checkout 實例
	private adyenCheckout: unknown = null;
	// Adyen v6: Card 組件實例（使用構造函數創建）
	private cardComponent: {
		unmount?: () => void;
		mount: (selector: string) => void;
	} | null = null;
	private containerId = `adyen-card-container-${Math.random()
		.toString(36)
		.substr(2, 9)}`;
	private isInitializing = false;

	async componentDidLoad() {
		await this.initializeAdyen();
	}

	async disconnectedCallback() {
		if (this.cardComponent?.unmount) {
			this.cardComponent.unmount();
		}
	}

	/**
	 * 檢查 Adyen SDK 是否已載入
	 * 使用 npm 包 @adyen/adyen-web
	 */
	private checkAdyenLoaded(): boolean {
		return (
			AdyenCheckout !== null &&
			typeof AdyenCheckout === "function" &&
			Card !== null &&
			typeof Card === "function"
		);
	}

	/**
	 * 載入 Adyen SDK（從 npm 包）
	 */
	private async loadAdyenSDK(): Promise<void> {
		// 如果已經載入，直接返回
		if (this.checkAdyenLoaded()) {
			return;
		}

		// 動態載入 Adyen SDK
		const loaded = await loadAdyenSDK();
		if (!loaded) {
			throw new Error(
				"Failed to load Adyen SDK. Please ensure @adyen/adyen-web is installed.",
			);
		}

		if (!this.checkAdyenLoaded()) {
			throw new Error(
				"Adyen SDK loaded but AdyenCheckout or Card is not available.",
			);
		}
	}

	/**
	 * 初始化 Adyen
	 */
	private async initializeAdyen() {
		// 防止重複初始化
		if (this.isInitializing) {
			return;
		}

		try {
			// 檢查是否在瀏覽器環境
			if (typeof window === "undefined") {
				return;
			}

			this.isInitializing = true;

			// 載入 Adyen SDK（從 npm 包）
			await this.loadAdyenSDK();

			// 創建 Adyen Checkout 實例
			await this.createAdyenCheckout();
		} catch (error) {
			this.handleError("Failed to initialize Adyen", error);
		} finally {
			this.isInitializing = false;
		}
	}

	/**
	 * 創建 Adyen Checkout 實例並初始化 Card 組件
	 */
	private async createAdyenCheckout() {
		try {
			if (!AdyenCheckout || typeof AdyenCheckout !== "function") {
				throw new Error("AdyenCheckout is not available or not a function");
			}

			// 構建 Adyen Checkout 配置
			// 根據 Adyen 6.0.0 文檔：https://docs.adyen.com/online-payments/upgrade-your-integration/upgrade-to-web-v6
			// 使用 CoreConfiguration 類型，並添加自定義的 onSubmit 處理
			const checkoutConfig: CoreConfiguration = {
				...this.adyenConfig,
				// 確保 countryCode 存在（v6 中為必需）
				countryCode: this.adyenConfig.countryCode || "US",
				// 覆蓋 onSubmit 以添加表單提交事件
				onSubmit: async (state, component, actions) => {
					try {
						// 調用用戶提供的 onSubmit（如果存在）
						if (this.adyenConfig.onSubmit) {
							await this.adyenConfig.onSubmit(state, component, actions);
						}

						// 處理表單提交
						const formData = this.extractFormData(state);
						if (formData) {
							this.formSubmit.emit(formData);
						}

						// Adyen v6: 必須調用 actions.resolve() 或 actions.reject()
						// 如果沒有提供 actions，我們仍然處理提交但不控制 Adyen 流程
						if (actions) {
							// 這裡應該調用您的支付 API，然後 resolve 或 reject
							// 為了簡化，我們先 resolve，實際使用時應該根據 API 響應決定
							// resolve 需要傳遞 CheckoutAdvancedFlowResponse
							// 實際使用時應該傳遞正確的響應對象
							// 這裡先傳遞 undefined，實際使用時應該從 API 響應中獲取
							actions.resolve(
								undefined as unknown as CheckoutAdvancedFlowResponse,
							);
						}
					} catch (error) {
						// 如果出錯，reject 支付流程
						if (actions) {
							actions.reject();
						}
						this.handleError("Payment submission error", error);
					}
				},
				// 覆蓋 onError 以添加錯誤處理
				onError: (error, component) => {
					// 調用用戶提供的 onError（如果存在）
					if (this.adyenConfig.onError) {
						this.adyenConfig.onError(error, component);
					}
					// 處理錯誤
					this.handleError("Payment error", error);
				},
				// 覆蓋 onChange 以添加表單變更事件
				onChange: (state, component) => {
					// 調用用戶提供的 onChange（如果存在）
					if (this.adyenConfig.onChange) {
						this.adyenConfig.onChange(state, component);
					}
					// 處理表單變更
					this.handleChange(state);
				},
			};

			// 注意：對於單個 Card 組件，樣式應該在 Card 配置中，而不是 Checkout 配置中
			// paymentMethodsConfiguration 只在 Drop-in 中使用
			// 樣式將在 createCardComponent 中配置

			// 調試：輸出完整的配置
			console.log(
				"[CreditCardForm] Checkout config:",
				JSON.stringify(checkoutConfig, null, 2),
			);

			// 創建 Adyen Checkout 實例
			const checkout = await AdyenCheckout(checkoutConfig);

			if (!checkout || typeof checkout !== "object") {
				throw new Error("Failed to create Adyen Checkout instance");
			}

			console.log("[CreditCardForm] Checkout instance created:", checkout);

			// 保存 checkout 實例（Adyen v6 使用構造函數方式創建組件）
			this.adyenCheckout = checkout;

			// 創建 Card 組件
			await this.createCardComponent();
		} catch (error) {
			this.handleError("Failed to create Adyen checkout", error);
		}
	}

	/**
	 * 創建並掛載 Card 組件
	 * Adyen v6: 使用構造函數方式創建組件
	 * const card = new Card(checkout, config).mount('#card');
	 */
	private async createCardComponent() {
		if (!this.adyenCheckout) {
			throw new Error("Adyen Checkout instance is not available");
		}

		const container = this.el.querySelector(`#${this.containerId}`);
		if (!container) {
			throw new Error(`Container element #${this.containerId} not found`);
		}

		// 檢查 Card 構造函數是否可用
		if (!Card || typeof Card !== "function") {
			throw new Error(
				"Card constructor is not available. Please ensure @adyen/adyen-web is installed.",
			);
		}

		try {
			// 創建 Card 組件配置
			// 根據 Adyen v6 文檔，placeholder 在 Card 配置中
			// 使用 CardConfiguration 類型確保配置正確
			const placeholderConfig: CardPlaceholders = this.placeholder || {};
			const cardConfig: Partial<CardConfiguration> = {
				showPayButton: this.adyenConfig.showPayButton ?? false,
				hasHolderName: true,
				placeholders: placeholderConfig, // 注意：Adyen 使用 placeholders（複數）
				// 樣式配置也放在 Card 配置中（Adyen v6）
				...(this.cardStyles ? { styles: this.cardStyles } : {}),
				onChange: (state: unknown) => {
					const stateData = state as { isValid: boolean };
					this.isValid = stateData.isValid;
					if (stateData.isValid) {
						this.errorMessage = "";
					}
					// 觸發表單變更事件
					this.handleChange(state);
				},
			};

			if (Object.keys(placeholderConfig).length > 0) {
				console.log(
					"[CreditCardForm] Placeholder configured:",
					placeholderConfig,
				);
			}

			if (this.cardStyles) {
				console.log(
					"[CreditCardForm] Card styles in Card config:",
					this.cardStyles,
				);
			}

			// 調試：輸出完整的 Card 配置
			console.log(
				"[CreditCardForm] Card config:",
				JSON.stringify(cardConfig, null, 2),
			);

			// Adyen v6: 使用構造函數方式創建 Card 組件
			// const card = new Card(checkout, config).mount('#card');
			this.cardComponent = new Card(this.adyenCheckout, cardConfig);

			console.log(
				"[CreditCardForm] Card component created:",
				this.cardComponent,
			);

			if (!this.cardComponent) {
				throw new Error("Failed to create Card component: component is null");
			}

			if (
				!this.cardComponent.mount ||
				typeof this.cardComponent.mount !== "function"
			) {
				throw new Error(
					"Failed to create Card component: mount method is not available",
				);
			}

			// 掛載組件到容器
			// 確保容器已存在於 DOM 中
			await new Promise((resolve) => setTimeout(resolve, 0));
			this.cardComponent.mount(`#${this.containerId}`);

			// 標記為準備就緒
			this.isReady = true;
			this.formReady.emit();
		} catch (error) {
			this.handleError("Failed to create Card component", error);
			throw error; // 重新拋出以便上層處理
		}
	}

	/**
	 * 從 Adyen state 中提取表單數據
	 */
	private extractFormData(state: unknown): CreditCardFormData | null {
		const stateData = state as {
			isValid: boolean;
			data?: { paymentMethod?: Record<string, unknown> };
		};

		if (stateData.isValid && stateData.data?.paymentMethod) {
			const paymentMethod = stateData.data.paymentMethod as Record<
				string,
				string
			>;

			return {
				cardNumber: paymentMethod.encryptedCardNumber || "",
				expiryDate: paymentMethod.encryptedExpiryDate || "",
				cvc: paymentMethod.encryptedSecurityCode || "",
				holderName: paymentMethod.holderName || "",
			};
		}

		return null;
	}

	/**
	 * 處理表單變更
	 */
	private handleChange(state: unknown) {
		const stateData = state as {
			isValid: boolean;
			data?: { paymentMethod?: Record<string, unknown> };
		};

		if (stateData.isValid && stateData.data?.paymentMethod) {
			const paymentMethod = stateData.data.paymentMethod as Record<
				string,
				string
			>;

			const formData: CreditCardFormData = {
				cardNumber: paymentMethod.encryptedCardNumber || "",
				expiryDate: paymentMethod.encryptedExpiryDate || "",
				cvc: paymentMethod.encryptedSecurityCode || "",
				holderName: paymentMethod.holderName || "",
			};

			this.formChange.emit(formData);
		}
	}

	/**
	 * 處理錯誤
	 */
	private handleError(message: string, error: unknown) {
		this.errorMessage = message;
		this.formError.emit({ message, error });
		console.error(`[CreditCardForm] ${message}:`, error);
	}

	render() {
		return (
			<div class="credit-card-form">
				<div
					id={this.containerId}
					class={`adyen-container ${this.disabled ? "disabled" : ""}`}
				/>
				{this.errorMessage && (
					<div class="error-message" role="alert">
						{this.errorMessage}
					</div>
				)}
			</div>
		);
	}
}
