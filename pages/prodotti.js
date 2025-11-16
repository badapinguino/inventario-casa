import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Table, Container } from 'react-bootstrap';

export default function Prodotti() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    async function fetchProdotti() {
      const { data, error } = await supabase.from('prodotti').select('*');
      if (error) console.log(error);
      else setProdotti(data);
    }
    fetchProdotti();
  }, []);

  return (
    <Container>
      <h2>Prodotti</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th>Sottocategoria</th>
            <th>Formato</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {prodotti.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.marca}</td>
              <td>{p.categoria}</td>
              <td>{p.sottocategoria}</td>
              <td>{p.formato}</td>
              <td>{p.note}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
