import type { LoaderContext } from "@paretojs/core";
import { useLoaderData } from "@paretojs/core";
import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { styled } from "@/styled-system/jsx";

interface HomeData {
	message: string;
	stack: string;
}

const PageWrap = styled("div", {
	base: {
		maxW: "2xl",
		mx: "auto",
		px: { base: "4", md: "8" },
		py: "10",
	},
});

const Title = styled("h1", {
	base: {
		fontSize: "2xl",
		fontWeight: "bold",
		mb: "3",
		color: "gray.900",
	},
});

const Lead = styled("p", {
	base: {
		color: "gray.600",
		mb: "6",
		lineHeight: "relaxed",
	},
});

const Row = styled("div", {
	base: {
		display: "flex",
		flexWrap: "wrap",
		gap: "3",
		alignItems: "center",
	},
});

const Section = styled("section", {
	base: {
		mt: "10",
		pt: "8",
		borderTopWidth: "1px",
		borderColor: "gray.200",
	},
});

const SectionTitle = styled("h2", {
	base: {
		fontSize: "lg",
		fontWeight: "semibold",
		mb: "4",
		color: "gray.800",
	},
});

export function loader(_ctx: LoaderContext) {
	return {
		message: "Hello from the Pareto loader.",
		stack: "Pareto + Panda CSS + Ark UI",
	} satisfies HomeData;
}

export default function HomePage() {
	const data = useLoaderData<HomeData>();

	return (
		<PageWrap>
			<Title>{data.stack}</Title>
			<Lead>{data.message}</Lead>
			<Row>
				<Button variant="primary">Panda button</Button>
				<Button variant="secondary">Secondary</Button>
			</Row>
			<Section>
				<SectionTitle>Ark UI accordion (Panda styled)</SectionTitle>
				<Accordion id="home-demo-accordion" multiple defaultValue={["a"]}>
					<AccordionItem value="a">
						<AccordionItemTrigger>First item</AccordionItemTrigger>
						<AccordionItemContent>
							Content from the loader: {data.message}
						</AccordionItemContent>
					</AccordionItem>
					<AccordionItem value="b">
						<AccordionItemTrigger>Second item</AccordionItemTrigger>
						<AccordionItemContent>
							Keyboard-accessible disclosure pattern via Ark UI.
						</AccordionItemContent>
					</AccordionItem>
				</Accordion>
			</Section>
		</PageWrap>
	);
}
