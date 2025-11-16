import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Table, Container } from 'react-bootstrap';

export default function Inventario() {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    async function fetchInventario() {
      const { data, error } = await supabase.from('v_inventario').select('*');
      if (error) console.log(error);
      else setInventario(data);
    }
    fetchInventario();
  }, []);

  return (
    <Container>
      <h2>Inventario</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th>Sottocategoria</th>
            <th>Formato</th>
            <th>Note</th>
            <th>Quantità Totale</th>
            <th>Prossima Scadenza</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map(i => (
            <tr key={i.prodotto_id}>
              <td>{i.nome}</td>
              <td>{i.marca}</td>
              <td>{i.categoria}</td>
              <td>{i.sottocategoria}</td>
              <td>{i.formato}</td>
              <td>{i.note}</td>
              <td>{i.quantita_totale}</td>
              <td>{i.prossima_scadenza}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
