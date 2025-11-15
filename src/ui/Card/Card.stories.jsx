import { Card } from './Card';
import { Button } from '../Button';

export default {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
  },
};

export const Default = {
  args: {
    title: 'Card Title',
    children: 'This is a simple card component with some content inside.',
  },
};

export const WithFooter = {
  args: {
    title: 'Card with Footer',
    children: 'This card includes a footer section with actions.',
    footer: (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </div>
    ),
  },
};

export const NoTitle = {
  args: {
    children: 'This card has no title, just content.',
  },
};

export const LongContent = {
  args: {
    title: 'Card with Long Content',
    children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
  },
};

