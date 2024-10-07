import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddBookForm from './AddBook';
import UpdateBookForm from './UpdateBookForm';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get('/api/books');
      setBooks(data);

      const uniqueCategories = [...new Set(data.map(book => book.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBookAdded = () => {
    fetchBooks();
  };

  const handleBookUpdated = () => {
    fetchBooks();
    setEditingBook(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const filteredBooks = selectedCategory
    ? books.filter(book => book.category === selectedCategory)
    : books;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {editingBook ? (
        <UpdateBookForm book={editingBook} onBookUpdated={handleBookUpdated} />
      ) : (
        <AddBookForm onBookAdded={handleBookAdded} />
      )}
      <div className="my-4">
        <label htmlFor="category" className="block text-gray-700 mb-2">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        >
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {filteredBooks.map(book => (
          <li key={book._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{book.title}</div>
              <div className="text-gray-700">by {book.author}</div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(book)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookPage;
