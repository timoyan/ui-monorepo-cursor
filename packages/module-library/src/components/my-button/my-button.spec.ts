import { newSpecPage } from "@stencil/core/testing";
import { MyButton } from "./my-button";

describe("my-button", () => {
	it("renders", async () => {
		const page = await newSpecPage({
			components: [MyButton],
			html: "<my-button>Click me</my-button>",
		});
		expect(page.root).toEqualHtml(`
			<my-button>
				<button class="btn btn-primary btn-md" type="button">
					Click me
				</button>
			</my-button>
		`);
	});

	it("renders with variant", async () => {
		const page = await newSpecPage({
			components: [MyButton],
			html: `<my-button variant="secondary">Secondary</my-button>`,
		});
		expect(page.root).toEqualHtml(`
			<my-button>
				<button class="btn btn-secondary btn-md" type="button">
					Secondary
				</button>
			</my-button>
		`);
	});

	it("renders disabled state", async () => {
		const page = await newSpecPage({
			components: [MyButton],
			html: "<my-button disabled>Disabled</my-button>",
		});
		expect(page.root?.querySelector("button")?.hasAttribute("disabled")).toBe(
			true,
		);
	});
});
