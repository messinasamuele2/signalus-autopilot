import React, { useState } from 'react';
import { Bot, RefreshCw, Users as UsersIcon, Clock, Settings2, Sparkles, BrainCircuit } from 'lucide-react';
import './AIAgents.css';

const AIAgents = () => {
  const [serviceRatio, setServiceRatio] = useState('pizzeria');
  
  const ratios = {
    pizzeria: { sala: 15, cucina: 15, label: 'Pizzeria/Casual (1 addetto ogni 15 pax)' },
    ristorante: { sala: 10, cucina: 12, label: 'Ristorante Tradizionale (1 ogni 10 pax)' },
    stellato: { sala: 5, cucina: 5, label: 'Fine Dining / Stellato (1 ogni 5 pax)' }
  };

  const getStaffNeeded = (pax, area) => {
    return Math.ceil(pax / ratios[serviceRatio][area]);
  };

  return (
    <div className="ai-agents-module">
      <header className="module-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Centro di Comando AI</h1>
            <Sparkles className="text-primary" size={24} />
          </div>
          <p className="text-muted">Monitora e configura gli agenti autonomi che ottimizzano il tuo ristorante in background.</p>
        </div>
      </header>

      <div className="agents-grid">
        {/* Agente 1: Prezzi & Procurement */}
        <div className="card agent-card">
          <div className="agent-header">
            <div className="agent-icon bg-indigo"><RefreshCw size={24} /></div>
            <div>
              <h3>Agente Prezzi & Procurement</h3>
              <span className="agent-status text-success">● Sincronizzazione Attiva</span>
            </div>
          </div>
          <p className="agent-desc text-muted">
            Si interfaccia con i DB fornitori (o legge PDF listini) per aggiornare i prezzi degli ingredienti in tempo reale.
          </p>
          <div className="agent-action-box">
            <h4>Ultima Sincronizzazione: 10 min fa</h4>
            <ul className="log-list mt-2">
              <li className="text-sm">Rilevato aumento +5% su "Olio EVO" da Fornitore A.</li>
              <li className="text-sm">Aggiornato costo di 14 distinte base.</li>
            </ul>
            <button className="btn btn-secondary mt-4 w-full">Configura Sorgenti Dati</button>
          </div>
        </div>

        {/* Agente 2: Staffing & Forecasting */}
        <div className="card agent-card">
          <div className="agent-header">
            <div className="agent-icon bg-violet"><UsersIcon size={24} /></div>
            <div>
              <h3>Agente Staffing & Predictor</h3>
              <span className="agent-status text-success">● Predizioni Attive</span>
            </div>
          </div>
          <p className="agent-desc text-muted">
            Analizza storico e trend per predire i coperti e calcola lo staff necessario per mantenere lo standard di servizio.
          </p>
          
          <div className="agent-action-box">
            <div className="flex justify-between items-center mb-2">
              <h4>Previsione di Stasera: <strong>120 Coperti</strong></h4>
            </div>
            
            <div className="config-group mt-3 mb-3">
              <label className="text-sm font-medium">Standard di Servizio:</label>
              <select 
                className="custom-select mt-1"
                value={serviceRatio} 
                onChange={(e) => setServiceRatio(e.target.value)}
              >
                <option value="pizzeria">{ratios.pizzeria.label}</option>
                <option value="ristorante">{ratios.ristorante.label}</option>
                <option value="stellato">{ratios.stellato.label}</option>
              </select>
            </div>

            <div className="staff-prediction flex gap-4 mt-2">
              <div className="staff-box">
                <span className="text-xs text-muted uppercase">Personale Sala</span>
                <span className="text-lg font-bold">{getStaffNeeded(120, 'sala')}</span>
              </div>
              <div className="staff-box">
                <span className="text-xs text-muted uppercase">Personale Cucina</span>
                <span className="text-lg font-bold">{getStaffNeeded(120, 'cucina')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agente 3: Yield Manager */}
        <div className="card agent-card">
          <div className="agent-header">
            <div className="agent-icon bg-blue"><Clock size={24} /></div>
            <div>
              <h3>Agente Ottimizzatore (Yield)</h3>
              <span className="agent-status text-success">● Attivo su TheFork/Widget</span>
            </div>
          </div>
          <p className="agent-desc text-muted">
            Analizza i flussi e suggerisce l'orario migliore per incastrare le prenotazioni e massimizzare i doppi turni.
          </p>
          <div className="agent-action-box">
            <h4>Insights Attuali</h4>
            <ul className="log-list mt-2">
              <li className="text-sm"><strong>Blocco Orario:</strong> Chiusura prenotazioni ore 20:30. Suggerite 19:30 o 21:15.</li>
              <li className="text-sm"><strong>Potenziale:</strong> +15% incasso stimato forzando doppi turni stasera.</li>
            </ul>
            <button className="btn btn-secondary mt-4 w-full">Regola Regole di Yield</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgents;
