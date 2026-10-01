import React from 'react';
import { PackageSearch, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import './PredictiveReorder.css';

const PredictiveReorder = () => {
  return (
    <div className="predictive-module">
      <header className="module-header">
        <div>
          <h1>Riordino Predittivo AI</h1>
          <p className="text-muted">Il sistema incrocia le tue prenotazioni future, l'impatto delle campagne e lo storico vendite per generare gli ordini ottimali.</p>
        </div>
        <button className="btn btn-primary">
          <PackageSearch size={18} />
          Genera Ordini Ora
        </button>
      </header>

      <div className="forecast-banner">
        <div className="forecast-info">
          <h3>Previsione Prossimi 7 Giorni</h3>
          <p>Attesi <strong>850 coperti</strong> (+15% rispetto alla scorsa settimana) grazie alla campagna "Speciale San Valentino".</p>
        </div>
        <div className="forecast-icon">
          <TrendingUp size={32} className="text-success" />
        </div>
      </div>

      <div className="suggestions-grid">
        <div className="card suggestion-card">
          <div className="supplier-header">
            <h3>Fornitore: Ittica Rossi</h3>
            <span className="badge badge-warning">Scorte in esaurimento</span>
          </div>
          
          <table className="order-table">
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Giacenza</th>
                <th>Fabbisogno Stimato</th>
                <th>Quantità Suggerita</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Salmone Fresco</td>
                <td className="text-danger">2 kg</td>
                <td>18 kg</td>
                <td><strong>20 kg</strong></td>
              </tr>
              <tr>
                <td>Branzino</td>
                <td>5 kg</td>
                <td>12 kg</td>
                <td><strong>10 kg</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div className="card-footer">
            <span className="tot-estimate">Totale stimato: €450.00</span>
            <button className="btn btn-secondary">Invia Ordine</button>
          </div>
        </div>

        <div className="card suggestion-card">
          <div className="supplier-header">
            <h3>Fornitore: Ortofrutta Verde</h3>
            <span className="badge badge-success">Scorte Ottimali</span>
          </div>
          
          <table className="order-table">
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Giacenza</th>
                <th>Fabbisogno Stimato</th>
                <th>Quantità Suggerita</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Zucchine</td>
                <td>15 kg</td>
                <td>12 kg</td>
                <td><strong>0 kg</strong></td>
              </tr>
              <tr>
                <td>Pomodorini</td>
                <td className="text-warning">4 kg</td>
                <td>8 kg</td>
                <td><strong>5 kg</strong></td>
              </tr>
            </tbody>
          </table>

          <div className="card-footer">
            <span className="tot-estimate">Totale stimato: €25.00</span>
            <button className="btn btn-secondary">Invia Ordine</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Log Automatizzazioni Recenti</h3>
        <ul className="log-list">
          <li>
            <CheckCircle size={16} className="text-success" />
            <span><strong>Oggi, 09:30</strong> - Ordine automatico inviato a "Bevande & Co." per 15 casse di Acqua.</span>
          </li>
          <li>
            <AlertTriangle size={16} className="text-warning" />
            <span><strong>Ieri, 18:45</strong> - Rilevato picco prenotazioni venerdì. Ricalcolato fabbisogno carne +15%.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PredictiveReorder;
