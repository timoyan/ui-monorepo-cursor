import depthLimit from "graphql-depth-limit";
import type { Plugin } from "graphql-yoga";

const MAX_DEPTH = 10;

/**
 * Rejects queries deeper than MAX_DEPTH to limit DoS from deeply nested selections.
 */
export function depthLimitPlugin(): Plugin {
	return {
		onValidate({ addValidationRule }) {
			addValidationRule(depthLimit(MAX_DEPTH));
		},
	};
}
