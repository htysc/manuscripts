import { Outlet, Link } from "react-router-dom"
import logo from "../../img/logo.png"
import { useContext } from "react";
import { APIContext } from "../../contexts/APIContext";

const Layout = () => {
  const context = useContext(APIContext);

  return <>
    <div className="page-container">
      <div className="content-wrap bg-container">
        <header className="mb-5">
          <nav className="navbar navbar-expand navbar-dark bg-dark navbar-static-top">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                <img src={logo} width="40" height="40" className="d-inline-block align-top border border-dark rounded-circle bg-light" alt='Manuscripts Logo' />
                <span className="align-middle ms-2">Home</span>
              </Link>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="btn btn-link text-decoration-none text-light" to={`/profile/${context.id}/`}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-link text-decoration-none text-light" to={`/logout`}>Logout</Link>
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
