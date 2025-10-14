import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ThreeBackground from './ThreeBackground';
import { 
    FaCalendarAlt, FaUsers, FaPaw, FaBoxOpen, FaCog, FaUserCircle, 
    FaChevronLeft, FaBell, FaSearch, FaPlus, FaChevronDown, FaEdit, FaEye,
    FaSignOutAlt, FaHome
} from 'react-icons/fa';

// --- ESTILOS GLOBALES Y ANIMACIONES ---

const GlobalStyle = createGlobalStyle`
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
  padding: 1.5rem 0;
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
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  position: relative;
  
  span {
    margin-left: 12px;
    font-weight: 700;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  flex: 1;
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
  margin: 0 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  justify-content: flex-start;
  backdrop-filter: blur(5px);

  &:hover {
    color: var(--white);
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  svg {
    margin-right: 18px;
    font-size: 1.4rem;
    min-width: 24px;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  span {
    font-weight: 500;
  }
  
  .chevron {
    margin-left: auto;
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    font-size: 0.9rem;
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
  border-radius: 8px;
  
  &:hover { 
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(8px);
  }

  ${({ active }) => active && `
    background: rgba(255, 255, 255, 0.1);
  `}
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

// --- SIDEBAR FOOTER COMPLETAMENTE ARREGLADO ---

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const NotificationIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.3rem;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  &:hover {
    svg {
      color: var(--white);
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
    }
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--base-color-dark);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid var(--base-color);
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.3rem;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  &:hover {
    svg {
      color: var(--white);
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
    }
  }
`;

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  color: var(--white);
  padding: 0.5rem 0;
  gap: 12px;
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 2.5rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &:hover {
    svg {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  
  strong { 
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 2px;
    color: var(--white);
  }
  
  span { 
    font-size: 0.8rem; 
    opacity: 0.8;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
  }
`;

// --- COMPONENTES DEL ÁREA PRINCIPAL ---

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  margin-left: var(--sidebar-width);
  width: calc(100vw - var(--sidebar-width));
  min-height: 100vh;
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
    margin-bottom: 0.5rem;
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: ${fadeIn} 0.8s 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  border: 1px solid #e1e8ed;
  position: relative;
  overflow: hidden;

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
  
  p { 
    color: var(--light-text);
    line-height: 1.6;
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
    z-index: 2;
  }

  input {
    padding: 1rem 1rem 1rem 3rem;
    border-radius: 15px;
    border: 2px solid #e0e0e0;
    width: 300px;
    transition: all 0.4s ease;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    background: var(--white);
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    
    &:focus {
      outline: none;
      border-color: var(--base-color);
      box-shadow: 0 0 0 4px rgba(171, 203, 213, 0.3);
      width: 350px;
    }
    
    &::placeholder {
      color: var(--light-text);
      font-weight: 400;
    }
  }
`;

// --- COMPONENTES DEL FORMULARIO Y TABLA ---

const FormGrid = styled.div` 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 2rem; 
  margin-top: 1.5rem; 
`;

const FormGroup = styled.div` 
  display: flex; 
  flex-direction: column; 
  position: relative;
`;

const StyledLabel = styled.label` 
  margin-bottom: 0.8rem; 
  font-weight: 600; 
  font-size: 0.95rem; 
  color: var(--dark-text);
  display: flex;
  align-items: center;
  
  &::after {
    content: ${({ required }) => (required ? "'*'" : "''")};
    color: #e74c3c;
    margin-left: 4px;
  }
`;

const StyledInput = styled.input` 
  padding: 1rem 1.2rem; 
  border: 2px solid #e0e0e0; 
  border-radius: 12px; 
  font-size: 1rem; 
  font-family: 'Poppins', sans-serif; 
  transition: all 0.3s ease; 
  background: var(--white);
  
  &:focus { 
    outline: none; 
    border-color: var(--base-color); 
    box-shadow: 0 0 0 4px rgba(171, 203, 213, 0.3); 
  }
  
  &::placeholder {
    color: #a0a0a0;
    font-weight: 400;
  }
`;

const StyledSelect = styled.select` 
  padding: 1rem 1.2rem; 
  border: 2px solid #e0e0e0; 
  border-radius: 12px; 
  font-size: 1rem; 
  font-family: 'Poppins', sans-serif; 
  transition: all 0.3s ease; 
  background: var(--white);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-size: 0.65rem;
  
  &:focus { 
    outline: none; 
    border-color: var(--base-color); 
    box-shadow: 0 0 0 4px rgba(171, 203, 213, 0.3); 
  }
`;

const StyledTextArea = styled.textarea` 
  padding: 1rem 1.2rem; 
  border: 2px solid #e0e0e0; 
  border-radius: 12px; 
  font-size: 1rem; 
  font-family: 'Poppins', sans-serif; 
  transition: all 0.3s ease; 
  background: var(--white);
  resize: vertical; 
  min-height: 120px; 
  line-height: 1.5;
  
  &:focus { 
    outline: none; 
    border-color: var(--base-color); 
    box-shadow: 0 0 0 4px rgba(171, 203, 213, 0.3); 
  }
`;

const ButtonContainer = styled.div` 
  grid-column: 1 / -1; 
  display: flex; 
  justify-content: flex-end; 
  gap: 1.2rem; 
  margin-top: 2rem; 
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

const StyledButton = styled.button` 
  padding: 1rem 2rem; 
  border-radius: 12px; 
  border: none; 
  font-size: 1rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  background: var(--base-color-dark);
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover { 
    background: #7d8e95;
    transform: translateY(-3px); 
    box-shadow: var(--shadow-hover);
    animation: ${pulse} 0.6s ease;
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(StyledButton)` 
  background: transparent;
  color: var(--light-text);
  border: 2px solid #e0e0e0;
  
  &:hover { 
    background: #f0f4f8;
    color: var(--dark-text);
    border-color: var(--base-color);
  }
`;

const TableContainer = styled.div` 
  overflow-x: auto; 
  border-radius: 15px;
  box-shadow: var(--shadow);
  background: var(--white);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  
  th, td {
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    font-weight: 600;
    color: var(--dark-text);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #f8fafc;
    border-bottom: 2px solid #e0e0e0;
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(171, 203, 213, 0.05);
      transform: scale(1.01);
    }
    
    &:last-child {
      td { border-bottom: none; }
    }
  }
  
  td {
    color: var(--dark-text);
    font-weight: 500;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--light-text);
  margin: 0 0.3rem;
  font-size: 1.1rem;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--base-color-dark);
    background: rgba(171, 203, 213, 0.1);
    transform: scale(1.1);
  }
`;

// --- VISTAS DE CONTENIDO ---

const AppointmentsView = () => (
  <Card>
    <h2><FaCalendarAlt /> Próximas Citas</h2>
    <p>Gestiona y visualiza todas las citas programadas. Aquí podrás ver el calendario o una lista de las próximas citas con tus pacientes.</p>
  </Card>
);

const PatientsView = () => (
  <Card>
    <h2><FaPaw /> Pacientes</h2>
    <p>Administra la información de todas las mascotas registradas en la clínica. Accede a historiales médicos y datos importantes.</p>
  </Card>
);

const NewClientForm = () => (
  <Card>
    <h2><FaPlus /> Registrar Nuevo Cliente</h2>
    <FormGrid>
      <FormGroup> <StyledLabel htmlFor="ownerName" required>Nombre del Dueño</StyledLabel> <StyledInput id="ownerName" type="text" placeholder="Ej: Ana García" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="ownerId" required>DNI / Cédula</StyledLabel> <StyledInput id="ownerId" type="text" placeholder="Ej: 12345678A" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="email">Email</StyledLabel> <StyledInput id="email" type="email" placeholder="Ej: ana.garcia@email.com" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="phone" required>Teléfono</StyledLabel> <StyledInput id="phone" type="tel" placeholder="Ej: +34 600 123 456" /> </FormGroup>
      <FormGroup style={{ gridColumn: '1 / -1' }}> <StyledLabel htmlFor="address">Dirección</StyledLabel> <StyledInput id="address" type="text" placeholder="Ej: Calle de la Alegría, 123, 1ºA" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petName" required>Nombre de la Mascota</StyledLabel> <StyledInput id="petName" type="text" placeholder="Ej: Tobby" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petSpecies" required>Especie</StyledLabel> <StyledSelect id="petSpecies"> <option>Perro</option> <option>Gato</option> <option>Conejo</option> <option>Otro</option> </StyledSelect> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petBreed">Raza</StyledLabel> <StyledInput id="petBreed" type="text" placeholder="Ej: Golden Retriever" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petDob">Fecha de Nacimiento</StyledLabel> <StyledInput id="petDob" type="date" /> </FormGroup>
      <FormGroup style={{ gridColumn: '1 / -1' }}> <StyledLabel htmlFor="notes">Notas Adicionales</StyledLabel> <StyledTextArea id="notes" placeholder="Alergias, comportamiento, medicación actual, etc." /> </FormGroup>
      <ButtonContainer> <SecondaryButton><FaChevronLeft /> Cancelar</SecondaryButton> <StyledButton><FaPlus /> Guardar Cliente</StyledButton> </ButtonContainer>
    </FormGrid>
  </Card>
);

const SearchClientView = () => {
    const clients = [
        { id: 1, owner: 'Carlos Sánchez', pet: 'Rocky', species: 'Perro', phone: '600 111 222', lastVisit: '2024-01-15' },
        { id: 2, owner: 'Laura Jiménez', pet: 'Mishi', species: 'Gato', phone: '600 333 444', lastVisit: '2024-01-10' },
        { id: 3, owner: 'Pedro Martínez', pet: 'Tambor', species: 'Conejo', phone: '600 555 666', lastVisit: '2024-01-08' },
        { id: 4, owner: 'Sofía López', pet: 'Paco', species: 'Loro', phone: '600 777 888', lastVisit: '2024-01-05' },
    ];

    return (
        <>
            <Card>
                <h2><FaSearch /> Buscar Cliente</h2>
                <SearchWrapper style={{ marginBottom: '2rem' }}>
                    <FaSearch />
                    <input type="text" placeholder="Buscar por dueño, mascota, teléfono..." />
                </SearchWrapper>
            </Card>
            
            <Card>
                <h2>Resultados de Búsqueda</h2>
                <TableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Dueño</th>
                                <th>Mascota</th>
                                <th>Especie</th>
                                <th>Teléfono</th>
                                <th>Última Visita</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td><strong>{client.owner}</strong></td>
                                    <td>{client.pet}</td>
                                    <td><span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.8rem',
                                        background: client.species === 'Perro' ? 'rgba(171, 203, 213, 0.2)' : 
                                                   client.species === 'Gato' ? 'rgba(138, 158, 168, 0.2)' : 'rgba(126, 142, 151, 0.2)',
                                        color: client.species === 'Perro' ? 'var(--base-color-dark)' : 
                                              client.species === 'Gato' ? 'var(--base-color-dark)' : 'var(--base-color-dark)',
                                        fontWeight: '600'
                                    }}>{client.species}</span></td>
                                    <td>{client.phone}</td>
                                    <td>{client.lastVisit}</td>
                                    <td>
                                        <ActionButton title="Ver Ficha"><FaEye /></ActionButton>
                                        <ActionButton title="Editar"><FaEdit /></ActionButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
            </Card>
        </>
    );
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Citas');
  const [isClientsSubMenuOpen, setClientsSubMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

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
      setClientsSubMenuOpen(!isClientsSubMenuOpen);
      if(activeView !== 'Nuevo Cliente' && activeView !== 'Buscar Cliente') {
        setActiveView('Buscar Cliente');
      }
    } else {
      setActiveView(name);
      if (name !== 'Clientes') {
        setClientsSubMenuOpen(false);
      }
    }
  };
  
  const activeIndex = useMemo(() => {
    const parentItem = navItems.find(item => item.name === activeView || (item.subItems && item.subItems.some(sub => sub.name === activeView)));
    return navItems.findIndex(item => item.name === parentItem?.name);
  }, [activeView, navItems]);

  const indicatorTop = activeIndex * 58;

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
      case 'Clientes': return <SearchClientView />;
      case 'Buscar Cliente': return <SearchClientView />;
      case 'Nuevo Cliente': return <NewClientForm />;
      case 'Pacientes': return <PatientsView />;
      default: return <Card><h2>{activeView}</h2><p>Contenido para {activeView}.</p></Card>;
    }
  };

  return (
    <>
      <GlobalStyle />
      <ThreeBackground />
      <DashboardContainer>
        {/* Barra lateral fija */}
        <Sidebar>
          <Logo>
            <FaPaw /> <span>Patitas Sanas</span>
          </Logo>

          <NavMenu>
            {activeIndex !== -1 && <ActiveIndicator top={indicatorTop} />}
            {navItems.map(item => (
              <React.Fragment key={item.name}>
                <NavItem 
                  active={activeView === item.name || (item.subItems && item.subItems.some(sub => sub.name === activeView))}
                  onClick={() => handleNavClick(item.name)}
                  isOpen={item.name === 'Clientes' && isClientsSubMenuOpen}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.subItems && <FaChevronDown className="chevron" />}
                </NavItem>
                {item.subItems && (
                  <SubMenu isOpen={isClientsSubMenuOpen}>
                    {item.subItems.map(subItem => (
                       <SubNavItem 
                         key={subItem.name} 
                         onClick={() => setActiveView(subItem.name)} 
                         active={activeView === subItem.name}
                       >
                        <span>{subItem.name}</span>
                       </SubNavItem>
                    ))}
                  </SubMenu>
                )}
              </React.Fragment>
            ))}
          </NavMenu>

          <Spacer />
          
          {/* SidebarFooter completamente arreglado */}
          <SidebarFooter>
            <NotificationsContainer>
              <NotificationIcon title="Notificaciones">
                <FaBell />
                {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
              </NotificationIcon>
              
              <LogoutButton title="Cerrar Sesión">
                <FaSignOutAlt />
              </LogoutButton>
            </NotificationsContainer>
            
            <UserProfileContainer>
              <UserAvatar>
                <FaUserCircle />
              </UserAvatar>
              <UserInfo>
                <strong>Dr. Alonso</strong>
                <span>Veterinario Principal</span>
              </UserInfo>
            </UserProfileContainer>
          </SidebarFooter>
        </Sidebar>

        <MainContent>
          <Header>
            <div>
              <h1>{activeView}</h1>
              <WelcomeText>{getWelcomeMessage()} Dr. Alonso</WelcomeText>
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