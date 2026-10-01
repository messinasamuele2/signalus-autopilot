import React, { useState } from 'react';
import { Users, Mail, Calendar as CalendarIcon, MessageSquare, Plus, Smartphone, Zap } from 'lucide-react';
import './CrmMarketing.css';

const CrmMarketing = () => {
  const [templateType, setTemplateType] = useState('whatsapp');
  const [trigger, setTrigger] = useState('first_visit');

  return (
    <div className="crm-module">
      <header className="module-header">
        <div>
          <h1>CRM & Marketing</h1>
          <p className="text-muted">Gestisci i tuoi clienti e crea campagne automatizzate per incrementare le prenotazioni.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Nuova Campagna
        </button>
      </header>

      <div className="crm-stats">
        <div className="card stat-card">
          <div className="icon-wrapper bg-blue"><Users size={20} /></div>
          <div className="stat-info">
            <h4>Clienti Attivi</h4>
            <span className="stat-value">3.245</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="icon-wrapper bg-indigo"><CalendarIcon size={20} /></div>
          <div className="stat-info">
            <h4>Prenotazioni Mese</h4>
            <span className="stat-value">452</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="icon-wrapper bg-success"><Mail size={20} /></div>
          <div className="stat-info">
            <h4>Open Rate (Email)</h4>
            <span className="stat-value">42.8%</span>
          </div>
        </div>
      </div>

      <div className="crm-content">
        <div className="card lists-section">
          <div className="section-header">
            <h3>Segmenti Clienti</h3>
            <button className="btn btn-secondary btn-sm">Vedi Tutti</button>
          </div>
          <ul className="segment-list">
            <li>
              <div className="segment-info">
                <h4>Clienti VIP (Frequenti)</h4>
                <span className="text-muted">145 membri (Spesa media &gt; €100)</span>
              </div>
              <button className="btn btn-secondary btn-sm">Invia Promozione</button>
            </li>
            <li>
              <div className="segment-info">
                <h4>Clienti Inattivi (Da 3 mesi)</h4>
                <span className="text-muted">380 membri (Rischio abbandono)</span>
              </div>
              <button className="btn btn-secondary btn-sm">Invia Promozione</button>
            </li>
            <li>
              <div className="segment-info">
                <h4>Compleanni del Mese</h4>
                <span className="text-muted">42 membri (Febbraio)</span>
              </div>
              <button className="btn btn-secondary btn-sm">Invia Auguri</button>
            </li>
          </ul>
        </div>

        <div className="card campaigns-section">
          <div className="section-header">
            <h3>Campagne Automatizzate Attive</h3>
          </div>
          <div className="campaign-card">
            <div className="campaign-header">
              <h4>Follow-up Post Cena</h4>
              <span className="badge badge-success">Attiva</span>
            </div>
            <p className="text-muted">Invia un'email per richiedere una recensione 24 ore dopo la visita.</p>
            <div className="campaign-stats">
              <span><strong>Inviate:</strong> 120</span>
              <span><strong>Recensioni Generate:</strong> 34</span>
            </div>
          </div>

          <div className="campaign-card mt-4">
            <div className="campaign-header">
              <h4>SMS Recupero Inattivi</h4>
              <span className="badge badge-success">Attiva</span>
            </div>
            <p className="text-muted">Invia uno sconto del 15% ai clienti che non prenotano da oltre 90 giorni.</p>
            <div className="campaign-stats">
              <span><strong>Inviate:</strong> 380</span>
              <span><strong>Ritorni:</strong> 45</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card template-maker-section mt-4">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <h3>Template Maker & Automazioni</h3>
            <Zap className="text-warning" size={20} />
          </div>
        </div>
        
        <div className="template-grid">
          <div className="template-config">
            <div className="config-group mb-4">
              <label>Canale di Comunicazione</label>
              <div className="channel-toggles mt-2">
                <button 
                  className={`btn ${templateType === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('whatsapp')}
                >
                  <Smartphone size={16} /> WhatsApp
                </button>
                <button 
                  className={`btn ${templateType === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('email')}
                >
                  <Mail size={16} /> Email
                </button>
              </div>
            </div>

            <div className="config-group mb-4">
              <label>Azione Trigger (Quando inviare?)</label>
              <select 
                className="custom-select mt-2"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
              >
                <option value="first_visit">Prima Visita (Fine Cena)</option>
                <option value="booking_confirm">Conferma Prenotazione</option>
                <option value="birthday">Giorno del Compleanno</option>
              </select>
            </div>
            
            <div className="config-group mb-4">
              <label>Variabili Disponibili (Clicca per inserire)</label>
              <div className="variables-list mt-2 flex gap-2">
                <span className="badge badge-secondary cursor-pointer">{`{{NomeCliente}}`}</span>
                <span className="badge badge-secondary cursor-pointer">{`{{DataPrenotazione}}`}</span>
                <span className="badge badge-secondary cursor-pointer">{`{{Orario}}`}</span>
              </div>
            </div>
          </div>

          <div className="template-editor">
            <label>Testo del Messaggio</label>
            <textarea 
              className="message-textarea mt-2" 
              rows="6"
              defaultValue={trigger === 'first_visit' 
                ? `Ciao {{NomeCliente}}, grazie per essere venuto a trovarci stasera! Speriamo tu sia stato bene. Mostra questo messaggio in cassa per ricevere i nostri amari speciali in omaggio! 🥂`
                : `Ciao {{NomeCliente}}, la tua prenotazione per il {{DataPrenotazione}} alle {{Orario}} è confermata! Ti aspettiamo.`
              }
            ></textarea>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted">Caratteri: 165 (1 SMS)</span>
              <button className="btn btn-success bg-success text-white border-none">Salva Automazione</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmMarketing;
