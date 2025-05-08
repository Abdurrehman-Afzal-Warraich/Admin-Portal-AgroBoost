import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AgroCoinDashboard from './AgroCoinDashboard';
import AgroCoin from './AgroCoin';
import './AgroCoinLayout.css';

const AgroCoinLayout = () => {
  const location = useLocation();

  return (
    <div className="agrocoin-layout">
      <div className="agrocoin-header">
        <h2>AgroCoin Management</h2>
        <div className="agrocoin-tabs">
          <Link 
            to="/agrocoin/dashboard" 
            className={`tab-link ${location.pathname === '/agrocoin/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/agrocoin/transfer" 
            className={`tab-link ${location.pathname === '/agrocoin/transfer' ? 'active' : ''}`}
          >
            Transfer Tokens
          </Link>
        </div>
      </div>

      <div className="agrocoin-content">
        <Routes>
          <Route path="/" element={<Navigate to="/agrocoin/dashboard" replace />} />
          <Route path="dashboard" element={<AgroCoinDashboard />} />
          <Route path="transfer" element={<AgroCoin />} />
        </Routes>
      </div>
    </div>
  );
};

export default AgroCoinLayout; 