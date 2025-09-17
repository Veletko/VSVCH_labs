import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/home/home';
import Services from './pages/services/services';


const root = ReactDOM.createRoot(document.getElementById('root'));

const isServicesPage = window.location.pathname.includes('/public/pages/service.html'); // Учти регистр и путь

root.render(isServicesPage ? <Services /> : <Home />);