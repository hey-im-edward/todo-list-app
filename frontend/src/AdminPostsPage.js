import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    } else {
      fetchPosts();
    }
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setPosts(res.data);
    } catch (err) {
      setError('Không thể lấy danh sách bài viết');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/posts', { title, content }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setTitle('');
      setContent('');
      setSuccess('Tạo bài viết thành công!');
      fetchPosts();
    } catch (err) {
      setError('Không thể tạo bài viết');
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/posts/${editId}`, { title: editTitle, content: editContent }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      setSuccess('Cập nhật bài viết thành công!');
      fetchPosts();
    } catch (err) {
      setError('Không thể cập nhật bài viết');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setSuccess('Đã xóa bài viết!');
      fetchPosts();
    } catch (err) {
      setError('Không thể xóa bài viết');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Quản lý bài viết/thông báo</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '40%', marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Nội dung"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          style={{ width: '40%', marginRight: 8 }}
        />
        <button type="submit">Tạo mới</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(post => (
          <li key={post._id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            {editId === post._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  style={{ width: '30%', marginRight: 8 }}
                />
                <input
                  type="text"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  required
                  style={{ width: '40%', marginRight: 8 }}
                />
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: 8 }}>Hủy</button>
              </form>
            ) : (
              <>
                <strong>{post.title}</strong> <span style={{ color: '#888' }}>({post.author?.username || 'admin'})</span>
                <div>{post.content}</div>
                <button onClick={() => handleEdit(post)} style={{ marginRight: 8 }}>Sửa</button>
                <button onClick={() => handleDelete(post._id)}>Xóa</button>
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

export default AdminPostsPage;
