/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// 編譯 module-library 的 React 組件（TypeScript 文件）
	transpilePackages: ["module-library"],
	// Next.js 已經內建 CSS 處理，無需額外配置
};

module.exports = nextConfig;
