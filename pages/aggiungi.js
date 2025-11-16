import Header from '../components/Header';
import { useState, useEffect } from 'react';

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([]);
  const [selectedProdotto, setSelectedProdotto] = useState('');
  const [nuovoProdotto, setNuovoProdotto] = useState({nome:'',marca:'',categoria:'',sottocategoria:'',formato:''});
  const [quantita, setQuantita] = useState('');
  const [scadenza, setScadenza] = useState('');

  useEffect(() => {
    fetch('/api/prodotti')
      .then(res => res.json())
      .then(data => setProdotti(data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    let body;
    if(selectedProdotto){
      body = { prodotto_id: selectedProdotto, quantita, scadenza };
    } else {
      body = { nuovoProdotto, quantita, scadenza };
    }
    await fetch('/api/lotti', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    alert('Lotto aggiunto!');
    setQuantita(''); setScadenza(''); setSelectedProdotto(''); setNuovoProdotto({nome:'',marca:'',categoria:'',sottocategoria:'',formato:''});
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1>Aggiungi prodotto / lotto</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Seleziona prodotto esistente</label>
            <select className="form-select" value={selectedProdotto} onChange={e=>setSelectedProdotto(e.target.value)}>
              <option value="">-- Nuovo prodotto --</option>
              {prodotti.map(p=><option key={p.id} value={p.id}>{p.nome} ({p.marca})</option>)}
            </select>
          </div>
          { !selectedProdotto &&
            <>
            <input className="form-control mb-2" placeholder="Nome" value={nuovoProdotto.nome} onChange={e=>setNuovoProdotto({...nuovoProdotto,nome:e.target.value})}/>
            <input className="form-control mb-2" placeholder="Marca" value={nuovoProdotto.marca} onChange={e=>setNuovoProdotto({...nuovoProdotto,marca:e.target.value})}/>
            <input className="form-control mb-2" placeholder="Categoria" value={nuovoProdotto.categoria} onChange={e=>setNuovoProdotto({...nuovoProdotto,categoria:e.target.value})}/>
            <input className="form-control mb-2" placeholder="Sottocategoria" value={nuovoProdotto.sottocategoria} onChange={e=>setNuovoProdotto({...nuovoProdotto,sottocategoria:e.target.value})}/>
            <input className="form-control mb-2" placeholder="Formato" value={nuovoProdotto.formato} onChange={e=>setNuovoProdotto({...nuovoProdotto,formato:e.target.value})}/>
            </>
          }
          <input type="number" className="form-control mb-2" placeholder="Quantità" value={quantita} onChange={e=>setQuantita(e.target.value)}/>
          <input type="date" className="form-control mb-2" placeholder="Data scadenza" value={scadenza} onChange={e=>setScadenza(e.target.value)}/>
          <button className="btn btn-primary" type="submit">Aggiungi</button>
        </form>
      </div>
    </>
  );
}
