import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, addService, clearError } from '../../store/Slices/servicesSlice.js';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import CardSection from '../../components/cardSection/cardSection.js';
import FilterSortControls from '../../components/FilterSortControls/filterSortControls.js';
import { Button, Typography, Box } from '@mui/material';

function Services() {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.services);
  const { category, sortBy } = useSelector((state) => state.filters);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(
      addService({
        title: 'Новая услуга',
        description: 'Описание услуги',
        image: '/img/default.png',
      })
    );
  };

  const filteredServices = services
    .filter((service) => category === 'all' || service.category === category)
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'price') {
        return (a.price || 0) - (b.price || 0);
      }
      return 0;
    });

  return (
    <Box>
      <Header />
      {loading && <Typography>Загрузка...</Typography>}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
          <Button onClick={() => dispatch(clearError())}>Очистить</Button>
        </Box>
      )}
      <FilterSortControls />
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Добавить услугу
      </Button>
      <CardSection cardInfo={filteredServices} />
      <Footer />
    </Box>
  );
}

export default Services;