import { Outlet, Link } from "react-router-dom"

const Layout = () => {
  return <>
    <div className="page-container">
      <div className="content-wrap bg-container">
        <header className="mb-5">
          <nav className="navbar navbar-expand navbar-dark bg-dark navbar-static-top">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">Home</Link>
              <form className="form-inline bg-dark" action="/logout" method="GET">
                <button className="btn btn-link text-decoration-none text-light" type="submit">Log out</button>
              </form>
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
