import React from 'react';
import styled from 'styled-components';
import Container from '../ui/Container';
import { H2, H3, Paragraph } from '../ui/Typography';
import Beauty_Experts from "../../img/beauty-experts.png";
import Great_Services from "../../img/gereat-services.svg";
import Genuine from "../../img/genuine.png";
import AboutUs_Img from "../../img/aboutus-image.jpg";
import AboutUs_Hover from "../../img/aboutus-hover-image.jpg";

const AboutSection = styled.section`
  background-color: ${({ theme }) => theme.colors.bannerBg};
  padding: 150px 0;

  ${({ theme }) => theme.media.tablet} {
    padding: 80px 0;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 50px 0;
  }
`;

const AboutContainer = styled(Container)`
  display: flex;
  align-items: center;
  gap: 6.51vw;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxxl};
  }
`;

const AboutContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 529px;
`;

const AboutTitle = styled(H2)`
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  ${({ theme }) => theme.media.mobile} {
    text-align: center;
  }
`;

const AboutDescription = styled(Paragraph)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeaturesGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.mobile} {
    justify-content: center;
  }
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.darkGray};
  width: 165px;
  height: 180px;
  background-color: ${({ theme }) => theme.colors.white};
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const FeatureText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily.playfair};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 120%;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
`;

const AboutImage = styled.div`
  flex: 1;
  position: relative;
  min-width: 546px;
  min-height: 614px;

  ${({ theme }) => theme.media.tablet} {
    min-width: 100%;
    min-height: 400px;
  }

  ${({ theme }) => theme.media.mobile} {
    min-height: 300px;
  }
`;

const MainImage = styled.img`
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  width: 80%;
  height: 80%;
  object-fit: cover;
  box-shadow: 0px 10px 40px 0px rgba(47, 68, 73, 0.46);

  ${({ theme }) => theme.media.mobile} {
    width: 70%;
    height: 70%;
  }
`;

const HoverImage = styled.img`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: 70%;
  height: 70%;
  object-fit: cover;

  ${({ theme }) => theme.media.mobile} {
    width: 60%;
    height: 60%;
  }
`;

const AboutUs = () => {
  return (
    <AboutSection>
      <AboutContainer>
        <AboutContent>
          <H3>About us</H3>
          <AboutTitle>The Beauty is about being Comfortable in your own skin!</AboutTitle>
          <AboutDescription>
            There are many variations of passages of Lorem
            Ipsum available, but the majority have 
            suffered alteration in some form, buying to injected humour, 
            or randomised words which don't look even many desktop publishing packages.
          </AboutDescription>
          <FeaturesGrid>
            <Feature>
              <FeatureIcon src={Beauty_Experts} alt="Beauty icon" />
              <FeatureText>Beauty Experts</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon src={Great_Services} alt="Services icon" />
              <FeatureText>Great Services</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon src={Genuine} alt="Jack icon" />
              <FeatureText>100% Genuine</FeatureText>
            </Feature>
          </FeaturesGrid>
        </AboutContent>
        <AboutImage>
          <MainImage src={AboutUs_Img} alt="Comfortable in your skin" />
          <HoverImage src={AboutUs_Hover} alt="background" />
        </AboutImage>
      </AboutContainer>
    </AboutSection>
  );
};

export default AboutUs;