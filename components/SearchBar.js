export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Cerca per nome o marca"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ marginBottom: '20px', width: '300px', padding: '5px' }}
    />
  )
}