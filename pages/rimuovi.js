import { useEffect, useState } from 'react';
import { getSupabaseClient } from "../utils/supabaseClient";
import { Container, Table, Button } from 'react-bootstrap';

export default function Rimuovi() {
  const [lotti, setLotti] = useState([]);

  useEffect(() => {
    async function fetchLotti() {
      const { data, error } = await supabase.from('v_inventario').select('*');
      if (error) console.log(error);
      else setLotti(data);
    }
    fetchLotti();
  }, []);

  const handleRimuovi = async (prodotto_id, quantita) => {
    if (!confirm(`Rimuovere ${quantita} pezzi dal prodotto ${prodotto_id}?`)) return;
    // Prendo il lotto più vicino alla scadenza
    const { data: lottiProd, error } = await supabase.from('lotti').select('*')
      .eq('prodotto_id', prodotto_id)
      .order('data_scadenza', { ascending: true });
    if (error) { alert(error.message); return; }

    let daRimuovere = quantita;
    for (let lotto of lottiProd) {
      if (daRimuovere <= 0) break;
      let rimuovi = Math.min(lotto.quantita, daRimuovere);
      await supabase.from('lotti').update({ quantita: lotto.quantita - rimuovi }).eq('id_lotto', lotto.id_lotto);
      daRimuovere -= rimuovi;
    }
    alert('Quantità rimossa!');
    location.reload();
  };

  return (
    <Container>
      <h2>Rimuovi Lotti</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Formato</th>
            <th>Quantità Totale</th>
            <th>Prossima Scadenza</th>
            <th>Rimuovi</th>
          </tr>
        </thead>
        <tbody>
          {lotti.map(i => (
            <tr key={i.prodotto_id}>
              <td>{i.nome}</td>
              <td>{i.marca}</td>
              <td>{i.formato}</td>
              <td>{i.quantita_totale}</td>
              <td>{i.prossima_scadenza}</td>
              <td>
                <Button onClick={() => {
                  const q = prompt(`Quanti pezzi rimuovere da ${i.nome}?`, '1');
                  if (q) handleRimuovi(i.prodotto_id, parseInt(q));
                }} variant="danger">Rimuovi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
