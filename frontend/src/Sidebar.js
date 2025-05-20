import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageItem from './PageItem';

function Sidebar() {
  const [pages, setPages] = useState([]);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchPages = async () => {
    const res = await axios.get('http://localhost:5000/api/pages');
    setPages(res.data);
  };

  const handleAdd = async (parent = null) => {
    const title = window.prompt('Tên trang mới:');
    if (!title) return;
    await axios.post('http://localhost:5000/api/pages', { title, parent });
    fetchPages();
  };

  const handleEdit = async (id, updates) => {
    await axios.put(`http://localhost:5000/api/pages/${id}`, updates);
    fetchPages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa trang này?')) return;
    await axios.delete(`http://localhost:5000/api/pages/${id}`);
    fetchPages();
  };

  // Phân nhóm
  const favoritePages = pages.filter(p => p.isFavorite);
  const privatePages = pages.filter(p => !p.isFavorite && !p.parent);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-bold text-lg dark:text-white">Notion Sidebar</span>
        <button
          className="ml-2 text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
          onClick={() => setDarkMode(d => !d)}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {favoritePages.length > 0 && (
          <div>
            <h2 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-300">Favorites</h2>
            {favoritePages.map(p => (
              <PageItem
                key={p._id}
                page={p}
                pages={pages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}
        <div>
          <h2 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-300">Private</h2>
          {privatePages.map(p => (
            <PageItem
              key={p._id}
              page={p}
              pages={pages}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <button
          className="flex items-center text-blue-600 dark:text-blue-400"
          onClick={() => handleAdd(null)}
        >
          <span className="mr-1">+</span> Tạo trang mới
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;