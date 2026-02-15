import { css } from "@/styled-system/css";
import { Button } from "@/components";
import { useLazyGetTodoQuery } from "@/apis/todo";

const sectionStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1rem",
	w: "full",
	maxW: "md",
});

const todoCardStyles = css({
	w: "full",
	maxW: "md",
	p: 4,
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "gray.200",
	bg: "gray.50",
});

const todoErrorCardStyles = css({
	w: "full",
	maxW: "md",
	p: 4,
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "red.300",
	bg: "red.50",
	color: "red.700",
});

export function TodoSample() {
	const [trigger, { data, isLoading, error, isUninitialized }] =
		useLazyGetTodoQuery();

	const TodoHeader = () => (
		<div
			className={css({
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				w: "full",
				gap: 2,
			})}
		>
			<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
				Todo API (JSONPlaceholder)
			</h2>
			<Button
				variant="secondary"
				size="sm"
				onClick={() => trigger("1")}
				disabled={isLoading}
			>
				{isLoading ? "Loading…" : "Fetch"}
			</Button>
		</div>
	);

	if (isUninitialized) {
		return (
			<section className={sectionStyles}>
				<TodoHeader />
				<div
					className={css({
						w: "full",
						maxW: "md",
						p: 4,
						borderRadius: "md",
						borderWidth: "1px",
						borderColor: "gray.200",
						bg: "gray.50",
						color: "gray.500",
						fontStyle: "italic",
					})}
				>
					Click Fetch to load todo
				</div>
			</section>
		);
	}

	if (isLoading) {
		return (
			<section className={sectionStyles}>
				<TodoHeader />
				<div className={todoCardStyles}>Loading…</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className={sectionStyles}>
				<TodoHeader />
				<div className={todoErrorCardStyles}>Failed to load todo</div>
			</section>
		);
	}

	return (
		<section className={sectionStyles}>
			<TodoHeader />
			<div className={todoCardStyles}>
				<p className={css({ fontWeight: "semibold", mb: 2 })}>{data?.title}</p>
				<p className={css({ fontSize: "sm", color: "gray.600" })}>
					ID: {data?.id} · User: {data?.userId} ·{" "}
					{data?.completed ? "Completed" : "Not completed"}
				</p>
			</div>
		</section>
	);
}
