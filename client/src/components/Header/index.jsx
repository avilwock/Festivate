// Header.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Auth from '../../utils/auth';
import InstallButton from '../InstallButton';

const Header = () => {
  const navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    navigate('/Home');
  };

  return (
    <header className="header bg-info mb-4 py-3">
      <div className="container flex-column align-center text-center">
        <Link className="header-link" to="/">
          <h1 className="m-0" style={{ fontSize: '3rem' }}>Festivate</h1>
        </Link>
        <nav className="nav-links">
          <Link className="btn btn-lg btn-primary m-2" to="/">Home</Link>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/me">View My Profile</Link>
              <Link className="btn btn-lg btn-primary m-2" to="/events">Events</Link>
              <button className="btn btn-lg btn-light m-2" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-primary m-2" to="/login">Login</Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">Signup</Link>
            </>
          )}
          <InstallButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
