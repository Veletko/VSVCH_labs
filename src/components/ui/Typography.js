import styled, { css } from 'styled-components';

const commonStyles = css`
  font-family: ${({ theme, fontFamily }) => 
    fontFamily === 'playfair' ? theme.typography.fontFamily.playfair : theme.typography.fontFamily.manrope};
  color: ${({ theme, color }) => color ? theme.colors[color] : 'inherit'};
  margin: 0;
  line-height: ${({ lineHeight }) => lineHeight || 'normal'};
`;

export const H1 = styled.h1`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.huge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 115%;
  letter-spacing: -0.7px;

  ${({ theme }) => theme.media.mobile} {
    font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  }
`;

export const H2 = styled.h2`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 130%;
  letter-spacing: -0.45px;
  text-align: ${({ align }) => align || 'center'};

  ${({ theme }) => theme.media.mobile} {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }
`;

export const H3 = styled.h3`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 154.5%;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.accentDark};
`;

export const Paragraph = styled.p`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  line-height: ${({ lineHeight }) => lineHeight || '165%'};
  letter-spacing: 0.36px;
  color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.gray};
`;

export const Small = styled.small`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;