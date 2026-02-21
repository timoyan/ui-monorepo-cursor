import type { EventEmitter } from "@stencil/core";
import { Component, Event, Prop } from "@stencil/core";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

@Component({
	tag: "my-button",
	styleUrl: "my-button.css",
	shadow: false, // 不使用 Shadow DOM
	scoped: true, // 使用 Scoped CSS
})
export class MyButton {
	@Prop() variant: ButtonVariant = "primary";
	@Prop() size: ButtonSize = "md";
	@Prop() disabled = false;
	@Prop() type: "button" | "submit" | "reset" = "button";

	@Event() buttonClick!: EventEmitter<MouseEvent>;

	private handleClick = (event: MouseEvent) => {
		if (!this.disabled) {
			this.buttonClick.emit(event);
		}
	};

	render() {
		return (
			<button
				class={`btn btn-${this.variant} btn-${this.size}`}
				type={this.type}
				disabled={this.disabled}
				onClick={this.handleClick}
			>
				<slot />
			</button>
		);
	}
}
