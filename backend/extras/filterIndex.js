
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState(""); //To add filter
  const navigate = useNavigate(); // To handle redirection

//   useEffect(() => {
//     // Fetch all books
//     const fetchAllBooks = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/books"); 
//         setBooks(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchAllBooks();
//  }, []); 

const fetchFilteredBooks = useCallback(async () => {
  try {
    const url =
      filter && filter.toLowerCase() !== "all"
        ? `http://localhost:5000/books?status=${filter}`
        : "http://localhost:5000/books";
    const res = await axios.get(url);
    setBooks(res.data);
  } catch (err) {
    console.log(err);
  }
}, [filter]); 

useEffect(() => {
  fetchFilteredBooks();
}, [fetchFilteredBooks]);

const handleClearFilter = () => {
  setFilter(""); 
};


  const handleDelete = async (id) => {
    // Check if user is logged in
    if (!localStorage.getItem("token")) {
      alert("Please login to delete a book.");
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      await axios.delete("http://localhost:5000/books/" + id);
      setBooks(books.filter(book => book.id !== id)); // Optimistic UI Update
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <h1>My Book Shop</h1>

      {/* Display logout button only if user is logged in */}
      {localStorage.getItem("token") && (
        <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
          Logout
        </button>
      )}

      {/* Show Login/Register buttons if user is not logged in */}
      {!localStorage.getItem("token") && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register" style={{ marginLeft: "10px" }}>
            <button>Register</button>
          </Link>
        </div>
      )}

       {/* Filter input field */}
      <div>
        <label htmlFor="statusFilter">Enter Filter (all, read, pending):</label>
        <input 
          type="text" 
          id="statusFilter" 
          value={filter} 
          className="filterField"
          onChange={(e) => setFilter(e.target.value)} 
          placeholder="Filter by status" 
        />
        {/* Button to trigger the filter */}
        <button onClick={fetchFilteredBooks} style={{ marginLeft: "10px" }}>
          Filter
        </button>

        {/* Clear Filter Button */}
        <button onClick={handleClearFilter} style={{ marginLeft: "10px" }}>
          Clear Filter
        </button>
      </div>

      <div className='books'>
        {books.map((book) => (
          <div className='book' key={book.id}>
            {book.cover && <img src={book.cover} alt="" />}
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <p>{book.price}</p>
            <p>{book.status}</p>
            
            {/* Always show the buttons */}
            <button>
              <Link to={`/update/${book.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                Update Book
              </Link>
            </button>

            <button onClick={() => handleDelete(book.id)}>Delete Book</button>
          </div>
        ))}
      </div>

      {/* Always show the Add Book button */}
      <button>
        <Link to="/add" style={{ textDecoration: "none", color: "inherit" }}>
          Add Book
        </Link>
      </button>

      
    </div>
  );
};

export default Books;

