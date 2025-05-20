import React, { useState } from 'react';

function PageItem({ page, pages, onEdit, onDelete, onAdd, level = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(page.title);

  const children = pages.filter(p => String(p.parent) === String(page._id));

  const handleEdit = () => {
    if (editing && title !== page.title) onEdit(page._id, { title });
    setEditing(!editing);
  };

  return (
    <div>
      <div
        className={`flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer`}
        style={{ paddingLeft: 16 + level * 16 }}
      >
        {children.length > 0 && (
          <span className="mr-1 select-none" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'}
          </span>
        )}
        <span className="mr-2">{page.icon || '📄'}</span>
        {editing ? (
          <input
            className="bg-transparent border-b border-gray-400 dark:text-white w-24"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={e => e.key === 'Enter' && handleEdit()}
            autoFocus
          />
        ) : (
          <span className="flex-1 dark:text-white" onDoubleClick={() => setEditing(true)}>
            {page.title}
          </span>
        )}
        <button className="ml-2 text-xs text-blue-500" onClick={() => onAdd(page._id)}>+</button>
        <button className="ml-1 text-xs text-yellow-500" onClick={() => setEditing(true)}>✏️</button>
        <button className="ml-1 text-xs text-red-500" onClick={() => onDelete(page._id)}>🗑️</button>
      </div>
      {expanded && children.map(child => (
        <PageItem
          key={child._id}
          page={child}
          pages={pages}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          level={level + 1}
        />
      ))}
    </div>
  );
}

export default PageItem;
