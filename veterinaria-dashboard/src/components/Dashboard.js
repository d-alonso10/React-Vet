import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ThreeBackground from './ThreeBackground';
import { FaCalendarAlt, FaUsers, FaPaw, FaBoxOpen, FaCog, FaUserCircle } from 'react-icons/fa';

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
  /* Fondo semitransparente para ver las partículas detrás */
  background: linear-gradient(180deg, rgba(240, 244, 248, 0.85) 0%, rgba(224, 234, 252, 0.85) 100%);
  overflow: hidden;
`;

const Sidebar = styled.nav`
  width: 280px; /* --- MEJORA: Ancho aumentado --- */
  background-color: var(--base-color);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0px 25px rgba(0,0,0,0.05);
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 2.5rem; /* Más espaciado */
  margin-bottom: 3rem;
  color: var(--white);
  font-size: 1.6rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  span { margin-left: 12px; }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative; /* Para el indicador animado */
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  top: ${({ top }) => top}px;
  height: 54px; /* Altura de un NavItem (padding 1rem * 2 + font-size) */
  width: 5px;
  background-color: var(--white);
  transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 0 4px 4px 0;
`;

const NavItem = styled.li`
  padding: 1rem 2.5rem; /* Más espaciado */
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  
  svg {
    margin-right: 18px; /* Más espacio */
    font-size: 1.3rem;
  }

  /* Se elimina &:before ya que ahora usamos ActiveIndicator */

  ${({ active }) => active && `
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.1);
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateX(5px); /* --- MEJORA: Animación al pasar el ratón --- */
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const UserProfile = styled.div`
  padding: 1rem 2.5rem;
  display: flex;
  align-items: center;
  color: var(--white);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;

  svg {
    font-size: 2.5rem;
    margin-right: 15px;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  strong {
    font-weight: 500;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;


const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem 4rem;
  overflow-y: auto;
  & > * { 
    animation: fadeIn 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; 
    opacity: 0; 
    transform: translateY(20px);
  }
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

  const navItems = useMemo(() => [
    { name: 'Citas', icon: <FaCalendarAlt /> },
    { name: 'Clientes', icon: <FaUsers /> },
    { name: 'Pacientes', icon: <FaPaw /> },
    { name: 'Inventario', icon: <FaBoxOpen /> },
    { name: 'Configuración', icon: <FaCog /> },
  ], []);

  const activeIndex = useMemo(() => navItems.findIndex(item => item.name === activeView), [activeView, navItems]);
  const indicatorTop = activeIndex * 54; // Altura aproximada de cada NavItem

  const renderView = () => {
    switch (activeView) {
      case 'Citas': return <AppointmentsView />;
      case 'Clientes': return <ClientsView />;
      case 'Pacientes': return <PatientsView />;
      default: return <Card><h2>{activeView}</h2><p>Contenido para {activeView}.</p></Card>;
    }
  };

  return (
    <>
      <GlobalStyle />
      <ThreeBackground />
      <DashboardContainer>
        <Sidebar>
          <Logo> <FaPaw /> <span>Patitas Sanas</span> </Logo>
          <NavMenu>
            <ActiveIndicator top={indicatorTop} />
            {navItems.map(item => (
              <NavItem key={item.name} active={activeView === item.name} onClick={() => setActiveView(item.name)}>
                {item.icon}
                {item.name}
              </NavItem>
            ))}
          </NavMenu>
          <Spacer />
          <UserProfile>
            <FaUserCircle />
            <div>
              <strong>Dr. Alonso</strong>
              <span>Veterinario</span>
            </div>
          </UserProfile>
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