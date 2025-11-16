import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";

export default function LottiPagina() {
  const router = useRouter();
  const { prodotto_id } = router.query;

  const [prodotto, setProdotto] = useState(null);
  const [lotti, setLotti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prodotto_id) return;
    loadProdotto();
    loadLotti();
  }, [prodotto_id]);

  async function loadProdotto() {
    const { data, error } = await supabase
      .from("prodotti")
      .select("*")
      .eq("id", prodotto_id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProdotto(data);
    }
    setLoading(false);
  }

  async function loadLotti() {
    const { data, error } = await supabase
      .from("lotti")
      .select("*")
      .eq("prodotto_id", prodotto_id)
      .order("data_scadenza", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setLotti(data);
    }
  }

  async function removeLotto(id_lotto) {
    const confirmDelete = confirm("Vuoi davvero eliminare questo lotto?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("lotti")
      .delete()
      .eq("id_lotto", id_lotto);

    if (error) {
      console.error(error);
    } else {
      loadLotti();
    }
  }

  async function modificaQuantita(id_lotto, nuovaQuantita) {
    const { error } = await supabase
      .from("lotti")
      .update({ quantita: nuovaQuantita })
      .eq("id_lotto", id_lotto);

    if (error) {
      console.error(error);
    } else {
      loadLotti();
    }
  }

  if (loading || !prodotto) return (
    <>
      <Header />
      <div className="container mt-4">Caricamento...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>{prodotto.nome} - Lotti</h2>

        {lotti.length === 0 ? (
          <p>Nessun lotto presente per questo prodotto.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID Lotto</th>
                <th>Quantità</th>
                <th>Scadenza</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {lotti.map(lotto => (
                <tr key={lotto.id_lotto}>
                  <td>{lotto.id_lotto}</td>
                  <td>
                    <input
                      type="number"
                      value={lotto.quantita}
                      onChange={e => modificaQuantita(lotto.id_lotto, parseInt(e.target.value))}
                      className="form-control"
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>{lotto.data_scadenza ? new Date(lotto.data_scadenza).toLocaleDateString() : "-"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeLotto(lotto.id_lotto)}>
                      Rimuovi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
