import { useState, useEffect } from "react";
import { css } from "@/styled-system/css";
import { Button } from "@/components/ui/button";
import {
	useGetCartQuery,
	useAddToCartMutation,
	useUpdateQuantityMutation,
	useRemoveFromCartMutation,
} from "@/apis/cart";
import type { CartItem } from "@/apis/cart";

const sectionStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1rem",
	w: "full",
	maxW: "md",
});

const listStyles = css({
	w: "full",
	display: "flex",
	flexDirection: "column",
	gap: 2,
});

const itemStyles = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 3,
	p: 3,
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "gray.200",
	bg: "gray.50",
});

const quantityRowStyles = css({
	display: "flex",
	alignItems: "center",
	gap: 2,
});

const quantityInputStyles = css({
	w: "3rem",
	px: 2,
	py: 1,
	textAlign: "center",
	fontSize: "sm",
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "gray.300",
});

function CartItemRow({ item }: { item: CartItem }) {
	const [updateQuantity, { isLoading: isUpdating }] =
		useUpdateQuantityMutation();
	const [removeFromCart, { isLoading: isRemoving }] =
		useRemoveFromCartMutation();
	const [inputQty, setInputQty] = useState(item.quantity);

	useEffect(() => {
		setInputQty(item.quantity);
	}, [item.quantity]);

	const busy = isUpdating || isRemoving;

	const handleQuantityChange = (newQuantity: number) => {
		const qty = Math.max(1, Math.floor(newQuantity));
		updateQuantity({ itemId: item.id, quantity: qty });
		setInputQty(qty);
	};

	const handleBlur = () => {
		const qty = Math.max(1, Math.floor(inputQty));
		if (qty !== item.quantity) {
			updateQuantity({ itemId: item.id, quantity: qty });
		} else {
			setInputQty(item.quantity);
		}
	};

	return (
		<div className={itemStyles}>
			<div
				className={css({
					flex: 1,
					minW: 0,
				})}
			>
				<p className={css({ fontWeight: "semibold", truncate: true })}>
					{item.productName}
				</p>
				<p className={css({ fontSize: "sm", color: "gray.600" })}>
					ID: {item.productId}
				</p>
			</div>
			<div className={quantityRowStyles}>
				<Button
					variant="secondary"
					size="sm"
					disabled={busy || item.quantity <= 1}
					onClick={() => handleQuantityChange(item.quantity - 1)}
					aria-label="Decrease quantity"
				>
					−
				</Button>
				<input
					type="number"
					className={quantityInputStyles}
					value={inputQty}
					min={1}
					onChange={(e) =>
						setInputQty(Math.max(1, Math.floor(Number(e.target.value)) || 1))
					}
					onBlur={handleBlur}
					onKeyDown={(e) =>
						e.key === "Enter" && (e.target as HTMLInputElement).blur()
					}
					disabled={busy}
					aria-label={`Quantity for ${item.productName}`}
				/>
				<Button
					variant="secondary"
					size="sm"
					disabled={busy}
					onClick={() => handleQuantityChange(item.quantity + 1)}
					aria-label="Increase quantity"
				>
					+
				</Button>
				<Button
					variant="danger"
					size="sm"
					disabled={busy}
					onClick={() => removeFromCart({ itemId: item.id })}
					aria-label={`Remove ${item.productName} from cart`}
				>
					Remove
				</Button>
			</div>
		</div>
	);
}

export function ConnectedCartSample() {
	const { data: items = [], isLoading, error } = useGetCartQuery();
	const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

	if (isLoading) {
		return (
			<section className={sectionStyles}>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<div className={listStyles}>Loading cart…</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className={sectionStyles}>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<div
					className={css({
						w: "full",
						p: 4,
						borderRadius: "md",
						borderWidth: "1px",
						borderColor: "red.300",
						bg: "red.50",
						color: "red.700",
					})}
				>
					Failed to load cart
				</div>
			</section>
		);
	}

	return (
		<section className={sectionStyles}>
			<div
				className={css({
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					w: "full",
					gap: 2,
				})}
			>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<Button
					variant="primary"
					size="sm"
					disabled={isAdding}
					onClick={() =>
						addToCart({
							productId: "prod-sample",
							productName: "Sample Product",
							quantity: 1,
						})
					}
				>
					{isAdding ? "Adding…" : "Add item"}
				</Button>
			</div>
			<div className={listStyles}>
				{items.length === 0 ? (
					<div
						className={css({
							w: "full",
							p: 4,
							borderRadius: "md",
							borderWidth: "1px",
							borderColor: "gray.200",
							bg: "gray.50",
							color: "gray.500",
							fontStyle: "italic",
						})}
					>
						Cart is empty.
					</div>
				) : (
					items.map((item) => <CartItemRow key={item.id} item={item} />)
				)}
			</div>
		</section>
	);
}
