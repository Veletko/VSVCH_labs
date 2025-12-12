import React from 'react';
import styled from 'styled-components';
import Container from '../ui/Container';
import { H3, Paragraph, Small } from '../ui/Typography';
import LogoBlack from "../../img/Logo_black.svg";
import Facebook_white from "../../img/facebook_white.png";
import X_white from "../../img/X_white.png";
import In_white from "../../img/in_white.png";
import Instagram_white from "../../img/instagram_white.png";

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.footerText};
`;

const FooterTop = styled.div`
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const FooterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
    text-align: center;
  }
`;

const Logo = styled.img`
  min-width: 298px;
  height: auto;

  ${({ theme }) => theme.media.mobile} {
    min-width: 200px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialIcon = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.accent};
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-3px);
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const Divider = styled.hr`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  opacity: 0.15;
  border: none;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xxl};

  ${({ theme }) => theme.media.tablet} {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ColumnTitle = styled(H3)`
  font-family: ${({ theme }) => theme.typography.fontFamily.playfair};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  min-width: 175px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.white};
  text-align: left;
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LinkItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FooterLink = styled.a`
  text-decoration: none;
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 200%;
  letter-spacing: -0.17px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.footerText};
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const TextRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 310px;
  min-width: 256px;
  white-space: normal;
`;

const TextLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  line-height: 200%;
  letter-spacing: -0.17px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.footerText};
  opacity: 0.8;
`;

const TextValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  line-height: 200%;
  letter-spacing: -0.17px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.footerText};
  opacity: 0.9;
`;

const FooterBottom = styled.div`
  height: 75px;
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGreen};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Copyright = styled(Small)`
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  color: ${({ theme }) => theme.colors.footerText};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 200%;
  letter-spacing: -0.18px;
  opacity: 0.8;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterTop>
          <FooterHeader>
            <Logo src={LogoBlack} alt="logo" />
            <SocialIcons>
              <SocialIcon>
                <img src={Facebook_white} alt="facebook" />
              </SocialIcon>
              <SocialIcon>
                <img src={X_white} alt="X" />
              </SocialIcon>
              <SocialIcon>
                <img src={In_white} alt="in" />
              </SocialIcon>
              <SocialIcon>
                <img src={Instagram_white} alt="instagram" />
              </SocialIcon>
            </SocialIcons>
          </FooterHeader>
          
          <Divider />
          
          <FooterLinks>
            <FooterColumn>
              <ColumnTitle>Explore</ColumnTitle>
              <LinkList>
                <LinkItem>
                  <FooterLink href="/">Home</FooterLink>
                </LinkItem>
                <LinkItem>
                  <FooterLink href="/services">Services</FooterLink>
                </LinkItem>
                <LinkItem>
                  <FooterLink href="/account">Personal account</FooterLink>
                </LinkItem>
              </LinkList>
            </FooterColumn>
            
            <FooterColumn>
              <ColumnTitle>Keep in Touch</ColumnTitle>
              <LinkList>
                <LinkItem>
                  <TextRow>
                    <TextLabel>Address:</TextLabel>
                    <TextValue>24A Kingston St, Los Vegas NC 28202, USA.</TextValue>
                  </TextRow>
                </LinkItem>
                <LinkItem>
                  <TextRow>
                    <TextLabel>Mail:</TextLabel>
                    <TextValue>support@doctors.com</TextValue>
                  </TextRow>
                </LinkItem>
                <LinkItem>
                  <TextRow>
                    <TextLabel>Phone:</TextLabel>
                    <TextValue>(+22) 123 - 4567 - 900</TextValue>
                  </TextRow>
                </LinkItem>
              </LinkList>
            </FooterColumn>
            
            <FooterColumn>
              <ColumnTitle>Working Hours</ColumnTitle>
              <LinkList>
                <LinkItem>
                  <TextValue>Mon to Fri: 7am - 6pm</TextValue>
                </LinkItem>
                <LinkItem>
                  <TextValue>Sat: 9am - 7pm</TextValue>
                </LinkItem>
                <LinkItem>
                  <TextValue>Sun: 9am - 6pm</TextValue>
                </LinkItem>
              </LinkList>
            </FooterColumn>
          </FooterLinks>
        </FooterTop>
      </Container>
      
      <FooterBottom>
        <Copyright>Copyright 2021. Drafted by Victor Themes.</Copyright>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;