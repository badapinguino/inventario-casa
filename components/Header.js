import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">Inventario Casa</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" href="/prodotti">Prodotti</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/aggiungi">Aggiungi</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/modifica">Modifica</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/rimuovi">Rimuovi</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
