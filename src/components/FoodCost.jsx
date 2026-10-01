import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ChefHat, TrendingDown, Scale, Filter } from 'lucide-react';
import './FoodCost.css';

const pieData = [
  { name: 'Materia Prima', value: 28 },
  { name: 'Margine Lordo', value: 72 },
];
const COLORS = ['#ef4444', '#10b981'];

const FoodCost = () => {
  return (
    <div className="foodcost-module">
      <header className="module-header">
        <div>
          <h1>Food Cost & Analisi Margini</h1>
          <p className="text-muted">Monitora in tempo reale il costo delle distinte base in relazione ai prezzi di acquisto.</p>
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filtra Categorie
        </button>
      </header>

      <div className="fc-overview-grid">
        <div className="card fc-main-card">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f1f2e', border: 'none' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-text">
              <h2>28%</h2>
              <span>Food Cost Medio</span>
            </div>
          </div>
        </div>

        <div className="fc-stats-stack">
          <div className="card stat-card-small">
            <div className="icon-wrapper bg-indigo"><Scale size={18} /></div>
            <div>
              <h4>Piatto più redditizio</h4>
              <p>Spaghetto allo Scoglio (82% Margine)</p>
            </div>
          </div>
          <div className="card stat-card-small">
            <div className="icon-wrapper bg-danger"><TrendingDown size={18} /></div>
            <div>
              <h4>Criticità rilevate</h4>
              <p>Filetto Manzo (Food Cost salito al 35%)</p>
            </div>
          </div>
          <div className="card stat-card-small">
            <div className="icon-wrapper bg-violet"><ChefHat size={18} /></div>
            <div>
              <h4>Ricette a sistema</h4>
              <p>124 distinte base attive</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <div className="section-header">
          <h3>Analisi Piatti (Menu Principale)</h3>
        </div>
        <table className="fc-table">
          <thead>
            <tr>
              <th>Nome Piatto</th>
              <th>Costo Porzione</th>
              <th>Prezzo Vendita</th>
              <th>Margine (€)</th>
              <th>Food Cost (%)</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Spaghetto allo Scoglio</td>
              <td>€ 3.24</td>
              <td>€ 18.00</td>
              <td className="text-success">€ 14.76</td>
              <td>18%</td>
              <td><span className="status-dot success"></span> Ottimale</td>
            </tr>
            <tr>
              <td>Filetto di Manzo (200g)</td>
              <td>€ 9.80</td>
              <td>€ 28.00</td>
              <td>€ 18.20</td>
              <td className="text-danger"><strong>35%</strong></td>
              <td><span className="status-dot danger"></span> Allerta Costi</td>
            </tr>
            <tr>
              <td>Tiramisù della casa</td>
              <td>€ 1.45</td>
              <td>€ 6.50</td>
              <td className="text-success">€ 5.05</td>
              <td>22%</td>
              <td><span className="status-dot success"></span> Ottimale</td>
            </tr>
            <tr>
              <td>Polpo Rostellato</td>
              <td>€ 4.50</td>
              <td>€ 16.00</td>
              <td>€ 11.50</td>
              <td className="text-warning">28%</td>
              <td><span className="status-dot warning"></span> Nella norma</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodCost;
