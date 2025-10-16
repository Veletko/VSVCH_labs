import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateService } from '../../store/Slices/servicesSlice.js';
import './modal.css';

function Modal({ id, title, description, image, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title,
    description,
    image,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateService({ id, ...formData }));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit card</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          <label>
            description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            image:
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </label>
          <button className="modal-button" type="submit">
            save
          </button>
          <button className="modal-button" type="button" onClick={onClose}>
            close
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;