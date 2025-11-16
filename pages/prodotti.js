import Header from '../components/Header';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Prodotti() {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    loadInventario();
  }, []);

  async function loadInventario() {
    const { data } = await supabase.from('v_inventario').select('*');
    setInventario(data || []);
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Inventario</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Quantità</th>
              <th>Prossima scadenza</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.prodotto_id}>
                <td>{item.nome}</td>
                <td>{item.marca}</td>
                <td>{item.quantita_totale}</td>
                <td>{item.prossima_scadenza || '-'}</td>
                <td>
                  <Link href={`/modifica/${item.prodotto_id}`} className="btn btn-sm btn-primary me-2">Modifica</Link>
                  <Link href={`/rimuovi/${item.prodotto_id}`} className="btn btn-sm btn-danger">Rimuovi</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
