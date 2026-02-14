import Head from "next/head";
import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import {
	AccordionRoot,
	AccordionItem,
	AccordionItemTrigger,
	AccordionItemContent,
} from "@ark-ui/react/accordion";

const containerStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "2rem",
	p: "2rem",
	minH: "100vh",
});

const headingStyles = css({
	fontSize: "2xl",
	fontWeight: "bold",
});

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
			_hover: { bg: "gray.50" },
		},
		"& [data-part=item-content]": {
			px: 4,
			pb: 4,
			color: "gray.600",
		},
		"& [data-part=item-content][data-state=open]": {
			bg: "gray.600",
			color: "white",
		},
	},
});

export default function Home() {
	return (
		<>
			<Head>
				<title>Next.js + PandaCSS + Ark UI</title>
			</Head>
			<main className={containerStyles}>
				<h1 className={headingStyles}>Next.js + PandaCSS + Ark UI</h1>
				<p className={css({ color: "gray.600" })}>
					Tech stack: Next.js · PandaCSS · Ark UI
				</p>
				<StyledAccordionRoot defaultValue={["item-1"]}>
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
				</StyledAccordionRoot>
			</main>
		</>
	);
}
