import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useModuleAccordion } from "@/core/hooks";

describe("useModuleAccordion", () => {
	describe("initial state", () => {
		it("returns openModuleId null when no options", () => {
			const { result } = renderHook(() => useModuleAccordion());
			expect(result.current.openModuleId).toBeNull();
			expect(result.current.isOpen("a")).toBe(false);
		});

		it("uses initialOpenModuleId when provided", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			expect(result.current.openModuleId).toBe("a");
			expect(result.current.isOpen("a")).toBe(true);
			expect(result.current.isOpen("b")).toBe(false);
		});
	});

	describe("getValue / getOnValueChange", () => {
		it('getValue returns ["module-content"] when module is open, [] otherwise', () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			expect(result.current.getValue("a")).toEqual(["module-content"]);
			expect(result.current.getValue("b")).toEqual([]);
		});

		it("getOnValueChange opens module when value includes module-content", () => {
			const { result } = renderHook(() => useModuleAccordion());
			expect(result.current.openModuleId).toBeNull();

			act(() => {
				result.current.getOnValueChange("a")({
					value: ["module-content"],
				});
			});
			expect(result.current.openModuleId).toBe("a");
		});

		it("getOnValueChange closes module when value does not include module-content", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.getOnValueChange("a")({ value: [] });
			});
			expect(result.current.openModuleId).toBeNull();
		});
	});

	describe("openModule / closeModule", () => {
		it("openModule sets open module and closes others", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.openModule("b");
			});
			expect(result.current.openModuleId).toBe("b");
			expect(result.current.isOpen("a")).toBe(false);
			expect(result.current.isOpen("b")).toBe(true);
		});

		it("closeModule closes only the given module", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.closeModule("a");
			});
			expect(result.current.openModuleId).toBeNull();
		});

		it("closeModule does nothing when module is not open", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.closeModule("b");
			});
			expect(result.current.openModuleId).toBe("a");
		});
	});

	describe("toggleModule", () => {
		it("opens module when closed", () => {
			const { result } = renderHook(() => useModuleAccordion());
			act(() => {
				result.current.toggleModule("a");
			});
			expect(result.current.openModuleId).toBe("a");
		});

		it("closes module when open", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.toggleModule("a");
			});
			expect(result.current.openModuleId).toBeNull();
		});

		it("switches to other module when toggling different module", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.toggleModule("b");
			});
			expect(result.current.openModuleId).toBe("b");
		});
	});

	describe("closeAll", () => {
		it("sets openModuleId to null", () => {
			const { result } = renderHook(() =>
				useModuleAccordion({ initialOpenModuleId: "a" }),
			);
			act(() => {
				result.current.closeAll();
			});
			expect(result.current.openModuleId).toBeNull();
		});
	});

	describe("shouldOpen + data", () => {
		it("syncs state when shouldOpen returns a module ID", () => {
			const shouldOpen = (data: unknown) =>
				(data as { open?: string })?.open ?? null;
			const { result, rerender } = renderHook(
				({ data }) =>
					useModuleAccordion({
						shouldOpen,
						data,
					}),
				{ initialProps: { data: { open: "c" } } },
			);
			expect(result.current.openModuleId).toBe("c");
			expect(result.current.isOpen("c")).toBe(true);

			rerender({ data: { open: "b" } });
			expect(result.current.openModuleId).toBe("b");
		});

		it("does not force-close when shouldOpen returns null (user control)", () => {
			const shouldOpen = (data: unknown) =>
				(data as { open?: string })?.open ?? null;
			type Props = { data: { open?: string } };
			const { result, rerender } = renderHook<
				ReturnType<typeof useModuleAccordion>,
				Props
			>(
				({ data }) =>
					useModuleAccordion({
						shouldOpen,
						data,
					}),
				{ initialProps: { data: { open: "a" } } },
			);
			expect(result.current.openModuleId).toBe("a");

			// User opens "b"
			act(() => {
				result.current.openModule("b");
			});
			expect(result.current.openModuleId).toBe("b");

			// shouldOpen returns null – state is not forced to null
			rerender({ data: { open: undefined } });
			expect(result.current.openModuleId).toBe("b");
		});
	});
});
