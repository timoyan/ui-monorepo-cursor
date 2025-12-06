import Head from "next/head";
import { useState } from "react";
import { Button } from "ui-react18/Button";
import "ui-react18/Button/style.css";
import { Card } from "ui-react18/Card";
import "ui-react18/Card/style.css";
import { Modal } from "ui-react18/Modal";
import "ui-react18/Modal/style.css";

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Head>
				<title>Next.js 18 App</title>
			</Head>
			<main style={{ padding: 24 }}>
				<h1>Next.js 18 App using ui package</h1>
				<div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
					<Button variant="primary">Primary</Button>
					<Button variant="success">Success</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="primary" onClick={() => setIsModalOpen(true)}>
						Open Modal
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
