import { Link } from "@paretojs/core";
import { css } from "@/styled-system/css";

const wrapClass = css({
	minH: "60vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	px: "6",
	textAlign: "center",
});

const codeClass = css({
	fontSize: "6xl",
	fontWeight: "bold",
	color: "gray.200",
	mb: "4",
});

const textClass = css({
	color: "gray.600",
	mb: "8",
});

const linkClass = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	h: "10",
	px: "5",
	borderRadius: "md",
	bg: "gray.900",
	color: "white",
	fontSize: "sm",
	fontWeight: "medium",
	textDecoration: "none",
	_hover: { bg: "gray.700" },
});

export default function NotFound() {
	return (
		<div className={wrapClass}>
			<span className={codeClass}>404</span>
			<p className={textClass}>This page could not be found.</p>
			<Link href="/" className={linkClass}>
				Go home
			</Link>
		</div>
	);
}
