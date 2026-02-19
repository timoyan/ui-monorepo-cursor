import { css } from "@/styled-system/css";
import type { ReactNode } from "react";
import {
	Accordion,
	AccordionItem,
	AccordionItemTrigger,
	AccordionItemContent,
} from "@/components/ui/accordion";

interface ModuleContainerProps {
	children: ReactNode;
	/**
	 * Module identifier (optional). Used for data-module attribute for styling and tests.
	 */
	moduleId?: string;
	/**
	 * Module title (optional)
	 */
	title?: string;
	/**
	 * Whether to show border (default: false)
	 */
	bordered?: boolean;
	/**
	 * Custom className
	 */
	className?: string;
	/**
	 * Use as wrapper (default: false). When true, renders a div instead of section.
	 * Use when content already has its own section structure.
	 */
	asWrapper?: boolean;
	/**
	 * Enable expand/collapse. When true, title acts as Accordion trigger and content is collapsible.
	 */
	collapsible?: boolean;
	/**
	 * Whether to expand by default when collapsible (only when collapsible is true)
	 */
	defaultOpen?: boolean;
	/**
	 * Controlled: current expanded value (only when collapsible is true)
	 */
	value?: string[];
	/**
	 * Controlled: callback when value changes (only when collapsible is true)
	 */
	onValueChange?: (details: { value: string[] }) => void;
}

const containerStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1rem",
	w: "full",
	maxW: "md",
});

const containerStylesCollapsible = css({
	w: "full",
	maxW: "md",
});

const borderedStyles = css({
	borderWidth: "1px",
	borderColor: "gray.200",
	borderRadius: "md",
	p: 4,
	bg: "gray.50",
});

const titleStyles = css({
	fontSize: "lg",
	fontWeight: "semibold",
	w: "full",
	textAlign: "center",
});

/**
 * Module container component. Wraps module content with consistent layout and styling.
 */
export function ModuleContainer({
	children,
	moduleId,
	title,
	bordered = false,
	className,
	asWrapper = false,
	collapsible = false,
	defaultOpen = true,
	value,
	onValueChange,
}: ModuleContainerProps) {
	// When collapsible, use minimal styles so children are not affected
	const baseContainerStyles = collapsible
		? containerStylesCollapsible
		: containerStyles;

	// In collapsible mode do not apply bordered styles to avoid affecting inner content
	const combinedStyles =
		collapsible || !bordered
			? baseContainerStyles
			: `${baseContainerStyles} ${borderedStyles}`;

	const finalClassName = className
		? `${combinedStyles} ${className}`
		: combinedStyles;

	const triggerLabel = title ?? "Content";

	const content = collapsible ? (
		<div className={css({ w: "full" })}>
			<Accordion
				value={value}
				onValueChange={
					onValueChange ? (details) => onValueChange(details) : undefined
				}
				defaultValue={
					value === undefined
						? defaultOpen
							? ["module-content"]
							: []
						: undefined
				}
				collapsible
			>
				<AccordionItem value="module-content">
					<AccordionItemTrigger>{triggerLabel}</AccordionItemTrigger>
					<AccordionItemContent>
						{/* Type assertion to avoid React type conflict in project */}
						<div>
							{
								children as Parameters<
									typeof AccordionItemContent
								>[0]["children"]
							}
						</div>
					</AccordionItemContent>
				</AccordionItem>
			</Accordion>
		</div>
	) : (
		<>
			{title && <h2 className={titleStyles}>{title}</h2>}
			{children}
		</>
	);

	const Component = asWrapper ? "div" : "section";

	if (asWrapper) {
		return (
			<div className={finalClassName} data-module={moduleId}>
				{content}
			</div>
		);
	}

	return (
		<Component className={finalClassName} data-module={moduleId}>
			{content}
		</Component>
	);
}
