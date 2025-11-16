export default function ProdottoList({prodotti}) {
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Nome</th><th>Marca</th><th>Categoria</th><th>Sottocategoria</th><th>Formato</th><th>Quantità totale</th><th>Prossima scadenza</th>
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
            <td>{p.quantita_totale}</td>
            <td>{p.prossima_scadenza}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
