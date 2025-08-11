import logo from './img/logo.png'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FaceARNavbar.css';
import { Link } from 'react-router-dom';

function FaceARNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Link to='/' className="navbar-brand">
            <img
              alt=""
              src={logo}
              width="28"
              height="28"
              className="d-inline-block align-top mx-2"
            />FaceAR</Link>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end">
          <Offcanvas.Header closeButton>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Link to="/about" className="nav-link">About</Link>
              <NavDropdown title="Demo" id="demo-nav-dropdown">
                <NavDropdown.Item as={Link} to="/demo/basic">Basic</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/demo/jump-game">Jump Game</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/demo/timer">Timer</NavDropdown.Item>
              </NavDropdown>
              <Link to="mailto:facearteam@umich.edu" className="nav-link">Contact</Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default FaceARNavbar;