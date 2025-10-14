import React, { useState, useMemo } from 'react';
import styled, { createGlobalstyle, keyframes } from 'styled-components';
// Suponiendo que tienes este componente en tu proyecto
// import ThreeBackground from './ThreeBackground'; 
import { 
    FaCalendarAlt, FaUsers, FaPaw, FaBoxOpen, FaCog, FaUserCircle, 
    FaChevronLeft, FaBell, FaSearch, FaPlus, FaChevronDown, FaEdit, FaEye,
    FaSignOutAlt, FaHome
} from 'react-icons/fa';

// --- ESTILOS GLOBALES Y ANIMACIONES ---

const GlobalStyle = createGlobalstyle`
  :root {
    --base-color: #abcbd5;
    --base-color-dark: #8a9ea8;
    --white: #ffffff;
    --dark-text: #2c3e50;
    --light-text: #7f8c8d;
    --shadow: 0 10px 30px rgba(171, 203, 213, 0.4);
    --shadow-hover: 0 15px 40px rgba(171, 203, 213, 0.6);
    --sidebar-width: 280px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #f8fafc;
    overflow: hidden;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- CONTENEDORES PRINCIPALES ---

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, rgba(240, 244, 248, 0.9) 0%, rgba(224, 234, 252, 0.9) 100%);
  overflow: hidden;
  position: relative;
`;

// --- BARRA LATERAL FIJA ---

const Sidebar = styled.nav`
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--base-color) 0%, #9cb0b8 100%);
  padding-top: 1.5rem; // Removido padding vertical para que el footer se pegue abajo
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0px 40px rgba(0, 0, 0, 0.12);
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--base-color-dark);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1.5rem;
  margin-bottom: 3rem;
  color: var(--white);
  font-size: 1.8rem;
  font-weight: 700;
  white-space: nowrap;
  
  span {
    margin-left: 12px;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: ${({ top }) => top}px;
  height: 58px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::after {
    content: '';
    position: absolute;
    left: -1rem;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background: var(--white);
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
`;

const NavItem = styled.li`
  padding: 1rem 1.5rem;
  margin: 0.5rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  
  &:hover {
    color: var(--white);
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  svg {
    margin-right: 18px;
    font-size: 1.4rem;
    min-width: 24px;
  }
  
  .chevron {
    margin-left: auto;
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  ${({ active }) => active && `
    color: var(--white);
    font-weight: 600;
  `}
`;

const SubMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(0,0,0,0.08);
  border-radius: 0 0 12px 12px;
  margin: 0 1rem;
`;

const SubNavItem = styled(NavItem)`
  padding-left: 3.5rem;
  font-size: 0.9rem;
  margin: 0;
  
  &:hover { 
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(8px);
  }
`;

const NavContent = styled.div`
    flex-grow: 1;
`;

// --- COMPONENTES DEL ÁREA PRINCIPAL (MainContent, Header, etc.) ---
// (Estos no necesitan cambios, se dejan como estaban)
const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  margin-left: var(--sidebar-width);
  width: calc(100vw - var(--sidebar-width));
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.8s 0.1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  
  h1 { 
    font-size: 2.8rem; 
    font-weight: 700; 
    color: var(--dark-text);
  }
`;

const WelcomeText = styled.p`
  color: var(--light-text);
  font-size: 1.1rem;
  margin-top: -0.5rem;
`;

const Card = styled.div`
  background: var(--white);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  border: 1px solid #e1e8ed;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(135deg, var(--base-color) 0%, var(--base-color-dark) 100%);
  }

  h2 { 
    font-weight: 600; 
    margin-bottom: 1.5rem; 
    color: var(--dark-text);
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 12px;
      color: var(--base-color);
    }
  }
  
  &:hover { 
    transform: translateY(-8px); 
    box-shadow: var(--shadow-hover);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    position: absolute;
    left: 18px;
    color: var(--light-text);
  }

  input {
    padding: 1rem 1rem 1rem 3rem;
    border-radius: 15px;
    border: 2px solid #e0e0e0;
    width: 300px;
    transition: all 0.4s ease;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--base-color);
      box-shadow: 0 0 0 4px rgba(171, 203, 213, 0.3);
      width: 350px;
    }
  }
`;

// --- SIDEBAR FOOTER COMPONENT (CORREGIDO Y ROBUSTO) ---

const FooterContainer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto; /* Esto lo empuja hacia abajo */
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterActionButton = styled.div`
  position: relative;
  cursor: pointer;
  svg { color: rgba(255, 255, 255, 0.9); font-size: 1.3rem; padding: 8px; border-radius: 50%; transition: all 0.3s ease; }
  &:hover svg { color: var(--white); background: rgba(255, 255, 255, 0.15); transform: scale(1.1); }
`;

const FooterNotificationBadge = styled.span`
  position: absolute; top: 2px; right: 2px; background: var(--base-color-dark); color: white;
  border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex;
  align-items: center; justify-content: center; font-weight: 600; border: 2px solid var(--base-color);
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  svg { font-size: 2.5rem; background: rgba(255, 255, 255, 0.15); padding: 8px; border-radius: 50%; }
`;

// ==================================================================
// ESTA ES LA CORRECCIÓN DEFINITIVA PARA LA ALINEACIÓN DEL TEXTO
// ==================================================================
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  /*
   * Forzamos a los hijos directos (strong y span) a ser bloques.
   * Esto anula cualquier otro estilo que los esté forzando a estar en línea
   * y asegura que se apilen verticalmente.
  */
  & > strong,
  & > span {
    display: block;
    width: 100%;
  }

  strong {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--white);
    line-height: 1.2;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.8;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.2;
  }
