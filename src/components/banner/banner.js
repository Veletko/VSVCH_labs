import React from 'react';
import '../../pages/home/home.css'
import Exclamation_mark from '../../img/exclamation_mark.png'
import Banner_woman from '../../img/banner-woman.jpg'

const Banner = () => {
    return (
            <section class="banner-container">
            <div class="banner-container-left">
                <div class="banner-container-text">
                    <div class="banner-container-text-logo">
                        <img src={Exclamation_mark} alt="!"/>
                        <h3 data-i18n="homepage.banner.welcome">Welcome to Beautyness!!!</h3>
                    </div>
                    <h1 data-i18n="homepage.banner.title">Beauty is power a smile is its sword.</h1>
                    <p data-i18n="homepage.banner.description">There are many variation of passages are
                        Ipsum available, majority have suffered
                        alteration in some form.</p>
                </div>
            </div>
            <div class="banner-container-right">
                <div class="image-frame">
                    <img src={Banner_woman} alt="Spa Woman"/>
                </div>
            </div>
        </section>
    )
}


export default Banner
