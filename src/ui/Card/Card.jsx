import { css } from '@linaria/core';
import React from 'react';
import { Button } from '../Button';

const card = css`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const cardHeader = css`
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
`;

const cardTitle = css`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #212529;
`;

const cardBody = css`
  color: #495057;
  line-height: 1.6;
`;

const cardFooter = css`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
`;

const CardHeader = ({ className, ...props }) => (
  <div className={[cardHeader, className].filter(Boolean).join(' ')} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={[cardTitle, className].filter(Boolean).join(' ')} {...props} />
);

const CardBody = ({ className, ...props }) => (
  <div className={[cardBody, className].filter(Boolean).join(' ')} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={[cardFooter, className].filter(Boolean).join(' ')} {...props} />
);

export const Card = ({ title, children, footer, className, ...props }) => {
  return (
    <div className={[card, className].filter(Boolean).join(' ')} {...props}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}<Button variant="primary">Confirm</Button></CardFooter>}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
