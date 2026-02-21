import { styled } from "@linaria/react";
import type React from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";

const StyledDialog = styled.dialog`
  padding: 0;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  width: 500px;
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  &:not([open]) {
    display: none;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #212529;
`;

const ModalBody = styled.div`
  padding: 24px;
  color: #495057;
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-shrink: 0;
`;

export interface ModalProps
	extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
	open?: boolean;
	onClose?: () => void;
	title?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
	className?: string;
	/**
	 * Allow closing modal with ESC key. Default: true
	 * ⚠️ Setting to false may impact accessibility - consider showing a confirmation instead
	 */
	closeOnEscape?: boolean;
	/**
	 * Allow closing modal by clicking backdrop. Default: true
	 */
	closeOnBackdropClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
	open = false,
	onClose,
	title,
	children,
	footer,
	className,
	closeOnEscape = true,
	closeOnBackdropClick = true,
	...props
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const isEscapeCloseRef = useRef(false);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
			isEscapeCloseRef.current = false;
		} else {
			// Only close if it wasn't an ESC-triggered close that we're blocking
			if (!(isEscapeCloseRef.current && !closeOnEscape)) {
				dialog.close();
			} else {
				// If it was ESC and we're blocking it, keep it open
				if (!dialog.open) {
					dialog.showModal();
				}
			}
		}
	}, [open, closeOnEscape]);

	// Handle native cancel event (ESC key) - prevent closing when closeOnEscape is false
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || !open) return;

		const handleNativeCancel = (e: Event) => {
			if (!closeOnEscape) {
				// Prevent the default behavior (closing the dialog)
				e.preventDefault();
				e.stopImmediatePropagation();
				isEscapeCloseRef.current = true;
				// Immediately ensure dialog stays open - check multiple times to catch any closing
				const keepOpen = () => {
					if (dialog && !dialog.open) {
						dialog.showModal();
					}
				};
				// Check immediately
				keepOpen();
				// Also check after current execution completes
				setTimeout(keepOpen, 0);
			} else {
				isEscapeCloseRef.current = false;
			}
		};

		// Intercept close event to immediately reopen if it was ESC-triggered
		const handleCloseEvent = () => {
			if (isEscapeCloseRef.current && !closeOnEscape && dialog) {
				// Immediately reopen - this happens synchronously to prevent visual closing
				const keepOpen = () => {
					if (dialog && !dialog.open) {
						dialog.showModal();
					}
				};
				keepOpen();
				// Also check after a microtask to catch any delayed closing
				Promise.resolve().then(keepOpen);
			}
		};

		// Use capture phase to intercept early, before default behavior
		dialog.addEventListener("cancel", handleNativeCancel, { capture: true });
		dialog.addEventListener("close", handleCloseEvent, { capture: true });

		return () => {
			dialog.removeEventListener("cancel", handleNativeCancel, {
				capture: true,
			});
			dialog.removeEventListener("close", handleCloseEvent, {
				capture: true,
			});
		};
	}, [closeOnEscape, open]);

	const handleClose = () => {
		// If this close was triggered by ESC and we don't allow ESC, prevent closing
		if (isEscapeCloseRef.current && !closeOnEscape) {
			const dialog = dialogRef.current;
			// Ensure dialog stays open - reopen immediately if it closed
			if (dialog && !dialog.open) {
				dialog.showModal();
			}
			// Don't call onClose - prevent the state update
			// Keep flag set for a short time to handle rapid ESC presses
			setTimeout(() => {
				isEscapeCloseRef.current = false;
			}, 100);
			return; // Exit early - don't call onClose
		}

		// Reset the flag for normal closes (programmatic or backdrop)
		isEscapeCloseRef.current = false;

		if (onClose) {
			onClose();
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		// Close modal when clicking on backdrop (the dialog element itself)
		if (closeOnBackdropClick && e.target === dialogRef.current) {
			handleClose();
		}
	};

	return (
		<StyledDialog
			ref={dialogRef}
			className={className}
			onClick={handleBackdropClick}
			onClose={handleClose}
			{...props}
		>
			<ModalContent>
				{title && (
					<ModalHeader>
						<ModalTitle>{title}</ModalTitle>
					</ModalHeader>
				)}
				<ModalBody>{children}</ModalBody>
				{footer && <ModalFooter>{footer}</ModalFooter>}
			</ModalContent>
		</StyledDialog>
	);
};
