import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Package, TrendingDown, Calendar, BarChart3, AlertCircle, Save } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function SmartDropdown({ label, value, onChange, options }) {
  const [showNew, setShowNew] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleSelectChange = (e) => {
    if (e.target.value === '__new__') {
      setShowNew(true);
    } else {
      onChange(e.target.value);
      setShowNew(false);
    }
  };

  const handleAddNew = () => {
    if (newValue.trim()) {
      onChange(newValue.trim());
      setNewValue('');
      setShowNew(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <select value={value} onChange={handleSelectChange} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Seleziona {label.toLowerCase()}</option>
          {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
          <option value="__new__">+ Nuovo</option>
        </select>
        {showNew && (
          <div className="flex gap-1">
            <input type="text" placeholder="Nuovo..." value={newValue} onChange={e => setNewValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddNew()} className="px-3 py-2 border rounded-lg outline-none text-sm" autoFocus />
            <button onClick={handleAddNew} className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">✓</button>
            <button onClick={() => { setShowNew(false); setNewValue(''); }} className="px-2 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

function LottoScadenzaInfo({ prodottoId, prossimaScadenza }) {
  const [lottoInfo, setLottoInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/lotti?prodotto_id=eq.${prodottoId}&select=*&order=data_scadenza.asc.nullslast`, {
          headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const lottiData = await response.json();
        const lottoConScadenzaPiuVicina = lottiData.find(l => l.data_scadenza);
        if (lottoConScadenzaPiuVicina) setLottoInfo({ quantita: lottoConScadenzaPiuVicina.quantita, data: lottoConScadenzaPiuVicina.data_scadenza });
      } catch (error) {
        console.error('Errore caricamento info lotto:', error);
      }
    };
    fetchInfo();
  }, [prodottoId]);

  if (!lottoInfo) return null;
  return (
    <div className="text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg inline-block">
      <Calendar size={14} className="inline mr-1" />
      <span className="font-semibold">{lottoInfo.quantita} unità</span> scadono il <span className="font-semibold">{new Date(lottoInfo.data).toLocaleDateString('it-IT')}</span>
    </div>
  );
}

export default function InventarioCantina() {
  const [activeTab, setActiveTab] = useState('inventario');
  const [prodotti, setProdotti] = useState([]);
  const [lotti, setLotti] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddLotto, setShowAddLotto] = useState(false);
  const [showEditLotti, setShowEditLotti] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterSottocategoria, setFilterSottocategoria] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [newProduct, setNewProduct] = useState({ nome: '', marca: '', categoria: '', sottocategoria: '', formato: '', note: '' });
  const [newLotto, setNewLotto] = useState({ quantita: 1, data_scadenza: '', ubicazione_principale: 'Cantina', ubicazione_dettaglio: 'Armadio Grande' });
  const [editingLottoQuantities, setEditingLottoQuantities] = useState({});

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) setError('Configurazione Supabase mancante. Verifica le environment variables su Vercel.');
  }, []);

  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/v_inventario?select=*`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
      const data = await response.json();
      setProdotti(data || []);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      setError('Impossibile caricare l\'inventario. Verifica la connessione a Supabase.');
    }
    setLoading(false);
  };

  const fetchLottiProdotto = async (prodottoId) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/lotti?prodotto_id=eq.${prodottoId}&select=*&order=data_scadenza.asc.nullslast`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const data = await response.json();
      setLotti(prev => ({ ...prev, [prodottoId]: data || [] }));
    } catch (error) {
      console.error('Errore caricamento lotti:', error);
    }
  };

  const toggleExpand = (prodottoId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(prodottoId)) {
      newExpanded.delete(prodottoId);
    } else {
      newExpanded.add(prodottoId);
      if (!lotti[prodottoId]) fetchLottiProdotto(prodottoId);
    }
    setExpandedProducts(newExpanded);
  };

  const getScadenzaUrgency = (dataScadenza) => {
    if (!dataScadenza) return null;
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const scadenza = new Date(dataScadenza);
    scadenza.setHours(0, 0, 0, 0);
    const giorniRimanenti = Math.floor((scadenza - oggi) / (1000 * 60 * 60 * 24));
    return giorniRimanenti;
  };

  const getBadgeClass = (giorni) => {
    if (giorni === null) return 'bg-gray-100 text-gray-600';
    if (giorni < 0) return 'bg-black text-white';
    if (giorni <= 7) return 'bg-red-600 text-white';
    if (giorni <= 30) return 'bg-orange-500 text-white';
    if (giorni <= 60) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const getUrgencyText = (giorni) => {
    if (giorni === null) return 'Senza scadenza';
    if (giorni < 0) return 'SCADUTO!';
    if (giorni === 0) return 'Scade oggi!';
    if (giorni === 1) return 'Scade domani!';
    return `Scade tra ${giorni} giorni`;
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/v_inventario?select=*&order=quantita_totale.desc`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const data = await response.json();
      setStats({
        piuScorta: data.slice(0, 5),
        inEsaurimento: [...data].sort((a, b) => a.quantita_totale - b.quantita_totale).slice(0, 5),
        prossimeScadenze: [...data].filter(p => p.prossima_scadenza).sort((a, b) => new Date(a.prossima_scadenza) - new Date(b.prossima_scadenza)).slice(0, 5)
      });
    } catch (error) {
      console.error('Errore statistiche:', error);
    }
  };

  const addProduct = async () => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/prodotti`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(newProduct)
      });
      setShowAddProduct(false);
      setNewProduct({ nome: '', marca: '', categoria: '', sottocategoria: '', formato: '', note: '' });
      fetchInventario();
    } catch (error) {
      console.error('Errore aggiunta prodotto:', error);
      alert('Errore nell\'aggiunta del prodotto');
    }
  };

  const addLotto = async () => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/lotti`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ prodotto_id: selectedProduct.prodotto_id, quantita: parseInt(newLotto.quantita), data_scadenza: newLotto.data_scadenza || null, ubicazione_principale: newLotto.ubicazione_principale, ubicazione_dettaglio: newLotto.ubicazione_dettaglio })
      });
      setShowAddLotto(false);
      setNewLotto({ quantita: 1, data_scadenza: '', ubicazione_principale: 'Cantina', ubicazione_dettaglio: 'Armadio Grande' });
      setSelectedProduct(null);
      fetchInventario();
    } catch (error) {
      console.error('Errore aggiunta lotto:', error);
      alert('Errore nell\'aggiunta del lotto');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Eliminare questo prodotto e tutti i suoi lotti?')) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/prodotti?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      fetchInventario();
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('Errore nell\'eliminazione del prodotto');
    }
  };

  const deleteLotto = async (lottoId, prodottoId) => {
    if (!confirm('Eliminare questo lotto?')) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/lotti?id_lotto=eq.${lottoId}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      await fetchLottiProdotto(prodottoId);
      fetchInventario();
    } catch (error) {
      console.error('Errore eliminazione lotto:', error);
      alert('Errore nell\'eliminazione del lotto');
    }
  };

  const updateLottoQuantita = async (lottoId, nuovaQuantita, prodottoId) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/lotti?id_lotto=eq.${lottoId}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ quantita: parseInt(nuovaQuantita) })
      });
      await fetchLottiProdotto(prodottoId);
      fetchInventario();
    } catch (error) {
      console.error('Errore modifica lotto:', error);
      alert('Errore nella modifica del lotto');
    }
  };

  useEffect(() => {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) fetchInventario();
  }, []);

  useEffect(() => {
    if (activeTab === 'statistiche' && SUPABASE_URL && SUPABASE_ANON_KEY) fetchStats();
  }, [activeTab]);

  const prodottiFiltrati = prodotti.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filterCategoria || p.categoria === filterCategoria;
    const matchSottocategoria = !filterSottocategoria || p.sottocategoria === filterSottocategoria;
    const matchMarca = !filterMarca || p.marca === filterMarca;
    return matchNome && matchCategoria && matchSottocategoria && matchMarca;
  });

  const categorie = [...new Set(prodotti.map(p => p.categoria).filter(Boolean))].sort();
  const sottocategorie = [...new Set(prodotti.map(p => p.sottocategoria).filter(Boolean))].sort();
  const marche = [...new Set(prodotti.map(p => p.marca).filter(Boolean))].sort();
  const formati = [...new Set(prodotti.map(p => p.formato).filter(Boolean))].sort();
  const ubicazioniPrincipali = [...new Set(Object.values(lotti).flat().map(l => l.ubicazione_principale).filter(Boolean))].sort();
  const ubicazioniDettagli = [...new Set(Object.values(lotti).flat().map(l => l.ubicazione_dettaglio).filter(Boolean))].sort();

  const resetFiltri = () => {
    setSearchTerm('');
    setFilterCategoria('');
    setFilterSottocategoria('');
    setFilterMarca('');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="text-red-600 mb-2" size={32} />
          <h2 className="text-lg font-bold text-red-800 mb-2">Errore di Configurazione</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">🏠 Inventario Cantina</h1>
        <p className="text-blue-100 mt-1">Gestisci le tue scorte in modo intelligente</p>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('inventario')} className={`px-6 py-3 font-medium transition-colors ${activeTab === 'inventario' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Package className="inline mr-2" size={18} />
              Inventario
            </button>
            <button onClick={() => setActiveTab('statistiche')} className={`px-6 py-3 font-medium transition-colors ${activeTab === 'statistiche' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <BarChart3 className="inline mr-2" size={18} />
              Statistiche
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'inventario' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Prodotti in Cantina</h2>
              <button onClick={() => setShowAddProduct(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={20} />
                Nuovo Prodotto
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <input type="text" placeholder="🔍 Cerca per nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Tutte le categorie</option>
                  {categorie.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <select value={filterSottocategoria} onChange={e => setFilterSottocategoria(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Tutte le sottocategorie</option>
                  {sottocategorie.map(sub => (<option key={sub} value={sub}>{sub}</option>))}
                </select>
                <select value={filterMarca} onChange={e => setFilterMarca(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Tutte le marche</option>
                  {marche.map(marca => (<option key={marca} value={marca}>{marca}</option>))}
                </select>
                <button onClick={resetFiltri} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Resetta filtri</button>
              </div>
              <div className="mt-3 text-sm text-gray-600">Mostrando {prodottiFiltrati.length} di {prodotti.length} prodotti</div>
            </div>

            {loading ? (
              <div className="text-center py-12"><div className="text-gray-400">Caricamento...</div></div>
            ) : prodottiFiltrati.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md"><p className="text-gray-500">Nessun prodotto trovato con i filtri selezionati</p></div>
            ) : (
              <div className="grid gap-4">
                {prodottiFiltrati.map(p => {
                  const giorni = getScadenzaUrgency(p.prossima_scadenza);
                  const badgeClass = getBadgeClass(giorni);
                  const urgencyText = getUrgencyText(giorni);
                  const isExpanded = expandedProducts.has(p.prodotto_id);
                  const lottiProdotto = lotti[p.prodotto_id] || [];
                  
                  return (
                    <div key={p.prodotto_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-800">{p.nome}</h3>
                              {p.prossima_scadenza && (<span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeClass}`}>{urgencyText}</span>)}
                            </div>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                              {p.marca && <span className="bg-gray-100 px-2 py-1 rounded">🏷️ {p.marca}</span>}
                              {p.categoria && <span className="bg-blue-50 px-2 py-1 rounded">📁 {p.categoria}</span>}
                              {p.sottocategoria && <span className="bg-purple-50 px-2 py-1 rounded">📂 {p.sottocategoria}</span>}
                              {p.formato && <span className="bg-green-50 px-2 py-1 rounded">📦 {p.formato}</span>}
                            </div>
                            {p.note && <p className="text-sm text-gray-500 mt-2 italic">{p.note}</p>}
                            <div className="flex flex-col gap-2 mt-3">
                              <span className="text-lg font-bold text-blue-600">Quantità totale: {p.quantita_totale}</span>
                              {p.prossima_scadenza && (<LottoScadenzaInfo prodottoId={p.prodotto_id} prossimaScadenza={p.prossima_scadenza} />)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => toggleExpand(p.prodotto_id)} className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors" title={isExpanded ? "Nascondi lotti" : "Mostra lotti"}><Package size={20} /></button>
                            <button onClick={() => { setSelectedProduct(p); fetchLottiProdotto(p.prodotto_id); setShowEditLotti(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Gestisci lotti"><Edit2 size={20} /></button>
                            <button onClick={() => { setSelectedProduct(p); setShowAddLotto(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Aggiungi lotto"><Plus size={20} /></button>
                            <button onClick={() => deleteProduct(p.prodotto_id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Elimina prodotto"><Trash2 size={20} /></button>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Package size={16} />Lotti disponibili</h4>
                          {lottiProdotto.length > 0 ? (
                            <div className="space-y-2">
                              {lottiProdotto.map((lotto, index) => {
                                const giorniLotto = getScadenzaUrgency(lotto.data_scadenza);
                                const badgeClassLotto = getBadgeClass(giorniLotto);
                                return (
                                  <div key={lotto.id_lotto} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-800">Lotto {index + 1}:</span>
                                        <span className="text-blue-600 font-bold">{lotto.quantita} unità</span>
                                        {(lotto.ubicazione_principale || lotto.ubicazione_dettaglio) && (<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">📍 {lotto.ubicazione_principale}{lotto.ubicazione_dettaglio && ` → ${lotto.ubicazione_dettaglio}`}</span>)}
                                      </div>
                                      {lotto.data_scadenza && (
                                        <div className="text-sm mt-1 flex items-center gap-2">
                                          <Calendar size={14} className="text-gray-500" />
                                          <span className="text-gray-600">Scadenza: {new Date(lotto.data_scadenza).toLocaleDateString('it-IT')}</span>
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeClassLotto}`}>{getUrgencyText(giorniLotto)}</span>
                                        </div>
                                      )}
                                      {!lotto.data_scadenza && (<span className="ml-2 text-sm text-gray-500">(senza scadenza)</span>)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">Nessun lotto disponibile</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'statistiche' && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Package className="text-green-600" />Più in Scorta</h3>
              <div className="space-y-3">{stats.piuScorta.map(p => (<div key={p.prodotto_id} className="flex justify-between items-center"><span className="text-gray-700">{p.nome}</span><span className="font-bold text-green-600">{p.quantita_totale}</span></div>))}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingDown className="text-orange-600" />In Esaurimento</h3>
              <div className="space-y-3">{stats.inEsaurimento.map(p => (<div key={p.prodotto_id} className="flex justify-between items-center"><span className="text-gray-700">{p.nome}</span><span className="font-bold text-orange-600">{p.quantita_totale}</span></div>))}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Calendar className="text-red-600" />Prossime Scadenze</h3>
              <div className="space-y-3">{stats.prossimeScadenze.map(p => (<div key={p.prodotto_id} className="flex flex-col"><span className="text-gray-700 font-medium">{p.nome}</span><span className="text-sm text-red-600">{new Date(p.prossima_scadenza).toLocaleDateString('it-IT')}</span></div>))}</div>
            </div>
          </div>
        )}
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Nuovo Prodotto</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nome *" value={newProduct.nome} onChange={e => setNewProduct({...newProduct, nome: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <SmartDropdown label="Marca" value={newProduct.marca} onChange={e => setNewProduct({...newProduct, marca: e})} options={marche} />
              <SmartDropdown label="Categoria" value={newProduct.categoria} onChange={e => setNewProduct({...newProduct, categoria: e})} options={categorie} />
              <SmartDropdown label="Sottocategoria" value={newProduct.sottocategoria} onChange={e => setNewProduct({...newProduct, sottocategoria: e})} options={sottocategorie} />
              <SmartDropdown label="Formato" value={newProduct.formato} onChange={e => setNewProduct({...newProduct, formato: e})} options={formati} />
              <textarea placeholder="Note" value={newProduct.note} onChange={e => setNewProduct({...newProduct, note: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddProduct(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Annulla</button>
              <button onClick={addProduct} disabled={!newProduct.nome} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Aggiungi</button>
            </div>
          </div>
        </div>
      )}

      {showAddLotto && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Aggiungi Lotto</h3>
            <p className="text-gray-600 mb-4">Per: {selectedProduct.nome}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Quantità</label>
                <input type="number" min="1" value={newLotto.quantita} onChange={e => setNewLotto({...newLotto, quantita: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Scadenza (opzionale)</label>
                <input type="date" value={newLotto.data_scadenza} onChange={e => setNewLotto({...newLotto, data_scadenza: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <SmartDropdown label="Ubicazione Principale" value={newLotto.ubicazione_principale} onChange={e => setNewLotto({...newLotto, ubicazione_principale: e})} options={ubicazioniPrincipali} />
              <SmartDropdown label="Ubicazione Dettaglio" value={newLotto.ubicazione_dettaglio} onChange={e => setNewLotto({...newLotto, ubicazione_dettaglio: e})} options={ubicazioniDettagli} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAddLotto(false); setSelectedProduct(null); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Annulla</button>
              <button onClick={addLotto} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Aggiungi Lotto</button>
            </div>
          </div>
        </div>
      )}

      {showEditLotti && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Gestisci Lotti</h3>
            <p className="text-gray-600 mb-4">Prodotto: {selectedProduct.nome}</p>
            {lotti[selectedProduct.prodotto_id]?.length > 0 ? (
              <div className="space-y-3">
                {lotti[selectedProduct.prodotto_id].map(lotto => (
                  <div key={lotto.id_lotto} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <label className="text-sm font-medium">Quantità:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button onClick={() => setEditingLottoQuantities({...editingLottoQuantities, [lotto.id_lotto]: Math.max(0, (editingLottoQuantities[lotto.id_lotto] || lotto.quantita) - 1)})} className="px-3 py-1 hover:bg-gray-100 text-lg font-bold">−</button>
                          <input type="number" min="0" value={editingLottoQuantities[lotto.id_lotto] !== undefined ? editingLottoQuantities[lotto.id_lotto] : lotto.quantita} onChange={(e) => setEditingLottoQuantities({...editingLottoQuantities, [lotto.id_lotto]: parseInt(e.target.value) || 0})} className="w-16 px-2 py-1 text-center border-x border-gray-300 outline-none" />
                          <button onClick={() => setEditingLottoQuantities({...editingLottoQuantities, [lotto.id_lotto]: (editingLottoQuantities[lotto.id_lotto] || lotto.quantita) + 1})} className="px-3 py-1 hover:bg-gray-100 text-lg font-bold">+</button>
                        </div>
                      </div>
                      {lotto.data_scadenza && (<p className="text-sm text-gray-600 mt-1">Scadenza: {new Date(lotto.data_scadenza).toLocaleDateString('it-IT')}</p>)}
                      {(lotto.ubicazione_principale || lotto.ubicazione_dettaglio) && (<p className="text-sm text-gray-600 mt-1">📍 Ubicazione: {lotto.ubicazione_principale}{lotto.ubicazione_dettaglio && ` → ${lotto.ubicazione_dettaglio}`}</p>)}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => updateLottoQuantita(lotto.id_lotto, editingLottoQuantities[lotto.id_lotto] !== undefined ? editingLottoQuantities[lotto.id_lotto] : lotto.quantita, selectedProduct.prodotto_id)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium" title="Salva"><Save size={16} />Salva</button>
                      <button onClick={() => deleteLotto(lotto.id_lotto, selectedProduct.prodotto_id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Elimina lotto"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nessun lotto presente</p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEditLotti(false); setSelectedProduct(null); setEditingLottoQuantities({}); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}