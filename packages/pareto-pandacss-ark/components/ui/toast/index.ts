/**
 * Re-export toast APIs from core/toast. External usage must go through useToast() only.
 */

export type { RegisterAndToastOptions } from "@/core/toast";
export { AppToaster, registerToastContent, useToast } from "@/core/toast";
