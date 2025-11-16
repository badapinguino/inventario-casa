import Header from "../components/Header"
import { supabase } from "../utils/supabaseClient"
import Link from "next/link"

export default function Home({ prodotti }) {
  return (
    <>
      <Header />
      <div className="container">
        <h2>Inventario Prodotti</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Sottocategoria</th>
              <th>Formato</th>
              <th>Note</th>
              <th>Quantità totale</th>
              <th>Prossima scadenza</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map(p => (
              <tr key={p.prodotto_id}>
                <td>{p.nome}</td>
                <td>{p.marca}</td>
                <td>{p.categoria}</td>
                <td>{p.sottocategoria}</td>
                <td>{p.formato}</td>
                <td>{p.note}</td>
                <td>{p.quantita_totale}</td>
                <td>{p.prossima_scadenza || '-'}</td>
                <td>
                  <Link href={`/modifica/${p.prodotto_id}`} className="btn btn-sm btn-warning me-1">Modifica</Link>
                  <Link href={`/rimuovi/${p.prodotto_id}`} className="btn btn-sm btn-danger">Rimuovi</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: prodotti } = await supabase.from("v_inventario").select("*").order("nome")
  return { props: { prodotti } }
}
