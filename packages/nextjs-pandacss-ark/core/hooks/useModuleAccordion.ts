import { useCallback, useEffect, useMemo, useState } from "react";

interface UseModuleAccordionOptions {
	/**
	 * Initial open module ID
	 */
	initialOpenModuleId?: string | null;
	/**
	 * Function to determine which module should be open based on current data.
	 * Returns the module ID to open, or null if none should be open.
	 * Re-runs when data changes to update state.
	 */
	shouldOpen?: (data?: unknown) => string | null;
	/**
	 * Data passed to shouldOpen. When this changes, shouldOpen is re-run to decide whether to open a module.
	 */
	data?: unknown;
}

/**
 * Hook to manage module accordion expand/collapse state.
 *
 * Provides accordion behavior: when one module opens, others close automatically.
 *
 * @param options Configuration options
 * @returns Current open module ID and control functions
 */
export function useModuleAccordion(options?: UseModuleAccordionOptions) {
	const { initialOpenModuleId = null, shouldOpen, data } = options ?? {};

	// Compute which module should be open from shouldOpen and data
	const computedOpenModuleId = useMemo(() => {
		if (shouldOpen) {
			return shouldOpen(data);
		}
		return null;
	}, [shouldOpen, data]);

	const [openModuleId, setOpenModuleId] = useState<string | null>(
		computedOpenModuleId ?? initialOpenModuleId,
	);

	// When computedOpenModuleId changes, sync state. If shouldOpen returns non-null, open that module; if null, do not force-close (allow user control).
	useEffect(() => {
		if (shouldOpen && computedOpenModuleId !== null) {
			setOpenModuleId(computedOpenModuleId);
		}
	}, [shouldOpen, computedOpenModuleId]);

	/**
	 * Check whether the given module is open
	 */
	const isOpen = useCallback(
		(moduleId: string) => {
			return openModuleId === moduleId;
		},
		[openModuleId],
	);

	/**
	 * Open the given module (closes others automatically)
	 */
	const openModule = useCallback((moduleId: string) => {
		setOpenModuleId(moduleId);
	}, []);

	/**
	 * Close the given module
	 */
	const closeModule = useCallback((moduleId: string) => {
		setOpenModuleId((current) => (current === moduleId ? null : current));
	}, []);

	/**
	 * Toggle the given module open/closed
	 */
	const toggleModule = useCallback((moduleId: string) => {
		setOpenModuleId((current) => (current === moduleId ? null : moduleId));
	}, []);

	/**
	 * Close all modules
	 */
	const closeAll = useCallback(() => {
		setOpenModuleId(null);
	}, []);

	/**
	 * Get Accordion value prop for the given module. Returns ["module-content"] when open, [] otherwise.
	 */
	const getValue = useCallback(
		(moduleId: string): string[] => {
			return isOpen(moduleId) ? ["module-content"] : [];
		},
		[isOpen],
	);

	/**
	 * Get Accordion onValueChange handler for the given module
	 */
	const getOnValueChange = useCallback(
		(moduleId: string) => {
			return (details: { value: string[] }) => {
				if (details.value.includes("module-content")) {
					openModule(moduleId);
				} else {
					closeModule(moduleId);
				}
			};
		},
		[openModule, closeModule],
	);

	return {
		/** Currently open module ID, or null if none */
		openModuleId,
		/** Check if the given module is open */
		isOpen,
		/** Open the given module */
		openModule,
		/** Close the given module */
		closeModule,
		/** Toggle the given module open/closed */
		toggleModule,
		/** Close all modules */
		closeAll,
		/** Get Accordion value for the given module */
		getValue,
		/** Get Accordion onValueChange handler for the given module */
		getOnValueChange,
	};
}
