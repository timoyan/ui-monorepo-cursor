/**
 * useModuleAccordion usage examples
 *
 * Shows how to control which module is open based on data
 */
/** biome-ignore-all lint/correctness/noUnusedVariables: Example file - variables are intentionally unused for demonstration purposes */

import { useModuleAccordion } from "./useModuleAccordion";

// ===== Example 1: Basic usage (no data logic) =====
export function Example1() {
	const { getValue, getOnValueChange } = useModuleAccordion();
	// Same usage as before
}

// ===== Example 2: Set initial open module =====
export function Example2() {
	const { getValue, getOnValueChange } = useModuleAccordion({
		initialOpenModuleId: "a", // Initially open module "a"
	});
}

// ===== Example 3: Decide which module to open from data =====
interface Example3Props {
	hasError: boolean;
	hasCartItems: boolean;
	currentStep: string;
}

export function Example3({
	hasError,
	hasCartItems,
	currentStep,
}: Example3Props) {
	const { getValue, getOnValueChange } = useModuleAccordion({
		shouldOpen: (_data) => {
			// Business logic: which module to open
			if (hasError) {
				return "error-module"; // Open error module when there is an error
			}
			if (hasCartItems && currentStep === "checkout") {
				return "c"; // Open cart when has items and on checkout step
			}
			return null; // Otherwise open none
		},
		data: { hasError, hasCartItems, currentStep }, // Pass data
	});
}

// ===== Example 4: Decide from API data =====
export function Example4() {
	// Assume API hooks exist:
	// const { data: cartData } = useGetCartQuery();
	// const { data: userData } = useGetUserQuery();

	const cartData = { items: [] };
	const userData = { isNewUser: true };

	const { getValue, getOnValueChange } = useModuleAccordion({
		shouldOpen: () => {
			// Decide from API data
			if (cartData.items.length === 0) {
				return "c"; // Open cart when empty
			}
			if (userData.isNewUser) {
				return "a"; // Open intro for new users
			}
			return null;
		},
		data: { cartData, userData }, // Re-compute when this data changes
	});
}

// ===== Example 5: With URL params =====
export function Example5() {
	// Assume router:
	// const router = useRouter();
	// const moduleId = router.query.moduleId as string;

	const moduleId = "b-1";

	const { getValue, getOnValueChange } = useModuleAccordion({
		shouldOpen: () => {
			// Open module from URL param
			if (moduleId && ["a", "b-1", "b-2", "c"].includes(moduleId)) {
				return moduleId;
			}
			return null;
		},
		data: moduleId, // Re-compute when URL param changes
	});
}

// ===== Example 6: Complex business logic =====
interface ComplexData {
	step: "intro" | "products" | "cart" | "checkout";
	hasSeenIntro: boolean;
	cartItemCount: number;
	userLevel: "basic" | "premium";
}

export function Example6() {
	const complexData: ComplexData = {
		step: "products",
		hasSeenIntro: false,
		cartItemCount: 3,
		userLevel: "premium",
	};

	const { getValue, getOnValueChange } = useModuleAccordion({
		shouldOpen: (data) => {
			const d = data as ComplexData;
			if (!d) return null;

			// Complex business logic
			if (!d.hasSeenIntro && d.step === "intro") {
				return "a"; // Intro not seen and on intro step
			}
			if (d.step === "cart" && d.cartItemCount > 0) {
				return "c"; // On cart step with items
			}
			if (d.userLevel === "premium" && d.step === "products") {
				return "b-1"; // Premium user on products step
			}
			return null;
		},
		data: complexData,
	});
}
