import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, PackageSearch } from 'lucide-react';
import './DashboardOverview.css';

const data = [
  { name: 'Lun', incasso: 4000, foodcost: 1200 },
  { name: 'Mar', incasso: 3000, foodcost: 900 },
  { name: 'Mer', incasso: 4500, foodcost: 1400 },
  { name: 'Gio', incasso: 5000, foodcost: 1500 },
  { name: 'Ven', incasso: 8000, foodcost: 2400 },
  { name: 'Sab', incasso: 9500, foodcost: 2800 },
  { name: 'Dom', incasso: 7000, foodcost: 2100 },
];

const DashboardOverview = () => {
  return (
    <div className="dashboard-overview">
      <header className="dashboard-header">
        <div>
          <h1>Overview</h1>
          <p className="text-muted">Bentornato, ecco la panoramica di OmniaRest oggi.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">Esporta Report</button>
          <button className="btn btn-primary">Nuova Campagna</button>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-header">
            <h3>Incasso Mensile</h3>
            <div className="icon-wrapper bg-indigo"><DollarSign size={20} /></div>
          </div>
          <div className="kpi-value">€ 42.500</div>
          <div className="kpi-trend text-success">
            <TrendingUp size={16} /> +12.5% dal mese scorso
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <h3>Food Cost Medio</h3>
            <div className="icon-wrapper bg-violet"><PackageSearch size={20} /></div>
          </div>
          <div className="kpi-value">28.4%</div>
          <div className="kpi-trend text-success">
            <TrendingUp size={16} style={{transform: 'scaleY(-1)'}}/> -2.1% ottimizzato
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <h3>Prenotazioni (Oggi)</h3>
            <div className="icon-wrapper bg-blue"><Users size={20} /></div>
          </div>
          <div className="kpi-value">145 coperti</div>
          <div className="kpi-trend text-warning">
            90% capienza raggiunta
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Andamento Ricavi vs Food Cost</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="incasso" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="foodcost" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card list-card">
          <h3>Alert Riordino Predittivo</h3>
          <ul className="alert-list">
            <li className="alert-item">
              <div className="alert-indicator bg-danger"></div>
              <div className="alert-content">
                <h4>Salmone fresco (15kg)</h4>
                <p>Previsto picco del 40% per il weekend. Ordine suggerito ora.</p>
              </div>
              <button className="btn btn-secondary btn-sm">Ordina</button>
            </li>
            <li className="alert-item">
              <div className="alert-indicator bg-warning"></div>
              <div className="alert-content">
                <h4>Olio EVO (20L)</h4>
                <p>Scorta minima raggiunta in base alle prenotazioni.</p>
              </div>
              <button className="btn btn-secondary btn-sm">Ordina</button>
            </li>
            <li className="alert-item">
              <div className="alert-indicator bg-success"></div>
              <div className="alert-content">
                <h4>Vino Rosso (12 btg)</h4>
                <p>In base alla campagna "Cena Romantica" in corso.</p>
              </div>
              <button className="btn btn-secondary btn-sm">Ordina</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
