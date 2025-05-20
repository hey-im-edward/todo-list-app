import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminExtensionsPage() {
  const [extensions, setExtensions] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    } else {
      fetchExtensions();
    }
    // eslint-disable-next-line
  }, []);

  const fetchExtensions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/extensions', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setExtensions(res.data);
    } catch (err) {
      setError('Không thể lấy danh sách extension');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/extensions', { name, description }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setName('');
      setDescription('');
      setSuccess('Tạo extension thành công!');
      fetchExtensions();
    } catch (err) {
      setError('Không thể tạo extension');
    }
  };

  const handleEdit = (ext) => {
    setEditId(ext._id);
    setEditName(ext.name);
    setEditDescription(ext.description);
    setEditStatus(ext.status);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/extensions/${editId}`, { name: editName, description: editDescription, status: editStatus }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setEditId(null);
      setEditName('');
      setEditDescription('');
      setEditStatus('pending');
      setSuccess('Cập nhật extension thành công!');
      fetchExtensions();
    } catch (err) {
      setError('Không thể cập nhật extension');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa extension này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/extensions/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setSuccess('Đã xóa extension!');
      fetchExtensions();
    } catch (err) {
      setError('Không thể xóa extension');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Quản lý Extension</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tên extension"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: '30%', marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ width: '40%', marginRight: 8 }}
        />
        <button type="submit">Tạo mới</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {extensions.map(ext => (
          <li key={ext._id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            {editId === ext._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  style={{ width: '20%', marginRight: 8 }}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                  style={{ width: '40%', marginRight: 8 }}
                />
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ marginRight: 8 }}>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                </select>
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: 8 }}>Hủy</button>
              </form>
            ) : (
              <>
                <strong>{ext.name}</strong> <span style={{ color: '#888' }}>({ext.status})</span>
                <div>{ext.description}</div>
                <button onClick={() => handleEdit(ext)} style={{ marginRight: 8 }}>Sửa</button>
                <button onClick={() => handleDelete(ext._id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); }} style={{ marginTop: 20 }}>
        Đăng xuất
      </button>
    </div>
  );
}

export default AdminExtensionsPage;
