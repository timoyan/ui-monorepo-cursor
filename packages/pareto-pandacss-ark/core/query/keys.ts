export const queryKeys = {
	demos: ["demos"] as const,
	demo: (id: string) => ["demo", id] as const,
};
