import React from 'react';
import styled from 'styled-components';
import { FaBell, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// --- CONTENEDORES PRINCIPALES DEL FOOTER ---

const FooterContainer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto; /* Empuja el footer hacia abajo */
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// --- SECCIÓN DE ACCIONES (ICONOS SUPERIORES) ---

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.3rem;
    padding: 8px;
    border-radius: 50%;
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

// --- SECCIÓN DEL PERFIL DE USUARIO ---

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  color: var(--white);
  gap: 12px;
`;

const UserAvatar = styled.div`
  svg {
    font-size: 2.5rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 8px;
    border-radius: 50%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  line-height: 1.3; /* <-- AÑADIDO: Corrige el espaciado vertical */
  
  strong { 
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--white);
  }
  
  span { 
    font-size: 0.8rem; 
    opacity: 0.8;
    color: rgba(255, 255, 255, 0.9);
  }
`;

// --- COMPONENTE PRINCIPAL DEL FOOTER ---

const SidebarFooter = ({ user, notificationCount, onNotificationsClick, onLogoutClick }) => {
  return (
    <FooterContainer>
      {/* Iconos de acción en la parte superior */}
      <FooterActions>
        <ActionButton onClick={onNotificationsClick} title="Notificaciones">
          <FaBell />
          {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
        </ActionButton>
        
        <ActionButton onClick={onLogoutClick} title="Cerrar Sesión">
          <FaSignOutAlt />
        </ActionButton>
      </FooterActions>
      
      {/* Perfil del usuario en la parte inferior */}
      <UserProfile>
        <UserAvatar>
          <FaUserCircle />
        </UserAvatar>
        <UserInfo>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </UserInfo>
      </UserProfile>
    </FooterContainer>
  );
};

export default SidebarFooter;