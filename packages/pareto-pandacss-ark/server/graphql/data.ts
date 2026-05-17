export interface Demo {
	id: string;
	title: string;
	createdAt: string;
}

let demos: Demo[] = [
	{
		id: "1",
		title: "Welcome demo",
		createdAt: new Date().toISOString(),
	},
];

let nextId = 2;

export function listDemos(): Demo[] {
	return [...demos];
}

export function getDemoById(id: string): Demo | undefined {
	return demos.find((demo) => demo.id === id);
}

export function createDemo(title: string): Demo {
	const demo: Demo = {
		id: String(nextId++),
		title,
		createdAt: new Date().toISOString(),
	};
	demos = [...demos, demo];
	return demo;
}

export function deleteDemo(id: string): boolean {
	const lengthBefore = demos.length;
	demos = demos.filter((demo) => demo.id !== id);
	return demos.length < lengthBefore;
}

/** Resets in-memory demos. For tests only. */
export function resetDemos(): void {
	demos = [
		{
			id: "1",
			title: "Welcome demo",
			createdAt: new Date().toISOString(),
		},
	];
	nextId = 2;
}
