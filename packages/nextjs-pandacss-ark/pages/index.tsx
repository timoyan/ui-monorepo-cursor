import Head from "next/head";
import { css } from "@/styled-system/css";
import {
	ModuleA,
	ModuleBVariantSize,
	ModuleBFullWidthDisabled,
	ModuleC,
} from "@/modules";
import { ModuleContainer } from "@/components/layout/module-container";
import { useModuleAccordion } from "@/core/hooks";

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

export default function Home() {
	const { getValue, getOnValueChange } = useModuleAccordion();

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

				<ModuleContainer
					moduleId="a"
					title="Accordion example"
					collapsible
					value={getValue("a")}
					onValueChange={getOnValueChange("a")}
				>
					<ModuleA />
				</ModuleContainer>

				<ModuleContainer
					moduleId="b-1"
					title="Button – variant + size"
					collapsible
					value={getValue("b-1")}
					onValueChange={getOnValueChange("b-1")}
				>
					<ModuleBVariantSize />
				</ModuleContainer>

				<ModuleContainer
					moduleId="b-2"
					title="Button – fullWidth + disabled"
					collapsible
					value={getValue("b-2")}
					onValueChange={getOnValueChange("b-2")}
				>
					<ModuleBFullWidthDisabled />
				</ModuleContainer>

				<ModuleContainer
					moduleId="c"
					title="Cart"
					asWrapper
					collapsible
					value={getValue("c")}
					onValueChange={getOnValueChange("c")}
				>
					<ModuleC />
				</ModuleContainer>
			</main>
		</>
	);
}
