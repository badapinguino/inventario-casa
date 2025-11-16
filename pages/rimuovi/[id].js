import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { supabase } from '../../utils/supabaseClient';
import { useEffect, useState } from 'react';

export default function Rimuovi() {
  const router = useRouter();
  const { id } = router.query;

  const [prodotto, setProdotto] = useState(null);

  useEffect(() => {
    if (id) loadProdotto();
  }, [id]);

  async function loadProdotto() {
    const { data } = await supabase.from('prodotti').select('*').eq('id', id).single();
    setProdotto(data);
  }

  async function eliminaProdotto() {
    await supabase.from('prodotti').delete().eq('id', id);
    alert('Prodotto rimosso!');
    router.push('/prodotti');
  }

  if (!prodotto) return <Header /><div className="container">Caricamento...</div>;

  return (
    <>
      <Header />
      <div className="container">
        <h2>Rimuovi {prodotto.nome}</h2>
        <button className="btn btn-danger" onClick={eliminaProdotto}>Elimina Prodotto (tutti i lotti)</button>
      </div>
    </>
  );
}
