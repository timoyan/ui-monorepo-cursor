import type { JSX } from "module-library";
import { MyButton as BaseMyButton } from "module-library/react";
import type { HTMLAttributes, ReactNode } from "react";

// 包裝組件，處理 SSR hydration 警告
// 注意：suppressHydrationWarning 只能抑制該元素及其直接子元素的警告
// 對於 Web Component，警告來自 my-button 元素本身，所以需要在其父元素上使用
export const MyButton = (
	props: JSX.MyButton &
		HTMLAttributes<HTMLElement> & {
			suppressHydrationWarning?: boolean;
			children?: ReactNode;
		},
) => {
	const { suppressHydrationWarning, children, ...rest } = props;

	// 使用 span 包裝，設置 suppressHydrationWarning
	// 這會抑制該元素及其子元素（包括 my-button）的 hydration 警告
	return (
		<span suppressHydrationWarning style={{ display: "inline-block" }}>
			<BaseMyButton {...rest}>{children}</BaseMyButton>
		</span>
	);
};
