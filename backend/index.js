import express from 'express'
import mysql, { createConnection } from 'mysql2'
const app = express()
import cors from 'cors'
import jwt from 'jsonwebtoken';

const SECRET_KEY = '12345678'; // change it later to a strong random string


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2009",
  database: "lib_mgmt"
})

app.use(express.json()) //middleware to send POST api requests from postman for adding new data
app.use(cors())





//routes
app.get("/",(req,res)=>{
  res.json("Hello this is the backend!!")
})

app.post("/register", (req, res) => {
  const q = 'INSERT INTO users (`email`, `password`) VALUES (?)';
  const values = [
    req.body.email,
    req.body.password
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("User registered successfully!");
  });
});

app.post("/login", (req, res) => {
  const q = 'SELECT * FROM users WHERE email = ?';

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const user = data[0];
    
    if (user.password !== req.body.password) {
      return res.status(401).json("Wrong password!");
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ token });
  });
});


app.get("/books",(req,res)=>{
  const q1 = 'SELECT * FROM books'
  db.query(q1, (err,data)=>{
    if (err) return res.json(err)
    return res.json(data)
  }) 
})

app.post("/books",(req, res)=>{
  const q2 = 'INSERT INTO BOOKS (`title`,`desc`,`cover`,`price`) VALUES (?)'
  // const q2Values = [
  //   "Book title 1 from vsc",
  //    "Book desc 1 from vsc",
  //     "Book cover from vsc",
  //     300 
  //   ]
  const q2Values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.price
  ]
  db.query(q2, [q2Values], (err,data)=>{
    if (err) return res.json(err);
    return res.json("Book created successfully");
  })
})

app.delete("/books/:id", (req, res)=>{
  const bookId = req.params.id
  const q3 = 'DELETE FROM BOOKS WHERE ID = ?'
  db.query(q3, [bookId], (err,data) =>{
    if(err) return res.json(err)
    return res.json("Book deleted successfully!!")
  })
})

app.put("/books/:id", (req, res)=>{
  const bookId = req.params.id
  const q3 = 'UPDATE BOOKS SET `title` = ?,`desc` = ?,`cover` = ?,`price` = ? WHERE ID = ?'
  const q3Values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.price
  ]
  db.query(q3, [...q3Values,bookId], (err,data) =>{
    if(err) return res.json(err)
    return res.json("Book updated successfully!!")
  })
})

app.listen(5000, ()=>{
  console.log('Connected to backend!')
})