import React from 'react';
import styled from 'styled-components';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Container from '../../components/ui/Container';
import { H1, H2,H3, Paragraph } from '../../components/ui/Typography';

const ServicesPage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
  background-color: ${({ theme }) => theme.colors.bannerBg};
`;

const ServicesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;

const ServiceItem = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Services = ({ toggleTheme }) => {
  const services = [
    { id: 1, title: 'Spa Treatments', description: 'Relaxing spa treatments for ultimate relaxation' },
    { id: 2, title: 'Beauty Services', description: 'Professional beauty services and treatments' },
    { id: 3, title: 'Massage Therapy', description: 'Therapeutic massage for stress relief' },
    { id: 4, title: 'Skin Care', description: 'Advanced skin care treatments and products' },
  ];

  return (
    <ServicesPage>
      <Header toggleTheme={toggleTheme} />
      <MainContent>
        <HeroSection>
          <Container>
            <H1>Our Services</H1>
            <Paragraph>
              Discover our range of professional beauty and wellness services
            </Paragraph>
          </Container>
        </HeroSection>
        
        <Container>
          <H2 align="center">All Services</H2>
          <ServicesList>
            {services.map((service) => (
              <ServiceItem key={service.id}>
                <H3>{service.title}</H3>
                <Paragraph>{service.description}</Paragraph>
              </ServiceItem>
            ))}
          </ServicesList>
        </Container>
      </MainContent>
      <Footer />
    </ServicesPage>
  );
};

export default Services;