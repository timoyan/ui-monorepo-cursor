"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/core/api/graphqlClient";
import { queryKeys } from "@/core/query/keys";

export type DemoItem = {
	id: string;
	title: string;
	createdAt: string;
};

type DemosQueryResult = {
	demos: DemoItem[];
};

type CreateDemoMutationResult = {
	createDemo: DemoItem;
};

type CreateDemoMutationVariables = {
	title: string;
};

type DeleteDemoMutationResult = {
	deleteDemo: boolean;
};

type DeleteDemoMutationVariables = {
	id: string;
};

const DEMOS_QUERY = gql`
	query DemosQuery {
		demos {
			id
			title
			createdAt
		}
	}
`;

const CREATE_DEMO_MUTATION = gql`
	mutation CreateDemoMutation($title: String!) {
		createDemo(title: $title) {
			id
			title
			createdAt
		}
	}
`;

const DELETE_DEMO_MUTATION = gql`
	mutation DeleteDemoMutation($id: ID!) {
		deleteDemo(id: $id)
	}
`;

export function useDemosQuery() {
	return useQuery({
		queryKey: queryKeys.demos,
		queryFn: async () => {
			const result = await graphqlClient.request<DemosQueryResult>(DEMOS_QUERY);
			return result.demos;
		},
	});
}

export function useCreateDemoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ title }: CreateDemoMutationVariables) => {
			const result = await graphqlClient.request<
				CreateDemoMutationResult,
				CreateDemoMutationVariables
			>(CREATE_DEMO_MUTATION, { title });
			return result.createDemo;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: queryKeys.demos });
		},
	});
}

export function useDeleteDemoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id }: DeleteDemoMutationVariables) => {
			const result = await graphqlClient.request<
				DeleteDemoMutationResult,
				DeleteDemoMutationVariables
			>(DELETE_DEMO_MUTATION, { id });
			return result.deleteDemo;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: queryKeys.demos });
		},
	});
}
