import { Button } from "ui-react19/Button";
import "ui-react19/Button/style.css";
import { Card } from "ui-react19/Card";
import "ui-react19/Card/style.css";

export default function App() {
	return (
		<main style={{ padding: 24 }}>
			<h1> Vite React App using ui package </h1>
			<div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
				<Button variant="secondary">Secondary</Button>
				<Button variant="success">Success</Button>
				<Button variant="danger">Danger</Button>
			</div>
			<Card title="Card Title" footer="Footer">
				This is a card from the shared ui package.
			</Card>
		</main>
	);
}
