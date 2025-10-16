import {useEffect} from "react";
import { useSelector, useDispatch} from 'react-redux';
import { fetchServices, updateService } from '../../store/Slices/servicesSlice.js'; 

import Header from '../../components/header/header.js'; 
import Footer from '../../components/footer/footer.js';
import Banner from '../../components/banner/banner.js';
import CardSection from '../../components/cardSection/cardSection.js';
import AboutUs from '../../components/aboutUs/aboutUs.js';
import { Typography } from '@mui/material'; 

const Home = () => {
    const dispatch = useDispatch();
    
    const { services: cardInfo, loading, error } = useSelector((state) => state.services);
    
    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleUpdateCard = (updatedCard) => { 
        dispatch(updateService(updatedCard));
    };

    const limitedCardInfo = cardInfo.slice(0, 3);

    return (
        <div>
            <Header /> 
            <Banner />
            {loading && <Typography>Загрузка услуг...</Typography>}
            {error && <Typography color="error">Ошибка загрузки: {error}</Typography>}
            {!loading && limitedCardInfo.length > 0 && (
                <CardSection cardInfo={limitedCardInfo} updateCard={handleUpdateCard}/>
            )}
            <AboutUs />
            <Footer />
        </div>
    );
};

export default Home;