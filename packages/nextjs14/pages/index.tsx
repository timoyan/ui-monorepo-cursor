import Head from "next/head";
import { useState } from "react";
import { Button } from "ui-react18/Button";
import "ui-react18/Button/style.css";
import { Card } from "ui-react18/Card";
import "ui-react18/Card/style.css";
import { Modal } from "ui-react18/Modal";
import "ui-react18/Modal/style.css";
import { useToastContext } from "ui-react18/Toast";

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const toast = useToastContext();

	return (
		<>
			<Head>
				<title>Next.js 14 App</title>
			</Head>
			<main style={{ padding: 24 }}>
				<h1>Next.js 14 App using ui package</h1>
				<div
					style={{
						display: "flex",
						gap: 16,
						marginBottom: 24,
						flexWrap: "wrap",
					}}
				>
					<Button variant="primary">Primary</Button>
					<Button variant="success">Success</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="primary" onClick={() => setIsModalOpen(true)}>
						Open Modal
					</Button>
					<Button
						variant="success"
						onClick={() => toast.success("Operation completed successfully!")}
					>
						Show Success Toast
					</Button>
					<Button
						variant="danger"
						onClick={() => toast.error("Something went wrong!")}
					>
						Show Error Toast
					</Button>
					<Button
						variant="primary"
						onClick={() => toast.warning("Please review this action")}
					>
						Show Warning Toast
					</Button>
					<Button
						variant="secondary"
						onClick={() => toast.info("Here's some information")}
					>
						Show Info Toast
					</Button>
					<Button
						variant="success"
						onClick={() =>
							toast.success("File saved successfully", {
								title: "Success",
								action: {
									label: "Undo",
									onClick: () => {
										toast.info("File restore initiated");
									},
								},
							})
						}
					>
						Toast with Action
					</Button>
				</div>
				<Card title="Card Title" footer="Footer">
					This is a card from the shared ui package.
				</Card>
				<Modal
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title="Example Modal"
					footer={
						<>
							<Button variant="secondary" onClick={() => setIsModalOpen(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => setIsModalOpen(false)}>
								Confirm
							</Button>
						</>
					}
				>
					<p>This is a modal dialog using the HTML dialog element.</p>
					<p>
						You can close it by clicking the backdrop, pressing ESC, or using
						the buttons in the footer.
					</p>
				</Modal>
			</main>
		</>
	);
}
