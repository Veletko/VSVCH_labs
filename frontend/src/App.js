import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MastersPage from './pages/MastersPage';
import WorkersPage from './pages/WorkersPage';
import MachinesPage from './pages/MachinesPage';
import MaintenancePage from './pages/MaintenancePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/masters" element={<MastersPage />} />
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/machines" element={<MachinesPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;