import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ThreeBackground from './ThreeBackground';
import { 
    FaCalendarAlt, FaUsers, FaPaw, FaBoxOpen, FaCog, FaUserCircle, 
    FaChevronLeft, FaBell, FaSearch, FaPlus, FaChevronDown, FaEdit, FaEye 
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
    --sidebar-width: 280px;
    --sidebar-width-collapsed: 90px;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- CONTENEDORES PRINCIPALES ---

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, rgba(240, 244, 248, 0.9) 0%, rgba(224, 234, 252, 0.9) 100%);
  overflow: hidden;
`;

// --- COMPONENTES DE LA BARRA LATERAL MEJORADA ---

const Sidebar = styled.nav`
  width: ${({ collapsed }) => (collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)')};
  background: linear-gradient(180deg, var(--base-color) 0%, #9cb0b8 100%);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0px 30px rgba(0, 0, 0, 0.08);
  z-index: 10;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  margin-bottom: 3rem;
  color: var(--white);
  font-size: 1.8rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  
  span {
    margin-left: 12px;
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity 0.3s ease 0.1s;
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
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: -1;

  &::after {
    content: '';
    position: absolute;
    left: -1rem;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 4px;
    background-color: var(--white);
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 10px var(--white);
  }
`;

const NavItem = styled.li`
  padding: 1rem 0;
  margin: 0 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  padding: ${({ collapsed }) => (collapsed ? '1rem 0' : '1rem 1.5rem')};
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};

  &:hover:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    opacity: 0.5;
  }

  svg {
    margin-right: ${({ collapsed }) => (collapsed ? 0 : '18px')};
    font-size: 1.5rem;
    min-width: 24px;
    transition: margin-right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  span {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity 0.3s ease 0.1s;
  }
  
  .chevron {
    margin-left: auto;
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }

  ${({ active }) => active && `
    color: var(--white);
  `}

  &:hover {
    color: var(--white);
  }
`;

const SubMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  background-color: rgba(0,0,0,0.1);
`;

const SubNavItem = styled(NavItem)`
    padding-left: ${({ collapsed }) => (collapsed ? '2.8rem' : '3.5rem')};
    font-size: 0.9rem;
    &:hover { background-color: rgba(255, 255, 255, 0.1); }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 80px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  color: var(--base-color-dark);
  transform: translateY(-50%);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.3s;
  svg {
    transition: transform 0.4s ease;
    transform: ${({ collapsed }) => (collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
  &:hover { background-color: #f0f4f8; }
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  color: var(--white);
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  overflow: hidden;
  
  svg {
    font-size: 2.8rem;
    min-width: 45px;
    margin-right: ${({ collapsed }) => (collapsed ? 0 : '15px')};
    transition: margin-right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  div {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    width: ${({ collapsed }) => (collapsed ? 0 : 'auto')};
    white-space: nowrap;
    transition: all 0.3s ease 0.1s;
  }
  
  strong { font-weight: 500; }
  span { font-size: 0.8rem; opacity: 0.7; }
`;

const Notifications = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  
  svg {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover { color: var(--white); }
  }
`;

// --- COMPONENTES DEL ÁREA PRINCIPAL ---

const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem 4rem;
  overflow-y: auto;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s 0.1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  h1 { font-size: 2.5rem; font-weight: 600; color: var(--dark-text); }
`;
const Card = styled.div`
  background: var(--white);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.8s 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  h2 { font-weight: 500; margin-bottom: 1.5rem; color: var(--dark-text); }
  p { color: var(--light-text); }
  &:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    position: absolute;
    left: 15px;
    color: var(--light-text);
  }

  input {
    padding: 0.7rem 1rem 0.7rem 2.5rem;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    width: 250px;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
    
    &:focus {
      outline: none;
      border-color: var(--base-color);
      box-shadow: 0 0 0 3px rgba(171, 203, 213, 0.3);
      width: 300px;
    }
  }
`;

// --- COMPONENTES DEL FORMULARIO Y TABLA ---

const FormGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1rem; `;
const FormGroup = styled.div` display: flex; flex-direction: column; `;
const StyledLabel = styled.label` margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; color: var(--dark-text); `;
const StyledInput = styled.input` padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: border-color 0.3s ease, box-shadow 0.3s ease; &:focus { outline: none; border-color: var(--base-color); box-shadow: 0 0 0 3px rgba(171, 203, 213, 0.3); } `;
const StyledSelect = styled(StyledInput).attrs({ as: 'select' })``;
const StyledTextArea = styled(StyledInput).attrs({ as: 'textarea' })` resize: vertical; min-height: 100px; `;
const ButtonContainer = styled.div` grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; `;
const StyledButton = styled.button` padding: 0.8rem 1.5rem; border-radius: 8px; border: none; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; background-color: var(--base-color-dark); color: var(--white); &:hover { background-color: #7d8e95; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); } `;
const SecondaryButton = styled(StyledButton)` background-color: #e0e0e0; color: var(--dark-text); &:hover { background-color: #d0d0d0; } `;

const TableContainer = styled.div` overflow-x: auto; `;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  th {
    font-weight: 500;
    color: var(--light-text);
    font-size: 0.9rem;
    text-transform: uppercase;
  }
  tbody tr {
    transition: background-color 0.2s ease;
    &:hover { background-color: #f9f9f9; }
  }
`;
const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--light-text);
  margin: 0 0.5rem;
  font-size: 1rem;
  transition: color 0.2s ease;
  &:hover { color: var(--base-color-dark); }
`;

// --- VISTAS DE CONTENIDO ---

const AppointmentsView = () => ( <Card> <h2>Próximas Citas</h2> <p>Aquí se mostraría un calendario o una lista de las próximas citas.</p> </Card> );
const PatientsView = () => ( <Card> <h2>Pacientes</h2> <p>Aquí verías la lista de todas las mascotas.</p> </Card> );

const NewClientForm = () => (
  <Card>
    <h2><FaPlus style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Registrar Nuevo Cliente</h2>
    <FormGrid>
      <FormGroup> <StyledLabel htmlFor="ownerName">Nombre del Dueño</StyledLabel> <StyledInput id="ownerName" type="text" placeholder="Ej: Ana García" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="ownerId">DNI / Cédula</StyledLabel> <StyledInput id="ownerId" type="text" placeholder="Ej: 12345678A" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="email">Email</StyledLabel> <StyledInput id="email" type="email" placeholder="Ej: ana.garcia@email.com" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="phone">Teléfono</StyledLabel> <StyledInput id="phone" type="tel" placeholder="Ej: +34 600 123 456" /> </FormGroup>
      <FormGroup style={{ gridColumn: '1 / -1' }}> <StyledLabel htmlFor="address">Dirección</StyledLabel> <StyledInput id="address" type="text" placeholder="Ej: Calle de la Alegría, 123, 1ºA" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petName">Nombre de la Mascota</StyledLabel> <StyledInput id="petName" type="text" placeholder="Ej: Tobby" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petSpecies">Especie</StyledLabel> <StyledSelect id="petSpecies"> <option>Perro</option> <option>Gato</option> <option>Conejo</option> <option>Otro</option> </StyledSelect> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petBreed">Raza</StyledLabel> <StyledInput id="petBreed" type="text" placeholder="Ej: Golden Retriever" /> </FormGroup>
      <FormGroup> <StyledLabel htmlFor="petDob">Fecha de Nacimiento</StyledLabel> <StyledInput id="petDob" type="date" /> </FormGroup>
      <FormGroup style={{ gridColumn: '1 / -1' }}> <StyledLabel htmlFor="notes">Notas Adicionales</StyledLabel> <StyledTextArea id="notes" placeholder="Alergias, comportamiento, medicación actual, etc." /> </FormGroup>
      <ButtonContainer> <SecondaryButton>Cancelar</SecondaryButton> <StyledButton>Guardar Cliente</StyledButton> </ButtonContainer>
    </FormGrid>
  </Card>
);

const SearchClientView = () => {
    const clients = [
        { id: 1, owner: 'Carlos Sánchez', pet: 'Rocky', species: 'Perro', phone: '600 111 222' },
        { id: 2, owner: 'Laura Jiménez', pet: 'Mishi', species: 'Gato', phone: '600 333 444' },
        { id: 3, owner: 'Pedro Martínez', pet: 'Tambor', species: 'Conejo', phone: '600 555 666' },
        { id: 4, owner: 'Sofía López', pet: 'Paco', species: 'Loro', phone: '600 777 888' },
    ];

    return (
        <Card>
            <h2>Buscar Cliente</h2>
            <TableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Dueño</th>
                            <th>Mascota</th>
                            <th>Especie</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.owner}</td>
                                <td>{client.pet}</td>
                                <td>{client.species}</td>
                                <td>{client.phone}</td>
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
    );
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Citas');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClientsSubMenuOpen, setClientsSubMenuOpen] = useState(false);

  const navItems = useMemo(() => [
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
        setActiveView('Clientes');
      }
    } else {
      setActiveView(name);
    }
  };
  
  const activeIndex = useMemo(() => {
    const parentItem = navItems.find(item => item.name === activeView || (item.subItems && item.subItems.some(sub => sub.name === activeView)));
    return navItems.findIndex(item => item.name === parentItem?.name);
  }, [activeView, navItems]);

  const indicatorTop = activeIndex * 58;

  const renderView = () => {
    switch (activeView) {
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
        <Sidebar collapsed={isSidebarCollapsed}>
          <Logo collapsed={isSidebarCollapsed}>
            <FaPaw /> <span>Patitas Sanas</span>
          </Logo>
          
          <ToggleButton collapsed={isSidebarCollapsed} onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
            <FaChevronLeft />
          </ToggleButton>

          <NavMenu>
            {activeIndex !== -1 && <ActiveIndicator top={indicatorTop} />}
            {navItems.map(item => (
              <React.Fragment key={item.name}>
                <NavItem 
                  active={activeView === item.name || (item.subItems && item.subItems.some(sub => sub.name === activeView))}
                  onClick={() => handleNavClick(item.name)}
                  collapsed={isSidebarCollapsed}
                  isOpen={item.name === 'Clientes' && isClientsSubMenuOpen}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.subItems && !isSidebarCollapsed && <FaChevronDown className="chevron" />}
                </NavItem>
                {item.subItems && (
                  <SubMenu isOpen={isClientsSubMenuOpen && !isSidebarCollapsed} collapsed={isSidebarCollapsed}>
                    {item.subItems.map(subItem => (
                       <SubNavItem key={subItem.name} onClick={() => setActiveView(subItem.name)} active={activeView === subItem.name} collapsed={isSidebarCollapsed}>
                        <span>{subItem.name}</span>
                       </SubNavItem>
                    ))}
                  </SubMenu>
                )}
              </React.Fragment>
            ))}
          </NavMenu>

          <Spacer />
          
          <SidebarFooter>
            {!isSidebarCollapsed && (
              <Notifications>
                <FaBell />
              </Notifications>
            )}
            <UserProfile collapsed={isSidebarCollapsed}>
              <FaUserCircle />
              <div>
                <strong>Dr. Alonso</strong>
                <span>Veterinario</span>
              </div>
            </UserProfile>
          </SidebarFooter>

        </Sidebar>

        <MainContent>
          <Header>
            <h1>{activeView}</h1>
            <SearchWrapper>
              <FaSearch />
              <StyledInput type="text" placeholder="Buscar..." />
            </SearchWrapper>
          </Header>
          {renderView()}
        </MainContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;