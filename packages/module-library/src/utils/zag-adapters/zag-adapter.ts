/**
 * Zag.js 適配器工具
 * 用於在 Stencil 組件中使用 Zag.js 狀態機
 */

export interface ZagAdapterOptions<T = unknown> {
	onStateChange?: (state: T) => void;
}

/**
 * 創建 Zag.js 適配器
 * 用於在 Stencil 組件中整合 Zag.js 狀態機
 */
export function createZagAdapter<TState, TEvent = unknown>(
	_machine: unknown,
	_options?: ZagAdapterOptions<TState>,
): {
	state: TState;
	send: (event: TEvent) => void;
} {
	// 這裡將在實際使用 Zag.js 時實現
	// 目前作為佔位符
	return {
		state: {} as TState,
		send: () => {},
	};
}
