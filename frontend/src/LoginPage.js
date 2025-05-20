import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', username);
      if (res.data.role === 'admin') {
        navigate('/admin/posts');
      } else {
        navigate('/extensions');
      }
    } catch (err) {
      setError('Sai username hoặc password');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Chưa có tài khoản? <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => navigate('/register')}>Đăng ký</span></p>
    </div>
  );
}

export default LoginPage;
