import pandaCss from "../global.css?inline";

export default function Head() {
	return (
		<>
			{/* Panda entry CSS is inlined so the first HTML shell includes layers + utilities (avoids FOUC). */}
			<style
				data-panda-entry
				// biome-ignore lint/security/noDangerouslySetInnerHtml: bundled Panda CSS at build time, not user HTML
				dangerouslySetInnerHTML={{ __html: pandaCss }}
			/>
			<title>Pareto + Panda CSS + Ark UI</title>
			<meta
				name="description"
				content="Example app: Pareto SSR with Panda CSS and Ark UI components."
			/>
		</>
	);
}
