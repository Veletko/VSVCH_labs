import React from 'react';
import '../../pages/home/home.css'
import Beauty_Experts from "../../img/beauty-experts.png"
import Greate_Services from "../../img/gereat-services.svg"
import Genuine from "../../img/genuine.png"
import AboutUs_Img from "../../img/aboutus-image.jpg"
import AbounUs_Hover from "../../img/aboutus-hover-image.jpg"
class AboutUs extends React.Component {
    render(){
        return(
             <section class="aboutus-section">
            <div class="aboutus-content">
                <h3 data-i18n="homepage.about.title">About us</h3>
                <h2 data-i18n="homepage.about.subtitle">The Beauty is about being Comfortable in your own skin!</h2>
                <p class="aboutus-description" data-i18n="homepage.about.description">
                    There are many variations of passages of Lorem
                    Ipsum available, but the majority have 
                    suffered alteration in some form, buying to injected humour, 
                    or randomised words which don't look even many desktop publishing packages.
                </p>
                <div class="aboutus-features">
                    <div class="feature">
                        <img src={Beauty_Experts} alt="Beauty icon"/>
                        <p data-i18n="homepage.about.features.beauty">Beauty<br/>Experts</p>
                    </div>
                    <div class="feature">
                        <img src={Greate_Services} alt="Services icon"/>
                        <p data-i18n="homepage.about.features.services">Great<br/>Services</p>
                    </div>
                    <div class="feature">
                        <img src={Genuine} alt="Jack icon"/>
                        <p data-i18n="homepage.about.features.genuine">100%<br/>Genuine</p>
                    </div>
                </div>
            </div>
            <div class="aboutus-image">
                <img src={AboutUs_Img} alt="Comfortable in your skin"/>
                <img src={AbounUs_Hover} alt="bg-image"/>
            </div>
        </section>
        )
    }
}

export default AboutUs