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
    <div>
      <h2>To-Do List</h2>
      <button onClick={handleLogout}>Đăng xuất</button>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Thêm việc mới..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span onClick={() => handleToggle(task._id, task.completed)} style={{ cursor: 'pointer' }}>{task.title}</span>
            <button onClick={() => handleDelete(task._id)} style={{ marginLeft: 8 }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoListPage;
