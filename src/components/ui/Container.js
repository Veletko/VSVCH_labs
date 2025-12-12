import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${({ padding }) => padding || '0 20px'};

  ${({ fluid }) => fluid && `
    max-width: 100%;
    padding: 0;
  `}

  ${({ theme, narrow }) => narrow && `
    max-width: 800px;
  `}

  ${({ theme }) => theme.media?.desktop && `
    padding: ${({ padding }) => padding || '0 40px'};
  `}

  ${({ theme }) => theme.media?.laptop && `
    padding: ${({ padding }) => padding || '0 30px'};
  `}

  ${({ theme }) => theme.media?.tablet && `
    padding: ${({ padding }) => padding || '0 20px'};
  `}

  ${({ theme }) => theme.media?.mobile && `
    padding: ${({ padding }) => padding || '0 15px'};
  `}
`;

export default Container;