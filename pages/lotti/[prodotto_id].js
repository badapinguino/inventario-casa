import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Lotti() {
  const router = useRouter();
  const { prodotto_id } = router.query;
  const [lotti, setLotti] = useState([]);
  const [prodotto, setProdotto] = useState(null);

  useEffect(() => { if (prodotto_id) loadLotti(); }, [prodotto_id]);

  async function loadLotti() {
    const { data: p } = await supabase.from("prodotti").select("*").eq("id", prodotto_id).single();
    setProdotto(p);
    const { data: l } = await supabase.from("lotti").select("*").eq("prodotto_id", prodotto_id).order("data_scadenza");
    setLotti(l || []);
  }

  if (!prodotto) return (
    <>
      <Header />
      <div className="container">Caricamento...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container">
        <h2>Lotti di {prodotto.nome}</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID Lotto</th>
              <th>Quantità</th>
              <th>Data Scadenza</th>
            </tr>
          </thead>
          <tbody>
            {lotti.map(l => (
              <tr key={l.id_lotto}>
                <td>{l.id_lotto}</td>
                <td>{l.quantita}</td>
                <td>{l.data_scadenza}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
