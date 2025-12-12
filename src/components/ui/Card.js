import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  ${({ theme, shadow }) => shadow && `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: ${theme.borderRadius.md};
  `}

  &:hover {
    ${({ hoverEffect }) => hoverEffect && `
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    `}
  }

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
    max-width: 300px;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
`;

export const CardSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.typography.fontFamily.playfair};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 120%;
  margin: 26px 0 11px;
`;

export const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 165%;
  letter-spacing: 0.36px;
`;

export const CardActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default Card;