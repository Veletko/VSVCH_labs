import React from 'react';
import Header from '../../components/header/header.js'; 
import Footer from '../../components/footer/footer.js';
class Home extends React.Component{
    render () {
        return (
            <div>
                <Header /> 
                <Footer />
            </div>
        )
    }
}
export default Home