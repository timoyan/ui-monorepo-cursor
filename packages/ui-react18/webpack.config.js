const path = require("node:path");
const _webpack = require("webpack");
const fs = require("node:fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

class AggregateCssPlugin {
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("AggregateCssPlugin", (compilation) => {
			const { Compilation } = compiler.webpack;
			const stage = Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;
			compilation.hooks.processAssets.tap(
				{ name: "AggregateCssPlugin", stage },
				(assets) => {
					// Concatenate component CSS into main/main.css
					const sources = [];
					const readAsset = (name) => {
						const asset = compilation.getAsset(name);
						return asset ? asset.source.source().toString() : "";
					};
					const candidates = [
						"Button/index.css",
						"Card/index.css",
						"Modal/index.css",
						"Toast/index.css",
					];
					for (const file of candidates) {
						if (assets[file]) {
							sources.push(readAsset(file));
						}
					}
					const combined = sources.filter(Boolean).join("\n\n");
					compilation.emitAsset(
						"main/main.css",
						new compiler.webpack.sources.RawSource(combined),
					);
				},
			);
		});
	}
}

module.exports = (_env, argv) => {
	const isProduction = argv.mode === "production";

	return {
		// Enable ES modules output for tree-shaking
		experiments: {
			outputModule: true,
		},
		// Create separate entry points for each component to make them independent
		entry: {
			"Button/index": "./src/ui/Button/index.ts",
			"Card/index": "./src/ui/Card/index.ts",
			"Modal/index": "./src/ui/Modal/index.ts",
			"Toast/index": "./src/ui/Toast/index.ts",
			main: "./src/ui/index.ts", // Optional: main entry for all components
		},
		output: {
			path: path.resolve(__dirname, "build"),
			// Output ES modules format for tree-shaking support
			module: true,
			library: {
				type: "module",
			},
			environment: {
				module: true,
			},
			filename: (pathData) => {
				const chunkName = pathData.chunk.name;
				const hash = "";

				// Handle entry points like 'Button/index' -> 'Button/index.js'
				if (chunkName?.includes("/")) {
					return `${chunkName}${hash}.js`;
				}

				// Check if it's a UI component chunk (Button, Card, etc.)
				if (
					chunkName &&
					chunkName !== "index" &&
					chunkName !== "vendor" &&
					chunkName !== "common"
				) {
					return `${chunkName}/${chunkName}${hash}.js`;
				}

				// Default structure for other chunks
				return isProduction ? "[name].js" : "[name].js";
			},
			chunkFilename: (pathData) => {
				const chunkName = pathData.chunk.name;
				if (
					chunkName &&
					chunkName !== "index" &&
					chunkName !== "vendor" &&
					chunkName !== "common"
				) {
					const hash = "";
					return `${chunkName}/${chunkName}${hash}.chunk.js`;
				}
				return isProduction ? "[name].chunk.js" : "[name].chunk.js";
			},
			assetModuleFilename: "static/media/[name][ext]",
			clean: true,
			publicPath: "/",
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
		},
		externals: [
			// React externals
			{
				react: "react",
				"react-dom": "react-dom",
				"react/jsx-runtime": "react/jsx-runtime",
				"react/jsx-dev-runtime": "react/jsx-dev-runtime",
			},
			// Cross-entry externalization: src/ui/<A> importing src/ui/<B> → rewrite to ../B/index.js
			({ context, request }, callback) => {
				const uiRoot = path.resolve(__dirname, "src/ui");
				if (!context || !request) return callback();
				const fromDir = path.normalize(context);
				// Only handle relative imports inside src/ui/*
				if (!fromDir.startsWith(uiRoot)) return callback();
				if (!(request.startsWith("./") || request.startsWith("../")))
					return callback();
				const absTarget = path.normalize(path.resolve(fromDir, request));
				if (!absTarget.startsWith(uiRoot)) return callback();
				const fromComp = path.relative(uiRoot, fromDir).split(path.sep)[0];
				const toComp = path.relative(uiRoot, absTarget).split(path.sep)[0];
				if (!toComp || toComp === fromComp) return callback();
				// Validate target component directory and its entry file
				const toCompDir = path.join(uiRoot, toComp);
				if (
					!fs.existsSync(toCompDir) ||
					!fs.statSync(toCompDir).isDirectory()
				) {
					return callback();
				}
				const toIndexJs = path.join(toCompDir, "index.js");
				const toIndexJsx = path.join(toCompDir, "index.jsx");
				const toIndexTs = path.join(toCompDir, "index.ts");
				const toIndexTsx = path.join(toCompDir, "index.tsx");
				if (
					!(
						fs.existsSync(toIndexJs) ||
						fs.existsSync(toIndexJsx) ||
						fs.existsSync(toIndexTs) ||
						fs.existsSync(toIndexTsx)
					)
				) {
					return callback();
				}
				// Externalize to sibling built entry
				const rewritten = `../${toComp}/index.js`;
				return callback(null, rewritten);
			},
		],
		module: {
			rules: [
				{
					test: /\.(ts|tsx|js|jsx)$/,
					exclude: [
						/node_modules/,
						/\.test\.(ts|tsx|js|jsx)$/,
						/\.spec\.(ts|tsx|js|jsx)$/,
						/\.stories\.(ts|tsx|js|jsx)$/,
						/test-setup\.(ts|tsx|js|jsx)$/,
					],
					use: [
						{
							loader: "babel-loader",
							// Babel config will be read from .babelrc
						},
						{
							loader: "@wyw-in-js/webpack-loader",
							options: {
								sourceMap: !isProduction,
								configFile: "./wyw-in-js.config.js",
							},
						},
					],
				},
				// Regular CSS files (including Linaria-generated CSS)
				{
					test: /\.css$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : "style-loader",
						"css-loader",
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg|ico)$/i,
					type: "asset/resource",
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: "asset/resource",
				},
			],
		},
		plugins: [
			...(isProduction
				? [
						new MiniCssExtractPlugin({
							filename: (pathData) => {
								const chunkName = pathData.chunk.name;
								const hash = "";

								// Handle entry points like 'Button/index' -> 'Button/index.css'
								if (chunkName?.includes("/")) {
									return `${chunkName}${hash}.css`;
								}

								// Check if it's a UI component chunk (Button, Card, etc.)
								if (
									chunkName &&
									chunkName !== "index" &&
									chunkName !== "vendor" &&
									chunkName !== "common"
								) {
									return `${chunkName}/${chunkName}${hash}.css`;
								}

								// Default structure for other chunks
								return isProduction ? "[name].css" : "[name].css";
							},
							chunkFilename: (pathData) => {
								const chunkName = pathData.chunk.name;
								const hash = "";

								// Handle entry points like 'Button/index' -> 'Button/index.css'
								if (chunkName?.includes("/")) {
									return `${chunkName}${hash}.css`;
								}

								if (
									chunkName &&
									chunkName !== "index" &&
									chunkName !== "vendor" &&
									chunkName !== "common"
								) {
									return `${chunkName}/${chunkName}${hash}.css`;
								}
								return isProduction ? "[name].css" : "[name].css";
							},
							ignoreOrder: true,
						}),
						new AggregateCssPlugin(),
					]
				: []),
		],

		// Generate source maps for both production and development
		// Production: separate .map files for better debugging
		// Development: inline source maps for faster builds
		devtool: isProduction ? "source-map" : "eval-source-map",
		optimization: {
			minimize: isProduction,
			usedExports: true, // Enable tree-shaking
			sideEffects: true, // Check sideEffects in package.json
			splitChunks: false, // Disable code splitting for ES modules output
		},
	};
};
