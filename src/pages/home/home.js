import React from 'react';
import Header from '../../components/header/header.js'; 
import Footer from '../../components/footer/footer.js';
import Banner from '../../components/banner/banner.js';

class Home extends React.Component{
    render () {
        return (
            <div>
                <Header /> 
                <Banner />
                <Footer />
            </div>
        )
    }
}
export default Home