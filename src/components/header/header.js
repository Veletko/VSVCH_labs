import React from 'react';
import "./header-footer.css";
import "/универ/всвч/src/css/style.css";
import Logo from "../../img/Logo.svg";
import Phone from "../../img/phone.png";
import Sun from "../../img/sun.png";
import Basket from "../../img/basket.png";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header> 
            <div className="header-logo-container">
                <img src={Logo} alt="logo" className="logo logo-light" />
                <div className="header-img-container">
                    <img src={Phone} alt="phone" />
                    <p data-i18n="common.phoneText">Call Us - (+22) 123 456 7890</p>
                </div>
            </div>
            <div className="header-auth-buttons">
                <label className="theme-toggle element">
                    <input type="checkbox" hidden />
                    <img className="sun" src={Sun} alt="sun" />
                </label>
                <div className="language-selector element">
                    <input type="checkbox" id="lang-switch" className="language-checkbox" hidden />
                    <label htmlFor="lang-switch" className="language-toggle">
                        <span className="language-option ru">RU</span>
                        <span className="language-option en">EN</span>
                    </label>
                </div>
                <nav>
                    <Link to="/services">услуги</Link>
                    <Link to="/">главная</Link>
                </nav>
                <button className="burger-menu">
                    <span></span>
                </button>
                <a href="/pages/cart.html" id="basket-link">
                    <img className="basket" src={Basket} alt="basket" />
                </a>
            </div>
        </header>
    );
};

export default Header;