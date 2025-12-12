import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
  gap: ${({ gap }) => gap || '105px'};
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.media.tablet} {
    gap: 50px;
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;