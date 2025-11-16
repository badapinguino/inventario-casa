import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductTable from '../components/ProductTable'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('v_inventario')
      .select('*')
      .order('nome', { ascending: true })
    if (!error) setProducts(data)
  }

  const filtered = products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.marca.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '20px' }}>
      <h1>Inventario Cantina</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <ProductTable products={filtered} />
    </div>
  )
}