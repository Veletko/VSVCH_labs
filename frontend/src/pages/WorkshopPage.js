import React from 'react';
import { useParams } from 'react-router-dom';
import WorkshopPlanner from '../components/Workshop/WorkshopPlanner';

const WorkshopPage = () => {
  const { id } = useParams();
  
  return (
    <WorkshopPlanner workshopId={id ? parseInt(id) : null} />
  );
};

export default WorkshopPage;
