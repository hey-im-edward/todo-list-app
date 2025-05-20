import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TodoListPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setTasks(res.data);
    } catch (err) {
      setError('Lỗi xác thực, vui lòng đăng nhập lại');
      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 1500);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { title }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setTitle('');
      fetchTasks();
    } catch (err) {
      setError('Không thể thêm task');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      fetchTasks();
    } catch (err) {
      setError('Không thể cập nhật task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      fetchTasks();
    } catch (err) {
      setError('Không thể xóa task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Quản lý công việc</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Thêm công việc mới"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '70%', marginRight: 8 }}
        />
        <button type="submit">Thêm</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.length === 0 && <li>Chưa có công việc nào.</li>}
        {tasks.map(task => (
          <li key={task._id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task._id, task.completed)}
              style={{ marginRight: 8 }}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>
              {task.title}
            </span>
            <button onClick={() => handleDelete(task._id)} style={{ marginLeft: 8 }}>Xóa</button>
          </li>
        ))}
      </ul>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ marginTop: 20 }}>
        Đăng xuất
      </button>
    </div>
  );
}

export default TodoListPage;
