"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	useCreateDemoMutation,
	useDeleteDemoMutation,
	useDemosQuery,
} from "@/core/query/hooks/useDemoQueries";
import { styled } from "@/styled-system/jsx";

const Wrap = styled("div", {
	base: {
		display: "grid",
		gap: "3",
	},
});

const Row = styled("div", {
	base: {
		display: "flex",
		flexWrap: "wrap",
		gap: "2",
		alignItems: "center",
	},
});

const Input = styled("input", {
	base: {
		minW: "12rem",
		flex: "1 1 12rem",
		borderWidth: "1px",
		borderColor: "gray.300",
		borderRadius: "md",
		px: "3",
		py: "2",
		fontSize: "sm",
	},
});

const List = styled("ul", {
	base: {
		listStyle: "none",
		display: "grid",
		gap: "2",
	},
});

const ListItem = styled("li", {
	base: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: "2",
		borderWidth: "1px",
		borderColor: "gray.200",
		borderRadius: "md",
		px: "3",
		py: "2",
		bg: "white",
	},
});

const Meta = styled("p", {
	base: {
		fontSize: "sm",
		color: "gray.600",
	},
});

export function GraphqlQueryDemo() {
	const [newTitle, setNewTitle] = useState("");
	const demosQuery = useDemosQuery();
	const createDemoMutation = useCreateDemoMutation();
	const deleteDemoMutation = useDeleteDemoMutation();

	const isBusy = createDemoMutation.isPending || deleteDemoMutation.isPending;

	const submitCreate = async () => {
		const title = newTitle.trim();
		if (!title) return;
		await createDemoMutation.mutateAsync({ title });
		setNewTitle("");
	};

	return (
		<Wrap>
			<Row>
				<Input
					value={newTitle}
					onChange={(event) => setNewTitle(event.target.value)}
					placeholder="Add demo title"
					aria-label="Add demo title"
				/>
				<Button
					variant="primary"
					size="sm"
					onClick={() => void submitCreate()}
					disabled={isBusy}
				>
					Add
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => void demosQuery.refetch()}
					disabled={demosQuery.isFetching || isBusy}
				>
					Refetch
				</Button>
			</Row>

			{demosQuery.isLoading ? <Meta>Loading demos...</Meta> : null}
			{demosQuery.isError ? (
				<Meta>Failed to load demos: {demosQuery.error.message}</Meta>
			) : null}

			{demosQuery.data ? (
				<List>
					{demosQuery.data.map((demo) => (
						<ListItem key={demo.id}>
							<span>{demo.title}</span>
							<Button
								variant="secondary"
								size="sm"
								onClick={() =>
									void deleteDemoMutation.mutateAsync({ id: demo.id })
								}
								disabled={isBusy}
							>
								Delete
							</Button>
						</ListItem>
					))}
				</List>
			) : null}

			<Meta>
				Server data uses TanStack Query cache with background refetch and
				localStorage persistence.
			</Meta>
		</Wrap>
	);
}
