import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
} from "@/components/ui/accordion";

/**
 * Module A: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleA() {
	return (
		<Accordion defaultValue={["item-1"]}>
			<AccordionItem value="item-1">
				<AccordionItemTrigger>What is PandaCSS?</AccordionItemTrigger>
				<AccordionItemContent>
					PandaCSS is a build-time CSS-in-JS framework with zero runtime
					overhead. Styles are extracted at build time.
				</AccordionItemContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionItemTrigger>What is Ark UI?</AccordionItemTrigger>
				<AccordionItemContent>
					Ark UI is a headless, accessible component library. Style it with
					PandaCSS using data-scope and data-part attributes.
				</AccordionItemContent>
			</AccordionItem>
		</Accordion>
	);
}
