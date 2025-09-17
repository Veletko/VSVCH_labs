import React from 'react';
import Header from '../../components/header/header.js'; 
import Footer from '../../components/footer/footer.js';
import Banner from '../../components/banner/banner.js';
import CardSection from '../../components/cardSection/cardSection.js';
import AboutUs from '../../components/aboutUs/aboutUs.js';


class Home extends React.Component{
    render () {
        const cardInfo = [
            {title: "Spa & Massage", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Hair & Beauty", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Body Treatments", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."}
        ]
        return (
            <div>
                <Header /> 
                <Banner />
                <CardSection cardInfo={cardInfo}/>
                <AboutUs />
                <Footer />
            </div>
        )
    }
}
export default Home