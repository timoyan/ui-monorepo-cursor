import { setupWorker } from "msw/browser";
import { devHandlers } from "./handlers";

export const worker = setupWorker(...devHandlers);
