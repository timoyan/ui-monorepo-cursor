"use client";

import { Button } from "@/components/ui/button";
import { registerToastContent, useToast } from "@/core/toast";
import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";

registerToastContent("success-html", {
	title: "HTML in toast",
	description: (
		<span>
			You can use <strong>bold</strong> and <em>italic</em> from the registry.
		</span>
	),
	icon: (
		<span aria-hidden style={{ marginRight: "0.5rem" }}>
			📄
		</span>
	),
});

const DemoRow = styled("div", {
	base: {
		display: "flex",
		flexWrap: "wrap",
		gap: "0.75rem",
		alignItems: "center",
	},
});

const inlineTriggerClass = css({
	marginLeft: "0.25rem",
	textDecoration: "underline",
	cursor: "pointer",
	background: "transparent",
	border: "none",
	padding: 0,
	font: "inherit",
	color: "inherit",
});

function DynamicToastDescription({
	at,
	onTriggerAnother,
}: {
	at: string;
	onTriggerAnother?: () => void;
}) {
	return (
		<span>
			One-time toast created at <strong>{at}</strong>. Dismiss to unregister.
			{onTriggerAnother ? (
				<>
					{" "}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onTriggerAnother();
						}}
						className={inlineTriggerClass}
					>
						Trigger another toast
					</button>
				</>
			) : null}
		</span>
	);
}

export function ToastDemo() {
	const { toast, registerAndToast } = useToast();

	const showSecondToast = () => {
		registerAndToast(
			{
				title: "Second toast",
				description: "Triggered from inside the first toast.",
				icon: (
					<span aria-hidden style={{ marginRight: "0.5rem" }}>
						🔔
					</span>
				),
			},
			{ type: "success", unregisterOnDismiss: true },
		);
	};

	const showDynamicToast = () => {
		const at = new Date().toLocaleTimeString();
		registerAndToast(
			{
				title: "Dynamic toast (React component)",
				description: (
					<DynamicToastDescription at={at} onTriggerAnother={showSecondToast} />
				),
				icon: (
					<span aria-hidden style={{ marginRight: "0.5rem" }}>
						🔄
					</span>
				),
			},
			{ type: "error", unregisterOnDismiss: true },
		);
	};

	return (
		<DemoRow>
			<Button
				variant="primary"
				size="sm"
				onClick={() =>
					toast.success({
						title: "Success",
						description: "Plain text from event handler.",
					})
				}
			>
				Success toast
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.info({
						title: "Info",
						description: "Centralized toast from Pareto app.",
					})
				}
			>
				Info toast
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.success({
						title: "Registry fallback",
						meta: { contentKey: "success-with-icon" },
					})
				}
			>
				Toast (registry icon)
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.success({
						title: "Registry fallback",
						meta: { contentKey: "success-html" },
					})
				}
			>
				Toast (registry HTML)
			</Button>
			<Button variant="secondary" size="sm" onClick={showDynamicToast}>
				Toast (dynamic React)
			</Button>
		</DemoRow>
	);
}
