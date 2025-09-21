import React from 'react';
import "../header/header-footer.css"
import LogoBlack from "../../img/Logo_black.svg"
import Facebook_white from "../../img/facebook_white.png"
import X_white from "../../img/X_white.png"
import In_white from "../../img/in_white.png"
import Instagram_white from "../../img/instagram_white.png"

const Footer = () => {
    return (
            <footer>
            <div class="footer-top-container">
            <div class="footer-top-logo-container">
                <img class="footer-logo-img" src={LogoBlack} alt="logo"/>
                <div class="footer-img-container">
                    <div class="footer-img">
                        <img src={Facebook_white} alt="facebook"/>
                    </div>
                    <div class="footer-img">
                        <img src={X_white} alt="X"/>
                    </div>
                    <div class="footer-img">
                        <img src={In_white} alt="in"/>
                    </div>
                    <div class="footer-img">
                        <img src={Instagram_white} alt="instagram"/>
                    </div>
                </div>
            </div>
            <hr class="footer-line"/>
            <div class="footer-links">
                <div class="footer-column">
                    <h4 data-i18n="footer.explore.title">Explore</h4>
                    <ul>
                        <li><a href="/pages/homepage.html" data-i18n="footer.explore.links.home">Home</a></li>
                        <li><a href="/pages/services.html" data-i18n="footer.explore.links.services">Services</a></li>
                        <li><a href="/pages/personalAccount.html" data-i18n="footer.explore.links.blog">Personal account</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 data-i18n="footer.contact.title">Keep in Touch</h4>
                    <ul>
                        <li>
                            <div class="footer-column-text">
                                <span data-i18n="footer.contact.address">Address:</span>
                                <span data-i18n="footer.contact.addressText">24A Kingston St, Los Vegas NC 28202, USA.</span>
                            </div>
                        </li>
                        <li>
                            <div class="footer-column-text">
                                <span data-i18n="footer.contact.mail">Mail:</span>
                                <span data-i18n="footer.contact.mailText">support@doctors.com</span>
                            </div>
                        </li>
                        <li>
                            <div class="footer-column-text">
                                <span data-i18n="footer.contact.phone">Phone:</span>
                                <span data-i18n="footer.contact.phoneText">(+22) 123 - 4567 - 900</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 data-i18n="footer.hours.title">Working Hours</h4>
                    <ul>
                        <li><span data-i18n="footer.hours.weekdays">Mon to Fri: 7am - 6pm</span></li>
                        <li><span data-i18n="footer.hours.saturday">Sat: 9am - 7pm</span></li>
                        <li><span data-i18n="footer.hours.sunday">Sun: 9am - 6pm</span></li>
                    </ul>
                </div>
            </div>
        </div>
            <div class="footer-button-container">
                <p data-i18n="footer.copyright">Copyright 2021. Drafted by Victor Themes.</p>
            </div>
    </footer>
    )
}

export default Footer