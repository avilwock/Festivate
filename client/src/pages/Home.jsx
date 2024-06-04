import { Link } from 'react-router-dom';
import './Home.css';
import eventImage1 from '../assets/festivate-stock1.png';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Festivate</h1>
            <p className="slogan">Celebrations Perfected</p>


            <section className="home-content">
                <div className="home-images">
                    <img src={eventImage1} alt="Event 1" className="event-image" />
                </div>
                <div className="home-summary">
                    <p>Welcome to Festivate, where every moment becomes a masterpiece. Whether you're planning a birthday bash, a corporate gala, or an intimate wedding, we're here to make your celebrations unforgettable. <Link to="/Signup">Sign up</Link> or <Link to="/Login">log in</Link> to get started on creating the perfect event today.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;