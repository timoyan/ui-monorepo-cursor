import { styled } from '@linaria/react';
import React from 'react';
import { Button, Card } from './ui';

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const AppHeader = styled.header`
  max-width: 1200px;
  margin: 0 auto;
  color: white;

  h1 {
    margin-bottom: 40px;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

function App() {
  return (
    <AppContainer>
      <AppHeader>
        <h1>React UI Library Demo</h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '800px' }}>
          <Card title="Card 1">
            This is a simple card component built with Linaria CSS-in-JS.
          </Card>
          <Card title="Card 2">
            Cards can contain any content you want.
          </Card>
          <Card 
            title="Card with Footer" 
            footer={
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </div>
            }
          >
            This card includes a footer with action buttons.
          </Card>
          <Card title="Card 4">
            All styling is handled by Linaria for zero-runtime CSS.
          </Card>
        </div>
      </AppHeader>
    </AppContainer>
  );
}

export default App;
