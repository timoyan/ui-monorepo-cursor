import { Button } from "@/components/ui/button";
import { css } from "@/styled-system/css";

const rowStyles = css({
	display: "flex",
	gap: "1rem",
	flexWrap: "wrap",
	justifyContent: "center",
});

/**
 * Module B: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleB() {
	return (
		<>
			<ModuleBVariantSize />
			<ModuleBFullWidthDisabled />
		</>
	);
}

/**
 * Button variant + size example
 */
export function ModuleBVariantSize() {
	return (
		<div>
			<div className={rowStyles}>
				<Button variant="primary" size="sm">
					Primary SM
				</Button>
				<Button variant="primary" size="md">
					Primary MD
				</Button>
				<Button variant="primary" size="lg">
					Primary LG
				</Button>
			</div>
			<div className={rowStyles}>
				<Button variant="secondary" size="sm">
					Secondary
				</Button>
				<Button variant="danger" size="md">
					Danger
				</Button>
				<Button variant="ghost" size="lg">
					Ghost
				</Button>
			</div>
		</div>
	);
}

/**
 * Button fullWidth + disabled example
 */
export function ModuleBFullWidthDisabled() {
	return (
		<div>
			<Button fullWidth variant="primary" size="lg">
				Full Width Primary
			</Button>
			<div className={rowStyles}>
				<Button variant="primary" disabled>
					Disabled Primary
				</Button>
				<Button variant="danger" disabled>
					Disabled Danger
				</Button>
			</div>
		</div>
	);
}
