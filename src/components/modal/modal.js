import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily.playfair};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.black};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
  }
`;

const Modal = ({ id, title, description, image, updateCard, onClose }) => {
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
    updateCard({ id, ...formData });
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Edit Card</ModalTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title:</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description:</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="image">Image URL:</Label>
            <Input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <ButtonGroup>
            <Button type="submit" variant="success" fullWidth>
              Save Changes
            </Button>
            <Button type="button" variant="danger" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;