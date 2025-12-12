import React from 'react';
import styled from 'styled-components';
import ServiceCard from '../card/card';
import Container from '../ui/Container';
import { Grid } from '../ui/Grid';
import { H2 } from '../ui/Typography';

const Section = styled.section`
  padding: 150px 0;
  background-color: ${({ theme }) => theme.colors.white};

  ${({ theme }) => theme.media.tablet} {
    padding: 80px 0;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 50px 0;
  }
`;

const SectionTitle = styled(H2)`
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
  text-align: center;

  ${({ theme }) => theme.media.mobile} {
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
  }
`;

const CardGrid = styled(Grid)`
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;

const CardSection = ({ cardInfo, updateCard }) => {
  return (
    <Section>
      <Container>
        <SectionTitle>Our Services</SectionTitle>
        <CardGrid columns="repeat(auto-fit, minmax(330px, 1fr))" gap="105px">
          {cardInfo.map((item) => (
            <ServiceCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              updateCard={updateCard}
            />
          ))}
        </CardGrid>
      </Container>
    </Section>
  );
};

export default CardSection;