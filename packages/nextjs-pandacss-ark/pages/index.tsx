import Head from "next/head";
import { css } from "@/styled-system/css";
import {
	Accordion,
	AccordionItem,
	AccordionItemTrigger,
	AccordionItemContent,
	Button,
} from "@/components";
import { ConnectedCartSample } from "@/features/cart";

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

const sectionStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1rem",
	w: "full",
	maxW: "md",
});

const rowStyles = css({
	display: "flex",
	gap: "1rem",
	flexWrap: "wrap",
	justifyContent: "center",
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

				<section className={sectionStyles}>
					<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
						Button – variant + size
					</h2>
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
				</section>

				<section className={sectionStyles}>
					<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
						Button – fullWidth + disabled
					</h2>
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
				</section>

				<ConnectedCartSample />

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
			</main>
		</>
	);
}
