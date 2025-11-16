import Header from "../../components/Header"
import { supabase } from "../../utils/supabaseClient"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function RimuoviProdotto() {
  const router = useRouter()
  const { id } = router.query

  const [prodotto, setProdotto] = useState(null)

  useEffect(() => {
    if (id) loadProdotto()
  }, [id])

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single()
    setProdotto(data)
  }

  async function confermaRimozione() {
    if (!confirm("Sei sicuro di voler rimuovere questo prodotto?")) return
    await supabase.from("prodotti").delete().eq("id", id)
    alert("Prodotto rimosso!")
    router.push("/")
  }

  if (!prodotto) return <><Header /><div className="container">Caricamento...</div></>

  return (
    <>
      <Header />
      <div className="container">
        <h2>Rimuovi Prodotto</h2>
        <div className="card p-3">
          <p><strong>Nome:</strong> {prodotto.nome}</p>
          <p><strong>Marca:</strong> {prodotto.marca}</p>
          <p><strong>Categoria:</strong> {prodotto.categoria}</p>
          <p><strong>Sottocategoria:</strong> {prodotto.sottocategoria}</p>
          <p><strong>Formato:</strong> {prodotto.formato}</p>
          <p><strong>Note:</strong> {prodotto.note}</p>
          <button className="btn btn-danger" onClick={confermaRimozione}>Rimuovi Prodotto</button>
        </div>
      </div>
    </>
  )
}
