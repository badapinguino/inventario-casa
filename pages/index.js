import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Inventario Casa</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/prodotti">Prodotti</Nav.Link>
            <Nav.Link as={Link} href="/inventario">Inventario</Nav.Link>
            <Nav.Link as={Link} href="/aggiungi">Aggiungi</Nav.Link>
            <Nav.Link as={Link} href="/rimuovi">Rimuovi</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1>Benvenuto nell'Inventario Casa</h1>
        <p>Usa il menu per gestire prodotti e lotti.</p>
      </Container>
    </>
  );
}
