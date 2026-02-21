import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Head, Html, Main, NextScript } from "next/document";

/**
 * Custom Head component that prevents CSS link tags when CSS is inlined
 *
 * This only prevents Next.js-generated CSS links when we've successfully inlined
 * the CSS. Third-party CSS files imported via `import 'library.css'` will still
 * be loaded normally through Next.js's default behavior.
 */
class InlineStylesHead extends Head {
	getCssLinks(files: {
		sharedFiles: readonly string[];
		pageFiles: readonly string[];
		allFiles: readonly string[];
	}) {
		// If CSS is inlined, return empty array to prevent duplicate CSS loading
		// This only affects Next.js-generated CSS links, not third-party CSS
		// @ts-expect-error - accessing private property for CSS inlining check
		if (this.props.__cssInlined) {
			return [];
		}
		// Otherwise, use default behavior to allow all CSS files (including third-party)
		// to be loaded normally via external link tags
		return super.getCssLinks(files);
	}
}

/**
 * Custom Document to inline critical CSS for SSR
 *
 * This ensures CSS is available immediately during SSR, preventing FOUC
 * (Flash of Unstyled Content). The CSS file is read at build time and
 * inlined into the HTML.
 *
 * Note: This is optional. PandaCSS works fine with external CSS links.
 * Use this only if you need to eliminate FOUC completely.
 */
export default function Document() {
	// Read the generated CSS file at build time
	// Only inline CSS in production to avoid dev mode issues (file timing, hot reload)
	let cssContent = "";
	if (process.env.NODE_ENV === "production") {
		try {
			const cssPath = join(process.cwd(), ".next/static/css");
			if (existsSync(cssPath)) {
				const cssFiles = readdirSync(cssPath).filter((file: string) =>
					file.endsWith(".css"),
				);
				if (cssFiles.length > 0) {
					cssContent = readFileSync(join(cssPath, cssFiles[0]), "utf8");
				}
			}
		} catch (_error) {
			// Fallback: CSS will load via external link if read fails
			// This is fine - Next.js will still include the CSS link tag
		}
	}

	return (
		<Html lang="en">
			<InlineStylesHead {...(cssContent ? { __cssInlined: true } : {})}>
				{cssContent && (
					<style
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Inline CSS for SSR performance
						dangerouslySetInnerHTML={{ __html: cssContent }}
						data-panda-inline
					/>
				)}
				{/* Third-party CSS - should load normally even when CSS is inlined */}
				{/* <link
					rel="stylesheet"
					href="https://github.githubassets.com/assets/dark-b5a0f9dbeed37e9c.css"
					crossOrigin="anonymous"
				/> */}
			</InlineStylesHead>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
