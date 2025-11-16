import Header from '../components/Header';
import ProdottoList from '../components/ProdottoList';
import { useEffect, useState } from 'react';

export default function Home() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    fetch('/api/prodotti')
      .then(res => res.json())
      .then(data => setProdotti(data));
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1>Inventario</h1>
        <ProdottoList prodotti={prodotti} />
      </div>
    </>
  );
}
