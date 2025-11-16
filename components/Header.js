import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand">Inventario Casa</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Prodotti</Link>
            </li>
            <li className="nav-item">
              <Link href="/aggiungi" className="nav-link">Aggiungi</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
