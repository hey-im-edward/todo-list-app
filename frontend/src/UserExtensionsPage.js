import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseManager from './ExpenseManager';

function UserExtensionsPage() {
  const [extensions, setExtensions] = useState([]);
  const [installed, setInstalled] = useState(() => {
    // Lưu các extension đã cài vào localStorage
    const data = localStorage.getItem('userExtensions');
    return data ? JSON.parse(data) : [];
  });
  const [activeExtension, setActiveExtension] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/extensions', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setExtensions(res.data);
    } catch (err) {
      setExtensions([]);
    }
  };

  const handleInstall = (id) => {
    const newInstalled = [...installed, id];
    setInstalled(newInstalled);
    localStorage.setItem('userExtensions', JSON.stringify(newInstalled));
  };

  const handleUninstall = (id) => {
    const newInstalled = installed.filter(eid => eid !== id);
    setInstalled(newInstalled);
    localStorage.setItem('userExtensions', JSON.stringify(newInstalled));
    if (activeExtension === id) setActiveExtension(null);
  };

  const renderExtension = (ext) => {
    if (ext.name.toLowerCase().includes('chi tiêu')) {
      return <ExpenseManager />;
    }
    // Có thể mở rộng cho các extension khác ở đây
    return <div>Extension này chưa có giao diện.</div>;
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Kho Extension</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {extensions.map(ext => (
          <li key={ext._id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <strong>{ext.name}</strong> <span style={{ color: '#888' }}>({ext.status})</span>
            <div>{ext.description}</div>
            {installed.includes(ext._id) ? (
              <>
                <button onClick={() => setActiveExtension(ext._id)} style={{ marginRight: 8 }}>Mở</button>
                <button onClick={() => handleUninstall(ext._id)}>Gỡ</button>
              </>
            ) : (
              <button onClick={() => handleInstall(ext._id)}>Cài đặt</button>
            )}
            {activeExtension === ext._id && (
              <div style={{ marginTop: 16, background: '#fafafa', padding: 16, borderRadius: 8 }}>
                {renderExtension(ext)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserExtensionsPage;
