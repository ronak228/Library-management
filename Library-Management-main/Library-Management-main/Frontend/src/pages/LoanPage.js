// frontend/src/pages/loanpage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddLoanForm from './AddLoanForm';

const LoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchLoans();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchLoans = async () => {
    try {
      const { data } = await axios.get('/api/loans');
      setLoans(data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get('/api/books');
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleLoanAdded = () => {
    fetchLoans();
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`/api/loans/return/${id}`);
      fetchLoans();
    } catch (error) {
      console.error('Error returning loan:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/loans/${id}`);
      fetchLoans();
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Loans</h1>
      <AddLoanForm users={users} books={books} onLoanAdded={handleLoanAdded} />
      <ul className="space-y-4">
        {loans.map(loan => (
          <li key={loan._id} className="bg-white shadow rounded-lg p-4">
            <div>
              <strong>Book:</strong> {loan.book ? loan.book.title : 'N/A'}
            </div>
            <div>
              <strong>Borrowed by:</strong> {loan.user ? loan.user.name : 'N/A'}
            </div>
            <div>
              <strong>Loan Date:</strong> {new Date(loan.loanDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}
            </div>
            {loan.returned ? (
              <div className="text-green-600">Returned</div>
            ) : (
              <button
                onClick={() => handleReturn(loan._id)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Return
              </button>
            )}
            {loan.fine > 0 && <div className="text-red-600">Fine: ${loan.fine}</div>}
            <button
              onClick={() => handleDelete(loan._id)}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanPage;
