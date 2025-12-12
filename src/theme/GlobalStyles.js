import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* #region basic settings */
  @font-face {
    font-family: 'Playfair'; 
    src: url('/src/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
    font-weight: 700; 
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Manrope';
    src: url('/src/fonts/Manrope-Regular.woff2') format('woff2');
    font-weight: 400; 
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
  }

  html {
    box-sizing: border-box;
    font-size: 10px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }

  body {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  /* #endregion */
`;

export default GlobalStyles;