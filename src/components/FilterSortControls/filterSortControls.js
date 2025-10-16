import { useSelector, useDispatch } from 'react-redux';
import { setCategory, setSortBy } from '../../store/Slices/filterSlice.js';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

function FilterSortControls() { 
  const dispatch = useDispatch();
  const { category, sortBy } = useSelector((state) => state.filters);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="category-label">Категория</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label="Категория"
          onChange={(e) => dispatch(setCategory(e.target.value))}
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="face">Лицо</MenuItem>
          <MenuItem value="barber">Барбер</MenuItem>
          <MenuItem value="nails">Ногти</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="sort-by-label">Сортировка</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Сортировка"
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <MenuItem value="title">По названию</MenuItem>
          <MenuItem value="price">По цене</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterSortControls; 