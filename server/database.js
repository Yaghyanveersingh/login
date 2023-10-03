const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(
  'notesdatabase.db',
  sqlite3.OPEN_READWRITE,
  err => {
    if (err) return console.error(err.message)

    console.log('connection successful')
  },
) // Replace with your database file name

// Create a table for user accounts
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS login (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT
    )
  `)

  // Create a table for notes
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT ,
      description TEXT,
      user_id INTEGER ,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
  // creat a table for users username, name, password, gender,
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT ,
      password TEXT ,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
  // Insert dummy user data
  const userInsert = db.prepare(
    'INSERT INTO login (email, password) VALUES (?, ?)',
  )

  userInsert.run('user1@example.com', 'hashed_password_1')
  userInsert.run('user2@example.com', 'hashed_password_2')
  userInsert.finalize()

  // Insert dummy notes data
  const notesInsert = db.prepare(
    'INSERT INTO notes (title, description, user_id) VALUES (?, ?, ?)',
  )
  notesInsert.run('Note 1', 'This is the first note', 1) // Note associated with user 1
  notesInsert.run('Note 2', 'This is the second note', 1) // Note associated with user 1
  notesInsert.run('Note 3', 'This is the third note', 2) // Note associated with user 2
  notesInsert.finalize()
  // Insert dummy users data
  const usersInsert = db.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?)',
  )
  usersInsert.run('user1@example.com', 'hashed_password_1') // Note associated with user 1
  usersInsert.run('user2@example.com', 'hashed_password_2') // Note associated with user 1

  usersInsert.finalize()

  db.each('SELECT * FROM login', (err, row) => {
    if (err) {
      console.error(err.message)
    }
    console.log(
      `User ID: ${row.id}, email: ${row.email}, password: ${row.password}`,
    )
  })

  db.each('SELECT * FROM notes', (err, row) => {
    if (err) {
      console.error(err.message)
    }
    console.log(
      `Id: ${row.id}, title: ${row.title}, description: ${row.description},user_id:${row.user_id}`,
    )
  })

  db.each('SELECT * FROM users', (err, row) => {
    if (err) {
      console.error(err.message)
    }
    console.log(`Id: ${row.id}, email: ${row.email}, password:${row.password}`)
  })

  // Close the database connection
  db.close(err => {
    if (err) {
      console.error('Error closing the database:', err.message)
    } else {
      console.log('Database connection closed.')
    }
  })
})
