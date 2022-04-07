import { Link } from "@remix-run/react";

const AppBar = () => {
  return (
    <nav className="navbar bg-base-100 p-4">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl normal-case" to="/topics">deeptalk</Link>
      </div>
    </nav>
  );
};

export default AppBar;
