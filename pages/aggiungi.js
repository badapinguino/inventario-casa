import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([]);
  const [selectedProdotto, setSelectedProdotto] = useState('');
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sottocategoria, setSottocategoria] = useState('');
  const [formato, setFormato] = useState('');
  const [note, setNote] = useState('');
  const [quantita, setQuantita] = useState(1);
  const [scadenza, setScadenza] = useState('');

  useEffect(() => {
    async function fetchProdotti() {
      const { data } = await supabase.from('prodotti').select('*');
      setProdotti(data);
    }
    fetchProdotti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let prodotto_id = selectedProdotto;

    // Se non seleziono prodotto esistente creo nuovo prodotto
    if (!prodotto_id) {
      const { data, error } = await supabase
        .from('prodotti')
        .insert([{ nome, marca, categoria, sottocategoria, formato, note }])
        .select();
      if (error) {
        alert(error.message);
        return;
      }
      prodotto_id = data[0].id;
    }

    // Controllo se esiste già un lotto con stessa data di scadenza
    const { data: existing, error: err } = await supabase
      .from('lotti')
      .select('*')
      .eq('prodotto_id', prodotto_id)
      .eq('data_scadenza', scadenza);
    if (err) { alert(err.message); return; }

    if (existing.length > 0) {
      // Aggiorno quantità
      await supabase
        .from('lotti')
        .update({ quantita: existing[0].quantita + parseInt(quantita) })
        .eq('id_lotto', existing[0].id_lotto);
    } else {
      // Inserisco nuovo lotto
      await supabase.from('lotti').insert([{ prodotto_id, quantita, data_scadenza: scadenza }]);
    }

    alert('Lotto aggiunto con successo!');
    setQuantita(1);
    setScadenza('');
    setNome('');
    setMarca('');
    setCategoria('');
    setSottocategoria('');
    setFormato('');
    setNote('');
    setSelectedProdotto('');
  };

  return (
    <Container>
      <h2>Aggiungi Prodotto / Lotto</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Seleziona prodotto esistente (opzionale)</Form.Label>
          <Form.Select value={selectedProdotto} onChange={e => setSelectedProdotto(e.target.value)}>
            <option value="">-- Nuovo Prodotto --</option>
            {prodotti.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.formato})</option>
            ))}
          </Form.Select>
        </Form.Group>

        { !selectedProdotto &&
          <>
            <Row className="mb-3">
              <Col>
                <Form.Control placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
              </Col>
              <Col>
                <Form.Control placeholder="Marca" value={marca} onChange={e=>setMarca(e.target.value)} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control placeholder="Categoria" value={categoria} onChange={e=>setCategoria(e.target.value)} />
              </Col>
              <Col>
                <Form.Control placeholder="Sottocategoria" value={sottocategoria} onChange={e=>setSottocategoria(e.target.value)} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control placeholder="Formato" value={formato} onChange={e=>setFormato(e.target.value)} />
              </Col>
              <Col>
                <Form.Control placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
              </Col>
            </Row>
          </>
        }

        <Row className="mb-3">
          <Col>
            <Form.Control type="number" placeholder="Quantità" value={quantita} onChange={e=>setQuantita(e.target.value)} required min={1}/>
          </Col>
          <Col>
            <Form.Control type="date" placeholder="Data scadenza" value={scadenza} onChange={e=>setScadenza(e.target.value)} required/>
          </Col>
        </Row>

        <Button type="submit">Aggiungi / Aggiorna Lotto</Button>
      </Form>
    </Container>
  );
}
