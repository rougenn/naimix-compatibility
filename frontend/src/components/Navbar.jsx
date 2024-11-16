import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="navbar-center-links">
                <a href="#section1" className="navbar-section-button">About us</a>
                <a href="#section2" className="navbar-section-button">Funnctional</a>
                <a href="#section3" className="navbar-section-button">Feedback</a>
            </div>
            <div className="navbar-links">
                <button className="navbar-button" onClick={() => navigate('/login')}>log in</button>
                <button className="navbar-button" onClick={() => navigate('/register')}>sign up</button>
            </div>
        </div>
    );
};

export default Navbar;
