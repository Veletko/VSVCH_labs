// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme/theme'; // Импортируйте тему
import GlobalStyles from './theme/GlobalStyles';
import Home from './pages/home/home';
import Services from './pages/services/services';

function App() {
  return (
    <ThemeProvider theme={lightTheme}> {/* Передайте тему здесь */}
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;