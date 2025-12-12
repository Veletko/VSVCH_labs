// src/components/banner/Banner.js
import React from 'react';
import styled from 'styled-components';
import Exclamation_mark from '../../img/exclamation_mark.png';
import Banner_woman from '../../img/banner-woman.jpg';
import { H1, H3, Paragraph } from '../ui/Typography';
import Button from '../ui/Button';

const BannerContainer = styled.section`
  display: flex;
  height: 925px;
  width: 100%;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    height: auto;
  }
`;

const BannerLeft = styled.div`
  display: flex;
  flex: 0 0 53.125vw;
  background-color: ${({ theme }) => theme.colors.bannerBg};
  align-items: center;
  padding-left: 18.75vw;

  ${({ theme }) => theme.media.desktop} {
    padding-left: 10vw;
  }

  ${({ theme }) => theme.media.tablet} {
    flex: none;
    width: 100%;
    height: 600px;
    padding-left: 0;
    justify-content: center;
    text-align: center;
  }

  ${({ theme }) => theme.media.mobile} {
    height: auto;
    padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  }
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.tablet} {
    align-items: center;
  }

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
    max-width: 400px;
  }
`;

const BannerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const LogoIcon = styled.img`
  width: 22px;
  height: 28px;

  ${({ theme }) => theme.media.mobile} {
    width: 18px;
    height: 22px;
  }
`;

const BannerRight = styled.div`
  flex: 1;
  background-image: url("../../img/background.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.bannerOverlay};
    z-index: 1;
  }

  ${({ theme }) => theme.media.tablet} {
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }
`;

const ImageFrame = styled.div`
  border-top: 10px solid ${({ theme }) => theme.colors.white};
  border-bottom: 10px solid ${({ theme }) => theme.colors.white};
  border-right: 10px solid ${({ theme }) => theme.colors.white};
  padding: 49px 0;
  display: flex;
  position: relative;
  z-index: 2;

  ${({ theme }) => theme.media.tablet} {
    border: 10px solid ${({ theme }) => theme.colors.white};
    margin: ${({ theme }) => theme.spacing.xl};
    padding: 49px;
  }

  ${({ theme }) => theme.media.mobile} {
    border: 5px solid ${({ theme }) => theme.colors.white};
    margin: ${({ theme }) => theme.spacing.md};
    padding: 12px;
  }
`;

const BannerImage = styled.img`
  position: relative;
  right: 4.0625vw;
  width: 550px;
  height: 545px;
  object-fit: cover;
  box-shadow: 0px 20px 60px 0px rgba(47, 68, 73, 0.46);

  ${({ theme }) => theme.media.tablet} {
    right: 0;
  }

  ${({ theme }) => theme.media.mobile} {
    width: 267px;
    height: 262px;
  }
`;

const Banner = () => {
  return (
    <BannerContainer>
      <BannerLeft>
        <BannerContent>
          <BannerLogo>
            <LogoIcon src={Exclamation_mark} alt="!" />
            <H3>Welcome to Beautyness!!!</H3>
          </BannerLogo>
          <H1>Beauty is power a smile is its sword.</H1>
          <Paragraph lineHeight="170%">
            There are many variation of passages are
            Ipsum available, majority have suffered
            alteration in some form.
          </Paragraph>
          <Button variant="primary" size="large">
            Book Now
          </Button>
        </BannerContent>
      </BannerLeft>
      <BannerRight>
        <ImageFrame>
          <BannerImage src={Banner_woman} alt="Spa Woman" />
        </ImageFrame>
      </BannerRight>
    </BannerContainer>
  );
};

export default Banner;