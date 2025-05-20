import React, { useState } from 'react';

function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    setExpenses([
      ...expenses,
      { id: Date.now(), desc, amount: parseFloat(amount) }
    ]);
    setDesc('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <h3>Quản lý Chi Tiêu</h3>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Mô tả"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          placeholder="Số tiền"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">Thêm</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {expenses.map(exp => (
          <li key={exp.id} style={{ marginBottom: 8 }}>
            {exp.desc}: <strong>{exp.amount.toLocaleString()} đ</strong>
            <button onClick={() => handleDelete(exp.id)} style={{ marginLeft: 8 }}>Xóa</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>
        <strong>Tổng chi tiêu: {total.toLocaleString()} đ</strong>
      </div>
    </div>
  );
}

export default ExpenseManager;
