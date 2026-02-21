import { styled } from "@linaria/react";
import type React from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../Button";

const StyledCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #212529;
`;

const CardBody = styled.div`
  color: #495057;
  line-height: 1.6;
`;

const CardFooter = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
`;

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
		<StyledCard className={className} {...props}>
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
		</StyledCard>
	);
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
