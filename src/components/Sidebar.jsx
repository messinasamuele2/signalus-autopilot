import React, { memo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  TrendingUp, 
  PackageSearch,
  Settings,
  Bell,
  LogOut,
  Bot
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-agents', label: 'Agenti AI', icon: Bot },
    { id: 'crm', label: 'CRM & Prenotazioni', icon: Calendar },
    { id: 'foodcost', label: 'Food Cost', icon: TrendingUp },
    { id: 'predictive', label: 'Riordino Predittivo', icon: PackageSearch },
    { id: 'customers', label: 'Clienti & Marketing', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">O</div>
          <h2>OmniaRest</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Impostazioni</span>
        </button>
        <button className="nav-item text-danger">
          <LogOut size={20} />
          <span>Esci</span>
        </button>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
