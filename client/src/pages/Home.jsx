/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsAuthenticated(true);
        navigate('/profile');
    };

    const handleSignUp = () => {
        setIsAuthenticated(true);
        navigate('/profile');
    };

    return (
        <div>
            <h1>Celebrations Perfected.</h1>
        </div>
    );
};

export default Home; */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const handleLogin = () => {
        setIsAuthenticated(true);
        navigate('/profile');
    };

    return (
        <div>
            <h1>Celebrations Perfected.</h1>
        </div>
    );
};

export default Home;