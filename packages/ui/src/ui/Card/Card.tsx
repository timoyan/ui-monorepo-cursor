import { css } from "@linaria/core";
import type React from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { Button } from "../Button";

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

type WithClassName<T = HTMLAttributes<HTMLDivElement>> = T & {
	className?: string;
};

const CardHeader: React.FC<WithClassName> = ({ className, ...props }) => (
	<div
		className={[cardHeader, className].filter(Boolean).join(" ")}
		{...props}
	/>
);

const CardTitle: React.FC<
	WithClassName<HTMLAttributes<HTMLHeadingElement>>
> = ({ className, ...props }) => (
	<h3 className={[cardTitle, className].filter(Boolean).join(" ")} {...props} />
);

const CardBody: React.FC<WithClassName> = ({ className, ...props }) => (
	<div className={[cardBody, className].filter(Boolean).join(" ")} {...props} />
);

const CardFooter: React.FC<WithClassName> = ({ className, ...props }) => (
	<div
		className={[cardFooter, className].filter(Boolean).join(" ")}
		{...props}
	/>
);

export interface CardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	title?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
	className?: string;
}

interface CardComponent extends React.FC<CardProps> {
	Header: typeof CardHeader;
	Title: typeof CardTitle;
	Body: typeof CardBody;
	Footer: typeof CardFooter;
}

export const Card: CardComponent = ({
	title,
	children,
	footer,
	className,
	...props
}) => {
	return (
		<div className={[card, className].filter(Boolean).join(" ")} {...props}>
			{title && (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			)}
			<CardBody>{children}</CardBody>
			{footer && (
				<CardFooter>
					{footer}
					<Button variant="primary">Confirm</Button>
				</CardFooter>
			)}
		</div>
	);
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
