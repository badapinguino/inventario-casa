export default function ProdottoList({ prodotti }) {
  return (
    <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
      <thead>
        <tr>
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
        {prodotti.map((p) => (
          <tr key={p.prodotto_id || p.id}>
            <td>{p.nome}</td>
            <td>{p.marca}</td>
            <td>{p.categoria}</td>
            <td>{p.sottocategoria}</td>
            <td>{p.formato}</td>
            <td>{p.quantita_totale ?? "-"}</td>
            <td>{p.prossima_scadenza ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
