import Link from 'next/link';

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">Inventario Casa</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link href="/" className="nav-link">Inventario</Link></li>
            <li className="nav-item"><Link href="/aggiungi" className="nav-link">Aggiungi</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
