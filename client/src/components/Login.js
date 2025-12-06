import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { setUser, setToken } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setToken(data.token);

                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                setMessage('Login exitoso');

                navigate('/dashboard');
            } else {
                setMessage(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            setMessage('Error de conexión');
            console.error(error);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
                {message && <p className="mt-3 text-danger text-center">{message}</p>}
            </form>
        </div>

    );
}

export default Login;
