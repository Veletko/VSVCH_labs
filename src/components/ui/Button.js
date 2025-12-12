import styled, { css } from 'styled-components';

const Button = styled.button`
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 125%;
  letter-spacing: 1.68px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${({ theme }) => theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${({ theme }) => theme.colors.accent};
          }
        `;
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${({ theme }) => theme.colors.black};
          border: 2px solid ${({ theme }) => theme.colors.primary};
          &:hover {
            background-color: ${({ theme }) => theme.colors.primary};
            color: white;
          }
        `;
      case 'danger':
        return css`
          background-color: ${({ theme }) => theme.colors.danger};
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
      default:
        return css`
          background-color: ${({ theme }) => theme.colors.primary};
          color: white;
        `;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 12px 24px;
          min-width: 120px;
        `;
      case 'large':
        return css`
          padding: 20px 40px;
          min-width: 250px;
          font-size: ${({ theme }) => theme.typography.fontSize.base};
        `;
      default:
        return css`
          padding: 16px 32px;
          min-width: 180px;
        `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        transform: none;
        box-shadow: none;
      }
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:active {
    transform: scale(0.98);
  }
`;

export default Button;