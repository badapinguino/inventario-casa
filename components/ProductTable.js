export default function ProductTable({ products }) {
  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Marca</th>
          <th>Categoria</th>
          <th>Sottocategoria</th>
          <th>Formato</th>
          <th>Quantità Totale</th>
          <th>Prossima Scadenza</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.prodotto_id}>
            <td>{p.prodotto_id}</td>
            <td>{p.nome}</td>
            <td>{p.marca}</td>
            <td>{p.categoria}</td>
            <td>{p.sottocategoria}</td>
            <td>{p.formato}</td>
            <td>{p.quantita_totale}</td>
            <td>{p.prossima_scadenza ? new Date(p.prossima_scadenza).toLocaleDateString() : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}