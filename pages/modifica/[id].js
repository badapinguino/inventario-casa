import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { supabase } from '../../utils/supabaseClient';
import { useEffect, useState } from 'react';

export default function ModificaProdotto() {
  const router = useRouter();
  const { id } = router.query;

  const [prodotto, setProdotto] = useState(null);
  const [lotti, setLotti] = useState([]);
  const [quantita, setQuantita] = useState('');
  const [scadenza, setScadenza] = useState('');

  useEffect(() => {
    if (id) loadProdotto();
  }, [id]);

  async function loadProdotto() {
    const { data: p } = await supabase.from('prodotti').select('*').eq('id', id).single();
    const { data: l } = await supabase.from('lotti').select('*').eq('prodotto_id', id).order('data_scadenza');
    setProdotto(p);
    setLotti(l || []);
  }

  async function updateLotto(lottoId) {
    await supabase.from('lotti').update({ quantita, data_scadenza: scadenza }).eq('id_lotto', lottoId);
    alert('Lotto aggiornato!');
    loadProdotto();
  }

  if (!prodotto) return <Header /><div className="container">Caricamento...</div>;

  return (
    <>
      <Header />
      <div className="container">
        <h2>Modifica {prodotto.nome}</h2>
        {lotti.map(lotto => (
          <div key={lotto.id_lotto} className="card p-3 mb-2">
            <p>Quantità attuale: {lotto.quantita}</p>
            <p>Scadenza: {lotto.data_scadenza}</p>
            <input type="number" className="form-control mb-2" placeholder="Nuova quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
            <input type="date" className="form-control mb-2" value={scadenza} onChange={e => setScadenza(e.target.value)} />
            <button className="btn btn-primary" onClick={() => updateLotto(lotto.id_lotto)}>Aggiorna Lotto</button>
          </div>
        ))}
      </div>
    </>
  );
}
