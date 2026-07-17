import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name || 'Admin User'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email || 'admin@example.com'}</div>
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--primary)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  );
};

export default Header;
