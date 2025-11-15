import { styled } from '@linaria/react';
import React from 'react';

const StyledButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonSecondary = styled(StyledButton)`
  background-color: #6c757d;

  &:hover {
    background-color: #545b62;
    box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
  }
`;

const ButtonSuccess = styled(StyledButton)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  }
`;

const ButtonDanger = styled(StyledButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  }
`;

export const Button = ({ variant = 'primary', children, ...props }) => {
  const ButtonComponent = {
    primary: StyledButton,
    secondary: ButtonSecondary,
    success: ButtonSuccess,
    danger: ButtonDanger,
  }[variant] || StyledButton;

  return <ButtonComponent {...props}>{children}</ButtonComponent>;
};
