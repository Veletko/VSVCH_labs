import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import CardSection from '../../components/cardSection/cardSection';


class Services extends React.Component {
    render(){
        const cardInfo = [
            {title: "Spa & Massage", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Hair & Beauty", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Body Treatments", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Spa & Massage", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Hair & Beauty", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."},
            {title: "Body Treatments", description: "If you are going to use a passage offer Lorem Ipsum, you need to be sure hidden in the middle of text."}
        ]
        return(
            <div>
                <Header/>
                <CardSection  cardInfo={cardInfo}/>
                <Footer/>
            </div>
        )
    }
}
export default Services