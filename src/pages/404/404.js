import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import NotFoundBanner from '../../components/notFoundBanner/notFoundBanner';

class NotFound extends React.Component {
    render(){
        return(
            <div>
                <Header/>
                <NotFoundBanner/>
                <Footer/>
            </div>
        )
    }
}
export default NotFound