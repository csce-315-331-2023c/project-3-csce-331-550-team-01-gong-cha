import express from 'express';
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({path: 'Credentials.env'} );
//Create experss app
const app = express();
const port: number = 5000;

//create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: parseInt(process.env.PSQL_PORT || '5432'),
    ssl: {
        rejectUnauthorized: false,
    }
});

// Add a process hook to shut down the pool on SIGINT
process.on('SIGINT', function () {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
  });
  
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
const data = { name: 'Mario' };
res.json(data);
});


app.get('/employees', (req, res) => {
    pool
      .query('SELECT * FROM Employee') // Use the correct table name
      .then((query_res) => {
        if (query_res.rows.length === 0) {
          res.status(404).json({ error: 'No employees found' });
        } else {
          res.json(query_res.rows);
        }
      })
      .catch((error) => {
        console.error('Error executing the SQL query:', error);
        res.status(500).json({ error: error.message });
      });
  });

app.listen(port, () => {
console.log(`Example listening at  http://localhost:${port}`);
});