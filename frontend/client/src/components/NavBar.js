import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';

export default function Navbar() {
    const dispatch = useDispatch();
      const { isAuthenticated } = useSelector(state => state.user);
  
      const authLinks = (
      <ul className="bold-values">
        <li className="line-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="line-item">
          <Link to="/marketbasket">MarketBasket</Link>
        </li>
        <li className="line-item">
          <Link to="/mappingtable">Mapping Tables</Link>
        </li>
        <li className="line-item">
          <Link to="/category">Attributes</Link>
        </li>
        <li className="line-item">
          <Link to='#!' onClick={() => dispatch(logout())}>
            Logout
          </Link>
        </li>
      </ul>
      );
  
    const guestLinks = (
      <ul className="bold-values">
        <li className="line-item">
          <Link to="/">Home</Link>
        </li>
        <li className="line-item">
          <Link to="/login">Login</Link>
        </li>
        <li className="line-item">
          <Link to="/register">Register</Link>
        </li>
        <li className="line-item">
          <Link to="/category">Attributes</Link>
        </li>
      </ul>
      );
  
    return (
      <nav className='nav'>
        {isAuthenticated ? authLinks : guestLinks}
      </nav>
    );
  }