`;

const SidebarFooter = ({ user, notificationCount, onNotificationsClick, onLogoutClick }) => (
    <FooterContainer>
      <FooterActions>
        <FooterActionButton onClick={onNotificationsClick} title="Notificaciones">
          <FaBell />
          {notificationCount > 0 && <FooterNotificationBadge>{notificationCount}</FooterNotificationBadge>}
        </FooterActionButton>
        <FooterActionButton onClick={onLogoutClick} title="Cerrar Sesión">
          <FaSignOutAlt />
        </FooterActionButton>
      </FooterActions>
      <UserProfile>
        <UserAvatar><FaUserCircle /></UserAvatar>
        <UserInfo>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </UserInfo>
      </UserProfile>
    </FooterContainer>
);


// --- VISTAS DE CONTENIDO (AppointmentsView, PatientsView, etc.) ---
// (Componentes de vista sin cambios)
const AppointmentsView = () => <Card><h2><FaCalendarAlt /> Próximas Citas</h2></Card>;
const PatientsView = () => <Card><h2><FaPaw /> Pacientes</h2></Card>;
const NewClientForm = () => <Card><h2><FaPlus /> Registrar Nuevo Cliente</h2></Card>;
const SearchClientView = () => <Card><h2><FaSearch /> Buscar Cliente</h2></Card>;


// --- COMPONENTE PRINCIPAL DASHBOARD ---

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Citas');
  const [isClientsSubMenuOpen, setClientsSubMenuOpen] = useState(false);

  const currentUser = { name: 'Dr. Alonso', role: 'Veterinario Principal' };
  const notificationCount = 3;
  const handleLogout = () => alert('Cerrando sesión...');
  const handleNotifications = () => alert(`Tienes ${notificationCount} notificaciones.`);

  const navItems = useMemo(() => [
    { name: 'Dashboard', icon: <FaHome /> },
    { name: 'Citas', icon: <FaCalendarAlt /> },
    { name: 'Clientes', icon: <FaUsers />, subItems: [{name: 'Nuevo Cliente'}, {name: 'Buscar Cliente'}] },
    { name: 'Pacientes', icon: <FaPaw /> },
    { name: 'Inventario', icon: <FaBoxOpen /> },
    { name: 'Configuración', icon: <FaCog /> },
  ], []);

  const handleNavClick = (name) => {
    if (name === 'Clientes') {
      setClientsSubMenuOpen(prev => !prev);
      if(activeView !== 'Nuevo Cliente' && activeView !== 'Buscar Cliente') {
        setActiveView('Buscar Cliente');
      }
    } else {
      setActiveView(name);
      setClientsSubMenuOpen(false);
    }
  };
  
  const activeIndex = useMemo(() => {
    const parentItem = navItems.find(item => item.name === activeView || item.subItems?.some(sub => sub.name === activeView));
    return navItems.findIndex(item => item.name === parentItem?.name);
  }, [activeView, navItems]);

  const indicatorTop = activeIndex >= 0 ? (activeIndex * (58 + 16)) : -100;

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard': return <AppointmentsView />;
      case 'Citas': return <AppointmentsView />;
      case 'Buscar Cliente': return <SearchClientView />;
      case 'Nuevo Cliente': return <NewClientForm />;
      case 'Pacientes': return <PatientsView />;
      default: return <Card><h2>{activeView}</h2><p>Contenido para {activeView}.</p></Card>;
    }
  };

  return (
    <>
      <GlobalStyle />
      {/* <ThreeBackground /> */}
      <DashboardContainer>
        <Sidebar>
            <NavContent>
                <Logo>
                    <FaPaw /> <span>Patitas Sanas</span>
                </Logo>
                <NavMenu>
                    <ActiveIndicator top={indicatorTop} />
                    {navItems.map(item => (
                    <React.Fragment key={item.name}>
                        <NavItem 
                        active={item.name === activeView || item.subItems?.some(s => s.name === activeView)}
                        onClick={() => handleNavClick(item.name)}
                        isOpen={item.name === 'Clientes' && isClientsSubMenuOpen}
                        >
                        {item.icon}
                        <span>{item.name}</span>
                        {item.subItems && <FaChevronDown className="chevron" />}
                        </NavItem>
                        {item.subItems && (
                        <SubMenu isOpen={isClientsSubMenuOpen}>
                            {item.subItems.map(sub => (
                            <SubNavItem 
                                key={sub.name} 
                                onClick={(e) => { e.stopPropagation(); setActiveView(sub.name); }} 
                                active={activeView === sub.name}
                            >
                                {sub.name}
                            </SubNavItem>
                            ))}
                        </SubMenu>
                        )}
                    </React.Fragment>
                    ))}
                </NavMenu>
            </NavContent>
          
          <SidebarFooter
            user={currentUser}
            notificationCount={notificationCount}
            onNotificationsClick={handleNotifications}
            onLogoutClick={handleLogout}
          />
        </Sidebar>

        <MainContent>
          <Header>
            <div>
              <h1>{activeView}</h1>
              <WelcomeText>{getWelcomeMessage()} {currentUser.name}</WelcomeText>
            </div>
            <SearchWrapper>
              <FaSearch />
              <input type="text" placeholder="Buscar pacientes, clientes..." />
            </SearchWrapper>
          </Header>
          {renderView()}
        </MainContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;