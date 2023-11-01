"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Create experss app
const app = (0, express_1.default)();
const port = 5000;
//create pool
const pool = new pg_1.Pool({
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
    const employees = []; // Define the type of your 'employees' array
    pool
        .query('SELECT * FROM employee;')
        .then((query_res) => {
        for (let i = 0; i < query_res.rowCount; i++) {
            employees.push(query_res.rows[i]);
        }
        res.json(employees);
    })
        .catch((error) => {
        console.error('Error executing the SQL query:', error);
        res.status(500).json({ error: error.message }); // Send the error message to the client
    });
});
app.listen(port, () => {
    console.log(`Example listening at  http://localhost:${port}`);
});
