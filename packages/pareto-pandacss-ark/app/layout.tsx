import { Link } from "@paretojs/core";
import type { PropsWithChildren } from "react";
import { AppToaster } from "@/components/ui/toast";
import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";

const Shell = styled("div", {
	base: {
		minH: "100vh",
		bg: "gray.50",
		color: "gray.900",
	},
});

const TopBar = styled("header", {
	base: {
		borderBottomWidth: "1px",
		borderColor: "gray.200",
		bg: "white",
		px: { base: "4", md: "8" },
		py: "3",
	},
});

const TopBarInner = styled("div", {
	base: {
		maxW: "6xl",
		mx: "auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "4",
	},
});

const brandLinkClass = css({
	fontSize: "lg",
	fontWeight: "bold",
	color: "blue.600",
	textDecoration: "none",
	_hover: { color: "blue.700" },
});

const navLinkClass = css({
	fontSize: "sm",
	fontWeight: "medium",
	color: "gray.600",
	textDecoration: "none",
	_hover: { color: "gray.900" },
});

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<Shell>
			<TopBar>
				<TopBarInner>
					<Link href="/" className={brandLinkClass}>
						pareto-pandacss-ark
					</Link>
					<Link href="/" className={navLinkClass}>
						Home
					</Link>
				</TopBarInner>
			</TopBar>
			<main>{children}</main>
			<AppToaster />
		</Shell>
	);
}
