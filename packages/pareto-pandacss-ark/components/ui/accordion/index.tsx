import {
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
	AccordionRoot,
} from "@ark-ui/react/accordion";
import { styled } from "@/styled-system/jsx";

const StyledAccordionRoot = styled(AccordionRoot, {
	base: {
		w: "full",
		maxW: "md",
		"& [data-scope=accordion]": {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		"& [data-part=item]": {
			borderBottomWidth: "1px",
			borderColor: "gray.200",
		},
		"& [data-part=item-trigger]": {
			w: "full",
			py: 3,
			px: 4,
			textAlign: "left",
			fontWeight: "medium",
			color: "gray.900",
			bg: "transparent",
			_hover: { bg: "gray.50" },
		},
		"& [data-part=item-content]": {
			px: 4,
			pb: 4,
			color: "gray.600",
		},
	},
});

export const Accordion = StyledAccordionRoot;
export { AccordionItem, AccordionItemTrigger, AccordionItemContent };
