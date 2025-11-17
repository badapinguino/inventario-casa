import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Package, TrendingDown, Calendar, BarChart3, AlertCircle } from 'lucide-react';

// All'inizio del file, prima del componente
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  // Form states
  const [newProduct, setNewProduct] = useState({
    nome: '', marca: '', categoria: '', sottocategoria: '', formato: '', note: ''
  });
  const [newLotto, setNewLotto] = useState({
    quantita: 1, data_scadenza: ''
  });

  // Verifica configurazione
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('Configurazione Supabase mancante. Verifica le environment variables su Vercel.');
    }
  }, []);

  // Fetch inventario
  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/v_inventario?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setProdotti(data || []);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      setError('Impossibile caricare l\'inventario. Verifica la connessione a Supabase.');
    }
    setLoading(false);
  };

  // Fetch lotti per un prodotto
  const fetchLottiProdotto = async (prodottoId) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/lotti?prodotto_id=eq.${prodottoId}&select=*&order=data_scadenza.asc.nullslast`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      const data = await response.json();
      setLotti(prev => ({ ...prev, [prodottoId]: data || [] }));
    } catch (error) {
      console.error('Errore caricamento lotti:', error);
    }
  };

  // Fetch statistiche
  const fetchStats = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/v_inventario?select=*&order=quantita_totale.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      
      const piuScorta = data.slice(0, 5);
      const inEsaurimento = [...data].sort((a, b) => a.quantita_totale - b.quantita_totale).slice(0, 5);
      const prossimeScadenze = [...data]
        .filter(p => p.prossima_scadenza)
        .sort((a, b) => new Date(a.prossima_scadenza) - new Date(b.prossima_scadenza))
        .slice(0, 5);
      
      setStats({ piuScorta, inEsaurimento, prossimeScadenze });
    } catch (error) {
      console.error('Errore statistiche:', error);
    }
  };

  // Aggiungi prodotto
  const addProduct = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/prodotti`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        setShowAddProduct(false);
        setNewProduct({ nome: '', marca: '', categoria: '', sottocategoria: '', formato: '', note: '' });
        fetchInventario();
      }
    } catch (error) {
      console.error('Errore aggiunta prodotto:', error);
      alert('Errore nell\'aggiunta del prodotto');
    }
  };

  // Aggiungi lotto
  const addLotto = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/lotti`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          prodotto_id: selectedProduct.prodotto_id,
          quantita: parseInt(newLotto.quantita),
          data_scadenza: newLotto.data_scadenza || null
        })
      });
      
      if (response.ok) {
        setShowAddLotto(false);
        setNewLotto({ quantita: 1, data_scadenza: '' });
        setSelectedProduct(null);
        fetchInventario();
      }
    } catch (error) {
      console.error('Errore aggiunta lotto:', error);
      alert('Errore nell\'aggiunta del lotto');
    }
  };

  // Elimina prodotto
  const deleteProduct = async (id) => {
    if (!confirm('Eliminare questo prodotto e tutti i suoi lotti?')) return;
    
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/prodotti?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      fetchInventario();
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('Errore nell\'eliminazione del prodotto');
    }
  };

  // Elimina lotto
  const deleteLotto = async (lottoId, prodottoId) => {
    if (!confirm('Eliminare questo lotto?')) return;
    
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/lotti?id_lotto=eq.${lottoId}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      await fetchLottiProdotto(prodottoId);
      fetchInventario();
    } catch (error) {
      console.error('Errore eliminazione lotto:', error);
      alert('Errore nell\'eliminazione del lotto');
    }
  };

  // Modifica quantità lotto
  const updateLottoQuantita = async (lottoId, nuovaQuantita, prodottoId) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/lotti?id_lotto=eq.${lottoId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
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
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      fetchInventario();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'statistiche' && SUPABASE_URL && SUPABASE_ANON_KEY) {
      fetchStats();
    }
  }, [activeTab]);

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
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">🏠 Inventario Cantina</h1>
        <p className="text-blue-100 mt-1">Gestisci le tue scorte in modo intelligente</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('inventario')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'inventario' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="inline mr-2" size={18} />
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('statistiche')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'statistiche' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="inline mr-2" size={18} />
              Statistiche
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* TAB INVENTARIO */}
        {activeTab === 'inventario' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Prodotti in Cantina</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nuovo Prodotto
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Caricamento...</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {prodotti.map(p => (
                  <div key={p.prodotto_id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{p.nome}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                          {p.marca && <span className="bg-gray-100 px-2 py-1 rounded">🏷️ {p.marca}</span>}
                          {p.categoria && <span className="bg-blue-50 px-2 py-1 rounded">📁 {p.categoria}</span>}
                          {p.sottocategoria && <span className="bg-purple-50 px-2 py-1 rounded">📂 {p.sottocategoria}</span>}
                          {p.formato && <span className="bg-green-50 px-2 py-1 rounded">📦 {p.formato}</span>}
                        </div>
                        {p.note && <p className="text-sm text-gray-500 mt-2 italic">{p.note}</p>}
                        <div className="flex gap-6 mt-3">
                          <span className="text-lg font-bold text-blue-600">
                            Quantità: {p.quantita_totale}
                          </span>
                          {p.prossima_scadenza && (
                            <span className="text-sm text-orange-600">
                              <Calendar size={14} className="inline mr-1" />
                              Scadenza: {new Date(p.prossima_scadenza).toLocaleDateString('it-IT')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            fetchLottiProdotto(p.prodotto_id);
                            setShowEditLotti(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Gestisci lotti"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setShowAddLotto(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Aggiungi lotto"
                        >
                          <Plus size={20} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.prodotto_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Elimina prodotto"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB STATISTICHE */}
        {activeTab === 'statistiche' && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Più in scorta */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="text-green-600" />
                Più in Scorta
              </h3>
              <div className="space-y-3">
                {stats.piuScorta.map(p => (
                  <div key={p.prodotto_id} className="flex justify-between items-center">
                    <span className="text-gray-700">{p.nome}</span>
                    <span className="font-bold text-green-600">{p.quantita_totale}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In esaurimento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingDown className="text-orange-600" />
                In Esaurimento
              </h3>
              <div className="space-y-3">
                {stats.inEsaurimento.map(p => (
                  <div key={p.prodotto_id} className="flex justify-between items-center">
                    <span className="text-gray-700">{p.nome}</span>
                    <span className="font-bold text-orange-600">{p.quantita_totale}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prossime scadenze */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-red-600" />
                Prossime Scadenze
              </h3>
              <div className="space-y-3">
                {stats.prossimeScadenze.map(p => (
                  <div key={p.prodotto_id} className="flex flex-col">
                    <span className="text-gray-700 font-medium">{p.nome}</span>
                    <span className="text-sm text-red-600">
                      {new Date(p.prossima_scadenza).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Aggiungi Prodotto */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Nuovo Prodotto</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome *"
                value={newProduct.nome}
                onChange={e => setNewProduct({...newProduct, nome: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Marca"
                value={newProduct.marca}
                onChange={e => setNewProduct({...newProduct, marca: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={newProduct.categoria}
                onChange={e => setNewProduct({...newProduct, categoria: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Sottocategoria"
                value={newProduct.sottocategoria}
                onChange={e => setNewProduct({...newProduct, sottocategoria: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Formato (es. 500g, 1L)"
                value={newProduct.formato}
                onChange={e => setNewProduct({...newProduct, formato: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Note"
                value={newProduct.note}
                onChange={e => setNewProduct({...newProduct, note: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={addProduct}
                disabled={!newProduct.nome}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aggiungi Lotto */}
      {showAddLotto && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Aggiungi Lotto</h3>
            <p className="text-gray-600 mb-4">Per: {selectedProduct.nome}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Quantità</label>
                <input
                  type="number"
                  min="1"
                  value={newLotto.quantita}
                  onChange={e => setNewLotto({...newLotto, quantita: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Scadenza (opzionale)</label>
                <input
                  type="date"
                  value={newLotto.data_scadenza}
                  onChange={e => setNewLotto({...newLotto, data_scadenza: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddLotto(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={addLotto}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Aggiungi Lotto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestisci Lotti */}
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
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Quantità:</label>
                        <input
                          type="number"
                          min="0"
                          value={lotto.quantita}
                          onChange={(e) => updateLottoQuantita(lotto.id_lotto, e.target.value, selectedProduct.prodotto_id)}
                          className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      {lotto.data_scadenza && (
                        <p className="text-sm text-gray-600 mt-1">
                          Scadenza: {new Date(lotto.data_scadenza).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteLotto(lotto.id_lotto, selectedProduct.prodotto_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Elimina lotto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nessun lotto presente</p>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditLotti(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}