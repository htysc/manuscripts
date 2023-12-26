import { Outlet, Link, useLocation } from "react-router-dom"
import logo from "../../img/logo.png"

const Layout = () => {
  const location = useLocation();
  const url = location.pathname;

  return <>
    <div className="page-container">
      <div className="content-wrap bg-container">
        <header className="mb-5">
          <nav className="navbar navbar-expand navbar-dark bg-dark navbar-static-top">
            <div className="container-fluid">
              <div className="navbar-brand">
                <img src={logo} width="40" height="40" className="d-inline-block align-top border border-dark rounded-circle bg-light" alt='Manuscripts Logo' />
              </div>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className={`nav-link btn btn-link text-decoration-none text-light${url.startsWith('/register') ? ' active' : ''}`} to="/register">Register</Link>
                </li>
                <li className="nav_item">
                  <Link className={`nav-link btn btn-link text-decoration-none text-light${url.startsWith('/login') ? ' active' : ''}`} to="/login">Login</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <footer className="mt-5 bg-dark text-light">
        <p className="text-center mb-0">&copy;2023 Subhasis Chakraborti.</p>
      </footer>
    </div>
  </>;
}

export default Layout;
