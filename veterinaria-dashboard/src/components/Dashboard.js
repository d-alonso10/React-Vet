import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ThreeBackground from './ThreeBackground';
import { FaCalendarAlt, FaUsers, FaPaw, FaBoxOpen, FaCog } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  :root {
    --base-color: #abcbd5;
    --white: #ffffff;
    --dark-text: #2c3e50;
    --light-text: #7f8c8d;
    --shadow: 0 10px 30px rgba(171, 203, 213, 0.4);
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  /* ✨ MEJORA VISUAL: Añadimos un gradiente sutil */
  background: linear-gradient(180deg, rgba(224, 234, 252, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%);
  overflow: hidden;
`;

const Sidebar = styled.nav`
  width: 260px;
  background-color: var(--base-color);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0px 25px rgba(0,0,0,0.05);
  z-index: 10; /* Aseguramos que la barra lateral esté por encima */
`;

// ... (El resto del código de Dashboard.js no necesita cambios, puedes dejarlo como está)
// ... (Logo, NavMenu, NavItem, MainContent, Header, Card, Views, etc.)

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 2rem;
  margin-bottom: 3rem;
  color: var(--white);
  font-size: 1.6rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  span { margin-left: 10px; }
`;
const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const NavItem = styled.li`
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  svg { margin-right: 15px; font-size: 1.2rem; }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background-color: var(--white);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  ${({ active }) => active && `
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.1);
    &:before { transform: scaleY(1); }
  `}
  &:hover { background-color: rgba(255, 255, 255, 0.15); }
`;
const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem 4rem;
  overflow-y: auto;
  & > * { animation: fadeIn 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; opacity: 0; transform: translateY(20px); }
  @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 { font-size: 2.5rem; font-weight: 600; color: var(--dark-text); }
`;
const Card = styled.div`
  background: var(--white);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  h2 { font-weight: 500; margin-bottom: 1.5rem; }
  p { color: var(--light-text); }
  &:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); }
`;

const AppointmentsView = () => ( <Card> <h2>Próximas Citas</h2> <p>Aquí se mostraría un calendario o una lista de las próximas citas para las mascotas.</p> </Card> );
const ClientsView = () => ( <Card> <h2>Lista de Clientes</h2> <p>Aquí se mostraría una tabla o lista de todos los clientes registrados en la clínica.</p> </Card> );
const PatientsView = () => ( <Card> <h2>Pacientes</h2> <p>Aquí verías la lista de todas las mascotas, con acceso a sus historiales clínicos.</p> </Card> );

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Citas');
  const renderView = () => {
    switch (activeView) {
      case 'Citas': return <AppointmentsView />;
      case 'Clientes': return <ClientsView />;
      case 'Pacientes': return <PatientsView />;
      default: return <Card><h2>{activeView}</h2><p>Contenido para {activeView}.</p></Card>;
    }
  };
  const navItems = [
    { name: 'Citas', icon: <FaCalendarAlt /> }, { name: 'Clientes', icon: <FaUsers /> },
    { name: 'Pacientes', icon: <FaPaw /> }, { name: 'Inventario', icon: <FaBoxOpen /> },
    { name: 'Configuración', icon: <FaCog /> },
  ];
  return (
    <>
      <GlobalStyle />
      <ThreeBackground />
      <DashboardContainer>
        <Sidebar>
          <Logo> <FaPaw /> <span>Patitas Sanas</span> </Logo>
          <NavMenu>
            {navItems.map(item => (
              <NavItem key={item.name} active={activeView === item.name} onClick={() => setActiveView(item.name)}>
                {item.icon} {item.name}
              </NavItem>
            ))}
          </NavMenu>
        </Sidebar>
        <MainContent>
          <Header> <h1>{activeView}</h1> </Header>
          {renderView()}
        </MainContent>
      </DashboardContainer>
    </>
  );
};
export default Dashboard;