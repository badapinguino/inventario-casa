import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Add() {
  const [products, setProducts] = useState([])
  const [prodottoId, setProdottoId] = useState('')
  const [quantita, setQuantita] = useState(1)
  const [scadenza, setScadenza] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('prodotti')
      .select('id, nome')
      .order('nome', { ascending: true })
    if (!error) setProducts(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prodottoId || !quantita || !scadenza) return

    const { error } = await supabase
      .from('lotti')
      .insert([{ prodotto_id: prodottoId, quantita, data_scadenza: scadenza }])
    if (!error) router.push('/')
    else alert('Errore inserimento lotto')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Aggiungi Lotto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Prodotto:</label>
          <select value={prodottoId} onChange={(e) => setProdottoId(e.target.value)}>
            <option value="">Seleziona prodotto</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantità:</label>
          <input type="number" value={quantita} min="1" onChange={(e) => setQuantita(e.target.value)} />
        </div>
        <div>
          <label>Data scadenza:</label>
          <input type="date" value={scadenza} onChange={(e) => setScadenza(e.target.value)} />
        </div>
        <button type="submit">Aggiungi</button>
      </form>
    </div>
  )
}