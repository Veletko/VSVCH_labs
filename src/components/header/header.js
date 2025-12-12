import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Logo from '../../img/Logo.svg';
import Phone from '../../img/phone.png';
import Basket from '../../img/basket.png';
import { Paragraph } from '../ui/Typography';

const HeaderWrapper = styled.header`
  width: 100%;
  height: 125px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4.6rem;

  ${({ theme }) => theme.media.laptop} {
    gap: 2rem;
  }
`;

const LogoImg = styled.img`
  width: 191px;
  height: 35px;
  cursor: pointer;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  ${({ theme }) => theme.media.laptop} {
    display: none;
  }
`;

const ContactIcon = styled.img`
  width: 21px;
  height: 21px;
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;

  ${({ theme }) => theme.media.laptop} {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.gray};
  font-family: ${({ theme }) => theme.typography.fontFamily.manrope};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const BasketIcon = styled.img`
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  ${({ theme }) => theme.media.mobile} {
    display: none;
  }
`;

const BurgerMenu = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 30px;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;

  ${({ theme }) => theme.media.laptop} {
    display: flex;
  }

  span {
    width: 100%;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.black};
    transition: all 0.3s ease;
  }

  ${({ $isOpen }) => $isOpen && `
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg) translate(8px, -6px);
    }
  `}
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 320px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 1000;
  transition: right 0.3s ease;
  padding: 80px 30px 30px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: auto;
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.black};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: auto;
`;

const ReservationButton = styled(Button)`
  width: 100%;
  height: 50px;
  padding: 16px 33px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  ${({ theme }) => theme.media.desktop} {
    display: none;
  }
`;

const Header = ({ toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LogoSection>
            <Link to="/">
              <LogoImg src={Logo} alt="logo" />
            </Link>
            <ContactInfo>
              <ContactIcon src={Phone} alt="phone" />
              <Paragraph color="black" fontWeight="semibold">
                Call Us - (+22) 123 456 7890
              </Paragraph>
            </ContactInfo>
          </LogoSection>

          <ActionsSection>
            <Nav>
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/">Home</NavLink>
            </Nav>

            <ReservationButton variant="primary" size="medium">
              RESERVATION
            </ReservationButton>

            <BurgerMenu 
              $isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </BurgerMenu>

            <Link to="/cart">
              <BasketIcon src={Basket} alt="basket" />
            </Link>
          </ActionsSection>
        </HeaderContainer>
      </HeaderWrapper>

      <MobileMenu $isOpen={isMobileMenuOpen}>
        <BurgerMenu 
          $isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          <span></span>
          <span></span>
          <span></span>
        </BurgerMenu>
        
        <MobileNav>
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/services" onClick={() => setIsMobileMenuOpen(false)}>
            Services
          </MobileNavLink>
        </MobileNav>

        <MobileActions>
          <Button variant="primary" size="medium" fullWidth>
            RESERVATION
          </Button>
        </MobileActions>
      </MobileMenu>
    </>
  );
};

export default Header;