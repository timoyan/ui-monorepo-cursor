import Head from 'next/head';
import { Button } from 'ui/build/Button/index.js';
import 'ui/build/Button/index.css';
import { Card } from 'ui/build/Card/index.js';
import 'ui/build/Card/index.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js 18 App</title>
      </Head>
      <main style={{ padding: 24 }}>
        <h1>Next.js 18 App using ui package</h1>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <Card title="Card Title" footer="Footer">
          This is a card from the shared ui package.
        </Card>
      </main>
    </>
  );
}


