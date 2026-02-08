import { newSpecPage } from "@stencil/core/testing";
import { CreditCardForm } from "./credit-card-form";

describe("credit-card-form", () => {
	it("renders", async () => {
		const page = await newSpecPage({
			components: [CreditCardForm],
			html: "<credit-card-form></credit-card-form>",
		});
		expect(page.root).toEqualHtml(`
			<credit-card-form>
				<div class="credit-card-form">
					<div class="adyen-container"></div>
				</div>
			</credit-card-form>
		`);
	});
});
