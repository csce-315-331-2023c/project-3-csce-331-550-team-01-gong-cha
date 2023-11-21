import express from 'express';
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({path: 'Credentials.env'} );
//Create experss app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port: number = 4000;
const serverUrl: String = `http://localhost:${port}`;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
if (req.method == "OPTIONS") {
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  return res.status(200).json({});
}

next();
});

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


//From here down is where the converted functions will go

app.get('/', (req, res) => {
const data = { name: 'Mario' };
res.json(data);
});

//gets all the employees
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

//gets all menu drinks
app.get('/menu-drink', (req, res) => {
  pool
    .query('SELECT * FROM menu_drink') // Use the correct table name
    .then((query_res) => {
      if (query_res.rows.length === 0) {
        res.status(404).json({ error: 'No menu drinks found' });
      } else {
        res.json(query_res.rows);
      }
    })
    .catch((error) => {
      console.error('Error executing the SQL query:', error);
      res.status(500).json({ error: error.message });
    });
});

//gets all the ingredients
app.get('/ingredients', (req, res) => {
  pool
    .query('SELECT * FROM Ingredient') // Use the correct table name
    .then((query_res) => {
      if (query_res.rows.length === 0) {
        res.status(404).json({ error: 'No ingredients found' });
      } else {
        res.json(query_res.rows);
      }
    })
    .catch((error) => {
      console.error('Error executing the SQL query:', error);
      res.status(500).json({ error: error.message });
    });
});

//function that drops the tables from the database
async function dropTables(): Promise<number> {
  const SQL = `
    DROP TABLE employee CASCADE;
    DROP TABLE ingredient CASCADE;
    DROP TABLE ingredient_order_drink CASCADE;
    DROP TABLE menu_drink CASCADE;
    DROP TABLE menu_drink_ingredient CASCADE;
    DROP TABLE order_drink CASCADE;
    DROP TABLE order_order_drink CASCADE;
    DROP TABLE orders CASCADE;
  `;

  try {
    const client = await pool.connect();
    await client.query(SQL);
    client.release();
    return 1; // Return 1 to indicate success, you can change this based on your needs.
  } catch (error) {
    console.error('Error dropping tables:', error);
    return 0; // Return 0 to indicate failure, you can change this based on your needs.
  }
}
app.get('/drop-tables', async (req, res) => {
  try {
    const result = await dropTables();
    if (result === 1) {
      res.json({ message: 'Tables dropped successfully' });
    } else {
      res.status(500).json({ error: 'Failed to drop tables' });
    }
  } catch (error) {
    console.error('Error dropping tables:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

async function createOrderDrink(
  toppingCost: number,
  size: number,
  mdID: number,
  iceLevel: number,
  sugarLevel: number
): Promise<number[]> {
  let total_price = 0;
  let drink_price = 0;
  let make_cost = 0;

  const sizeStr = size.toString();
  const drinkID = mdID.toString();
  const ice = iceLevel.toString();
  const sugar = sugarLevel.toString();

  let priceQuery = "";
  if (size === 0) {
    priceQuery = `SELECT norm_consumer_price AS consumer_price, Normal_Cost AS make_cost FROM menu_drink WHERE ID = $1`;
  } else if (size === 1) {
    priceQuery = `SELECT lg_consumer_price AS consumer_price, Large_Cost AS make_cost FROM menu_drink WHERE ID = $1`;
  }

  try {
    const client = await pool.connect();
    const priceResult = await client.query(priceQuery, [mdID]);
    client.release();

    if (priceResult.rows.length > 0) {
      drink_price = priceResult.rows[0].consumer_price;
      make_cost = priceResult.rows[0].make_cost;
    }
  } catch (error) {
    console.error('Error fetching drink price:', error);
    return [0, -1, 0]; // Return an array indicating failure
  }

  total_price = drink_price + toppingCost;

  const drink_order_query = `INSERT INTO order_drink (menu_drink_id, total_price, size, ice_level, sugar_level) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  let generatedKey = -1;

  try {
    const client = await pool.connect();
    const result = await client.query(drink_order_query, [
      mdID,
      total_price,
      sizeStr,
      ice,
      sugar,
    ]);
    generatedKey = result.rows[0].id;
    client.release();
  } catch (error) {
    console.error('Error inserting order drink:', error);
    return [0, -1, 0]; // Return an array indicating failure
  }

  return [total_price, generatedKey, make_cost];
}

app.post('/create-order-drink', async (req, res) => {
  console.log('Received request body:', req.body); // Add this line for debugging
  const { Total_Price, Size, Menu_Drink_ID, Ice_Level, Sugar_Level } = req.body;
  if (!Total_Price || !Size || !Menu_Drink_ID || !Ice_Level || !Sugar_Level) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  const result = await createOrderDrink(
    parseFloat(Total_Price),
    parseInt(Size, 10),
    parseInt(Menu_Drink_ID, 10),
    parseInt(Ice_Level, 10),
    parseInt(Sugar_Level, 10)
  );

  if (result[1] === -1) {
    res.status(500).json({ error: 'Failed to create order drink' });
  } else {
    res.json({
      Total_Price: result[0],
      generatedKey: result[1],
      make_cost: result[2],
    });
  }
});

//create Tables
async function createTables(): Promise<number> {
  const SQL = `
    CREATE TABLE Ingredient (
      ID SERIAL PRIMARY KEY,
      Ingredient_Name VARCHAR(50),
      Current_Amount DOUBLE PRECISION,
      Ideal_Amount DOUBLE PRECISION,
      Restock_Price DOUBLE PRECISION,
      Consumer_Price DOUBLE PRECISION,
      Amount_Used DOUBLE PRECISION,
      Is_Ingredient BOOLEAN
    );
    
    CREATE TABLE Category (
      ID SERIAL PRIMARY KEY,
      Drink_Category VARCHAR(255) NOT NULL
    );

    CREATE TABLE Menu_Drink (
      ID SERIAL PRIMARY KEY,
      Name VARCHAR(50),
      Normal_Cost DOUBLE PRECISION,
      Large_Cost DOUBLE PRECISION,
      Norm_Consumer_Price DOUBLE PRECISION,
      Lg_Consumer_Price DOUBLE PRECISION
      Category_ID INTEGER,
      CONSTRAINT fk_Category FOREIGN KEY (Category_ID) REFERENCES Category(ID),
      IsOffered BOOLEAN
    );

    CREATE TABLE Menu_Drink_Ingredient (
      Menu_Drink_ID INTEGER,
      Ingredient_ID INTEGER,
      PRIMARY KEY (Menu_Drink_ID, Ingredient_ID),
      CONSTRAINT fk_Menu_Drink FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID),
      CONSTRAINT fk_Ingredient FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID)
    );

    CREATE TABLE Employee (
      ID SERIAL PRIMARY KEY,
      Manager_ID INTEGER,
      Name VARCHAR(50),
      isManager BOOLEAN,
      Username VARCHAR(50),
      Password VARCHAR(200),
      FOREIGN KEY (Manager_ID) REFERENCES Employee(ID)
    );

    CREATE TABLE Order_Drink (
      ID SERIAL PRIMARY KEY,
      Total_Price DOUBLE PRECISION,
      Size INTEGER,
      Menu_Drink_ID INTEGER,
      Ice_Level INTEGER,
      Sugar_Level INTEGER,
      FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID)
    );

    CREATE TABLE Ingredient_Order_Drink (
      Order_Drink_ID INTEGER,
      Ingredient_ID INTEGER,
      Amount INTEGER,
      PRIMARY KEY (Order_Drink_ID, Ingredient_ID),
      FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID),
      FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID)
    );

    CREATE TABLE Orders (
      ID SERIAL PRIMARY KEY,
      Server_ID INTEGER,
      Name VARCHAR(50),
      Cost DOUBLE PRECISION,
      Price DOUBLE PRECISION,
      Profit DOUBLE PRECISION,
      Tip DOUBLE PRECISION,
      Takeout BOOLEAN,
      Date DATE NOT NULL DEFAULT CURRENT_DATE,
      Time TIME,
      FOREIGN KEY (Server_ID) REFERENCES Employee(ID)
    );

    CREATE TABLE Order_Order_Drink (
      Order_ID INTEGER,
      Order_Drink_ID INTEGER,
      PRIMARY KEY (Order_ID, Order_Drink_ID),
      FOREIGN KEY (Order_ID) REFERENCES Orders(ID),
      FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID)
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(SQL);
    client.release();
    return 1; // Return 1 to indicate success, you can change this based on your needs.
  } catch (error) {
    console.error('Error creating tables:', error);
    return 0; // Return 0 to indicate failure, you can change this based on your needs.
  }
}
app.get('/createTables', async (req, res) => {
  try {
    const result = await createTables();
    if (result === 1) {
      res.json({ message: 'Tables created successfully' });
    } else {
      res.status(500).json({ error: 'Failed to create tables' });
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//create order drink
app.post('/create-order-drink', async (req, res) => {
  console.log('Received request body:', req.body); // Add this line for debugging
  const { Total_Price, Size, Menu_Drink_ID, Ice_Level, Sugar_Level } = req.body;
  if (Total_Price === undefined || Size === undefined || Menu_Drink_ID === undefined || Ice_Level === undefined || Sugar_Level === undefined) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  const result = await createOrderDrink(
    parseFloat(Total_Price),
    parseInt(Size, 10),
    parseInt(Menu_Drink_ID, 10),
    parseInt(Ice_Level, 10),
    parseInt(Sugar_Level, 10)
  );

  if (result[1] === -1) {
    res.status(500).json({ error: 'Failed to create order drink' });
  } else {
    res.json({
      Total_Price: result[0],
      generatedKey: result[1],
      make_cost: result[2],
    });
  }
});


app.post('/create-ingredient', async (req, res) => {
  const { name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed, isIngredient } = req.body;

  if (
    !name ||
    currentAmount === undefined ||
    idealAmount === undefined ||
    restockPrice === undefined ||
    consumerPrice === undefined ||
    amountUsed === undefined ||
    isIngredient === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const SQL = `
      INSERT INTO ingredient (Ingredient_Name, Current_Amount, Ideal_Amount, Restock_Price, Consumer_Price, Amount_Used, Is_Ingredient)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ID`;

    const client = await pool.connect();
    const result = await client.query(SQL, [name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed, isIngredient]);
    client.release();

    if (result.rows.length > 0) {
      res.json({ ingredientId: result.rows[0].id });
    } else {
      res.status(500).json({ error: 'Error creating ingredient' });
    }
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});
//Create order
app.post('/create-order', async (req, res) => {
  const {
    serverID,
    total_cost,
    price,
    profit,
    tipped,
    takeout,
    date,
    time,
    name,
  } = req.body;

  if (
    serverID === undefined ||
    isNaN(total_cost) ||
    isNaN(price) ||
    isNaN(profit) ||
    isNaN(tipped) ||
    typeof takeout !== 'boolean' ||
    !date ||
    !time ||
    !name
  ) {
    res.status(400).json({ error: 'Invalid parameters in the request body' });
    return;
  }

  try {
    const client = await pool.connect();

    const insertOrderSQL = `
      INSERT INTO Orders (Server_ID, Name, Cost, Price, Profit, Tip, Takeout, Date, Time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    const values = [
      serverID,
      name,
      total_cost,
      price,
      profit,
      tipped,
      takeout,
      date,
      time,
    ];

    await client.query(insertOrderSQL, values);
    client.release();

    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
});

//create Ingredient Order drink
async function createIngredientOrderDrinks(
  toppingPKs: number[],
  toppingAmounts: number[],
  orderDrinkPK: number
): Promise<void> {
  const oID = orderDrinkPK.toString();

  for (let i = 0; i < toppingAmounts.length; i++) {
    const currentPK = toppingPKs[i].toString();
    const currentAmount = toppingAmounts[i].toString();
    const SQL = `INSERT INTO ingredient_order_drink (order_drink_id, ingredient_id, amount) VALUES ($1, $2, $3)`;
    
    try {
      const client = await pool.connect();
      await client.query(SQL, [oID, currentPK, currentAmount]);
      client.release();
    } catch (error) {
      console.error('Error inserting ingredient order drink:', error);
      // Handle the error as needed (e.g., logging or throwing an exception).
    }
  }
}

app.post('/create-ingredient-order-drink', async (req, res) => {
  const { toppingPKs, toppingAmounts, orderDrinkPK } = req.body;

  if (!toppingPKs || !toppingAmounts || !orderDrinkPK) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    await createIngredientOrderDrinks(toppingPKs, toppingAmounts, orderDrinkPK);
    res.json({ message: 'Ingredient order drinks created successfully' });
  } catch (error) {
    console.error('Error creating ingredient order drinks:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//managerViewIngredient
//http://localhost:5000/manager-view-ingredient?ingredientId=1
app.get('/manager-view-ingredient/:ingredientID', async (req, res) => {
  const ingredientId = parseInt(req.params.ingredientID);

  if (isNaN(ingredientId)) {
    res.status(400).json({ error: 'Invalid ingredientId' });
    return;
  }

  try {
    const id = ingredientId.toString();
    const SQL = `SELECT * FROM ingredient WHERE id = $1`;
    const client = await pool.connect();
    const result = await client.query(SQL, [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    const ingredient = result.rows[0];
    const ingredientName = ingredient.ingredient_name;
    const amountUsed = ingredient.amount_used;
    const ingredientAmount = ingredient.current_amount;
    const ingredientIdeal = ingredient.ideal_amount;

    res.json({
      ingredientName,
      currentAmount: ingredientAmount,
      idealAmount: ingredientIdeal,
      amountUsed,
    });
  } catch (error) {
    console.error('Error fetching ingredient data:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//update Ingredients
app.post('/manager-update-ingredient', async (req, res) => {
  const { ingredientID, updateAmount } = req.body;

  if (ingredientID === undefined || updateAmount === undefined) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const id = ingredientID.toString();
    const update = updateAmount.toString();

    const selectSQL = `SELECT current_amount FROM ingredient WHERE id = $1`;
    const updateSQL = `UPDATE ingredient SET current_amount = $1 WHERE id = $2`;

    const client = await pool.connect();
    const selectResult = await client.query(selectSQL, [id]);

    let newAmount = 0;

    for (const row of selectResult.rows) {
      const current = row.current_amount;
      newAmount = current + parseInt(update);
    }

    await client.query(updateSQL, [newAmount, id]);
    client.release();

    res.json({ message: 'Ingredient updated successfully' });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//change drink price
app.post('/change-price', async (req, res) => {
  const { drink_id, size, price } = req.body;

  if (drink_id === undefined || size === undefined || price === undefined) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const id = drink_id.toString();
    const newPrice = price.toString();
    let SQL = '';

    if (size === 0) {
      SQL = `UPDATE menu_drink SET norm_consumer_price = $1 WHERE id = $2`;
    } else if (size === 1) {
      SQL = `UPDATE menu_drink SET lg_consumer_price = $1 WHERE id = $2`;
    } else {
      res.status(400).json({ error: 'Invalid size parameter' });
      return;
    }

    const client = await pool.connect();
    await client.query(SQL, [newPrice, id]);
    client.release();

    res.json({ message: 'Price changed successfully' });
  } catch (error) {
    console.error('Error changing price:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});
//Get drink
//http://localhost:5000/get-drink?drinkId=1
app.get('/get-drink/:drinkID', async (req, res) => {
  const drinkId = parseInt(req.params.drinkID);

  if (isNaN(drinkId)) {
    res.status(400).json({ error: 'Invalid drinkId' });
    return;
  }

  try {
    const id = drinkId.toString();
    const SQL = `SELECT Name, norm_consumer_price, lg_consumer_price FROM Menu_Drink WHERE ID = $1`;
    const client = await pool.connect();
    const result = await client.query(SQL, [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Drink not found' });
      return;
    }

    const drinkInfo = result.rows[0];
    const drinkName = drinkInfo.name;
    const normalPrice = drinkInfo.norm_consumer_price;
    const largePrice = drinkInfo.lg_consumer_price;

    res.json({
      drinkName,
      normalPrice,
      largePrice,
    });
  } catch (error) {
    console.error('Error fetching drink data:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});
//get popular drink
//http://localhost:5000/get-popular-drink?startDate=2023-01-01&endDate=2023-12-31
app.get('/get-popular-drink', async (req, res) => {
  try {
    const SQL = `
      SELECT md.Name AS drink_name, COUNT(ood.Order_ID) AS order_count
      FROM Orders o
      JOIN Order_Order_Drink ood ON o.ID = ood.Order_ID
      JOIN Menu_Drink md ON ood.Order_Drink_ID = md.ID
      GROUP BY md.name
      ORDER BY order_count DESC
      LIMIT 1
    `;

    const client = await pool.connect();
    const result = await client.query(SQL);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No popular drinks found' });
      return;
    }

    const popularDrink = result.rows[0];
    const drinkName = popularDrink.drink_name;
    const orderCount = popularDrink.order_count;

    res.json({
      drinkName,
      orderCount,
    });
  } catch (error) {
    console.error('Error fetching popular drink data:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//getAllDrinkNames, array of arrays, first array is primary key, second array is drink name
app.get('/get-all-drink-names', async (req, res) => {
  try {
    const SQL = 'SELECT Name, id FROM Menu_Drink';
    const client = await pool.connect();
    const result = await client.query(SQL);
    client.release();

    const drinkNames: string[] = [];
    const drinkIDs: string[] = [];

    for (const row of result.rows) {
      const drinkName: string = row.name;
      const drinkID: string = row.id;
      drinkNames.push(drinkName);
      drinkIDs.push(drinkID);
    }

    const resultArray: string[][] = [drinkIDs, drinkNames];

    res.json(resultArray);
  } catch (error) {
    console.error('Error fetching drink names:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//getEmployeeUsernamesandPasswords
app.get('/get-employee-usernames-and-passwords', async (req, res) => {
  try {
    const result: string[][] = [[], []];
    const SQL = 'SELECT Username, Password FROM Employee';
    const client = await pool.connect();
    const queryResult = await client.query(SQL);
    client.release();

    queryResult.rows.forEach((row: any) => {
      result[0].push(row.username);
      result[1].push(row.password);
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching employee usernames and passwords:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/confirm-username-password-match/:username/:password', async (req, res) => {
  const username : string = req.params.username;
  const password : string = req.params.password;
  try {
    var result = false
    const SQL = 'SELECT Username, Password FROM Employee';
    const client = await pool.connect();
    const queryResult = await client.query(SQL);
    client.release();

    queryResult.rows.forEach((row: any) => {
      if (row.username == username && row.password == password) {
        result = true;
      }
    });
    res.json(result);

  } catch (error) {
    console.error('Error fetching employee usernames and passwords:', error);
    res.status(500).json({ error: (error as Error).message });
  }

});

//getIngredientNameAndPrice
app.get('/get-ingredient-name-and-price', async (req, res) => {
  try {
    const SQL = `SELECT Ingredient_Name, Consumer_Price FROM Ingredient`;
    console.log('SQL query:', SQL); // Add this line for debugging

    const client = await pool.connect();
    const result = await client.query(SQL);
    client.release();

    // Extract data from the result
    const ingredientData = result.rows.map((row) => [row.ingredient_name, row.consumer_price]);

    res.json({ ingredientData });
  } catch (error) {
    console.error('Error fetching ingredient data:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


//restock ingredients
app.post('/restock-ingredients', async (req, res) => {
  try {
    const querySQL = `
      SELECT * 
      FROM ingredient 
      WHERE current_amount < (ideal_amount * 0.4);
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    if (rows.length > 0) {
      const result: string[] = [];

      result.push("| Name of Ingredient                        | Current Amount  | Ideal Amount       |");

      for (const row of rows) {
        const name: string = row.ingredient_name;
        const currentAmount: number = row.current_amount;
        const idealAmount: number = row.ideal_amount;

        result.push(`| ${name.padEnd(40)} | ${currentAmount.toString().padEnd(15)} | ${idealAmount.toString().padEnd(20)} |`);
      }

      res.status(200).json({ message: 'Ingredients restocked successfully', result });
    } else {
      res.status(404).json({ error: 'No ingredients require restocking' });
    }
  } catch (error) {
    console.error('Error restocking ingredients:', error);
    res.status(500).json({ error: 'An error occurred while restocking ingredients' });
  }
});

//get ideal ingredient amount
app.get('/get-ideal-ingredient-amount/:ingredientId', async (req, res) => {
  const ingredientId = parseInt(req.params.ingredientId);

  if (isNaN(ingredientId)) {
    res.status(400).json({ error: 'Invalid ingredient ID' });
    return;
  }

  try {
    const querySQL = `
      SELECT Ideal_Amount
      FROM ingredient
      WHERE ID = $1
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL, [ingredientId]);
    client.release();

    if (rows.length > 0) {
      const idealAmount: number = rows[0].ideal_amount;
      res.status(200).json({ idealAmount });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  } catch (error) {
    console.error('Error getting ideal ingredient amount:', error);
    res.status(500).json({ error: 'An error occurred while fetching ideal ingredient amount' });
  }
});
//get ideal amounts for all ingredients
//http://localhost:5000/get-ideal-ingredients-amount?tuple=1,2,3
app.get('/get-ideal-ingredients-amount', async (req, res) => {
  const tuple = req.query.tuple as string;

  if (!tuple) {
    res.status(400).json({ error: 'Missing or invalid "tuple" query parameter' });
    return;
  }

  try {
    const querySQL = `
      SELECT Ideal_Amount, ingredient_name
      FROM ingredient
      WHERE ID IN (${tuple})
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    const idealAmounts: { idealAmount: number; ingredientName: string }[] = rows.map((row: any) => ({
      idealAmount: row.ideal_amount,
      ingredientName: row.ingredient_name,
    }));

    res.status(200).json(idealAmounts);
  } catch (error) {
    console.error('Error getting ideal ingredients amount:', error);
    res.status(500).json({ error: 'An error occurred while fetching ideal ingredient amounts' });
  }
});

app.get('/report-restock', async (req, res) => {

  pool
  try {
    const querySQL = `
      SELECT ingredient_name, current_amount, ideal_amount
      FROM ingredient
      WHERE current_amount < (ideal_amount * 0.4)
      `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    var returnObject = [];

    for (const row of rows) {
      const name: string = row.ingredient_name;
      const currentAmount: number = row.current_amount;
      const idealAmount: number = row.ideal_amount;

      returnObject.push({ingredient_name: name, current_amount: currentAmount, ideal_amount: idealAmount})
    }

    res.status(200).send(returnObject);
  } catch (error) {
    console.error('Error getting ingredients to restock:', error);
    res.status(500).json({ error: 'Error getting ingredients to restock' });
  }
});


//get ingredient name given primary key
app.get('/get-ingredient-name/:ingredientId', async (req, res) => {
  const ingredientId = parseInt(req.params.ingredientId);

  if (isNaN(ingredientId)) {
    res.status(400).json({ error: 'Invalid ingredient ID' });
    return;
  }

  try {
    const querySQL = `
      SELECT Ingredient_Name
      FROM ingredient
      WHERE ID = $1
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL, [ingredientId]);
    client.release();

    if (rows.length > 0) {
      const ingredientName: string = rows[0].ingredient_name;
      res.status(200).json({ ingredientName });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  } catch (error) {
    console.error('Error getting ingredient name:', error);
    res.status(500).json({ error: 'An error occurred while fetching ingredient name' });
  }
});

//getMenuDrinks for Order Drinks
app.get('/get-menu-drinks-for-order-drinks/:idTuple', async (req, res) => {
  const idTuple = req.params.idTuple as string;

  if (!idTuple) {
    res.status(400).json({ error: 'Missing or invalid "idTuple" query parameter' });
    return;
  }

  try {
    const querySQL = `
      SELECT Menu_Drink_ID
      FROM Order_Drink
      WHERE ID IN (${idTuple})
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    const drinks: number[] = rows.map((row: any) => row.menu_drink_id);

    res.status(200).json(drinks);
  } catch (error) {
    console.error('Error getting menu drinks for order drinks:', error);
    res.status(500).json({ error: 'An error occurred while fetching menu drinks for order drinks' });
  }
});

//get number of menu drinks
app.get('/menu-drink-amount', async (req, res) => {
  try {
    const querySQL = 'SELECT COUNT(ID) FROM menu_drink';

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    if (rows.length > 0) {
      const amount: number = rows[0].count;
      res.status(200).json({ amount });
    } else {
      res.status(404).json({ error: 'No menu drinks found' });
    }
  } catch (error) {
    console.error('Error getting menu drink amount:', error);
    res.status(500).json({ error: 'An error occurred while fetching menu drink amount' });
  }
});

//get number of ingredients
app.get('/ingredient-amount', async (req, res) => {
  try {
    const querySQL = 'SELECT COUNT(ID) FROM ingredient';

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    if (rows.length > 0) {
      const amount: number = rows[0].count;
      res.status(200).json({ amount });
    } else {
      res.status(404).json({ error: 'No ingredients found' });
    }
  } catch (error) {
    console.error('Error getting ingredient amount:', error);
    res.status(500).json({ error: 'An error occurred while fetching ingredient amount' });
  }
});

//order drink pairs
app.get('/order-drink-pairs/:startDate', async (req, res) => {
  const startDate = req.params.startDate;

  if (!startDate) {
    res.status(400).json({ error: 'Missing or invalid "startDate" query parameter' });
    return;
  }

  try {
    const start: Date = new Date(startDate);
    const query = `
      SELECT O.ID AS OrderID, OD.ID AS OrderDrinkID
      FROM Orders O
      INNER JOIN Order_Order_Drink OOD ON O.ID = OOD.Order_ID
      INNER JOIN Order_Drink OD ON OOD.Order_Drink_ID = OD.ID
      WHERE Date >= $1 AND Date <= current_date`;

    const client = await pool.connect();
    const result = await client.query(query, [start]);
    client.release();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting order drink pairs:', error);
    res.status(500).json({ error: 'An error occurred while fetching order drink pairs' });
  }
});

//getIngredientsForMenuDrinks
//the listening happens here

app.get('/ingredients-for-menu-drinks/:menuDrinkIDs', async (req, res) => {
  const menuDrinkIDs: string = req.params.menuDrinkIDs as string;

  if (!menuDrinkIDs) {
    res.status(400).json({ error: 'Missing or invalid "menuDrinkIDs" query parameter' });
    return;
  }

  // Split the menuDrinkIDs string into an array of integers
  const menuDrinkIDsArray: number[] = menuDrinkIDs.split(',').map((id) => parseInt(id, 10));

  try {
    const ingsForMenuDrinks: Array<number[]> = new Array(menuDrinkIDsArray.length).fill(null).map(() => []);

    const querySQL = `
      SELECT i.ID AS Ingredient_ID, i.Ingredient_Name, mdi.Menu_Drink_ID
      FROM Menu_Drink_Ingredient mdi
      JOIN Ingredient i ON mdi.Ingredient_ID = i.ID
      WHERE mdi.Menu_Drink_ID IN (${menuDrinkIDs})
    `;

    const client = await pool.connect();
    const result = await client.query(querySQL);
    client.release();

    result.rows.forEach((row: any) => {
      const menuDrinkID: number = row.menu_drink_id;
      const ingredientID: number = row.ingredient_id;
      ingsForMenuDrinks[menuDrinkIDsArray.indexOf(menuDrinkID)].push(ingredientID);
    });

    res.status(200).json(ingsForMenuDrinks);
  } catch (error) {
    console.error('Error getting ingredients for menu drinks:', error);
    res.status(500).json({ error: 'An error occurred while fetching ingredients for menu drinks' });
  }
});
//Make new seasonal menu drink
app.post('/new-seasonal-menu-item', async (req, res) => {
  const { name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, ingredientPKs } = req.body;

  if (
    !name ||
    isNaN(normalCost) ||
    isNaN(largeCost) ||
    isNaN(normConsumerPrice) ||
    isNaN(lgConsumerPrice) ||
    !Array.isArray(ingredientPKs) ||
    ingredientPKs.length === 0
  ) {
    res.status(400).json({ error: 'Invalid parameters in the request body' });
    return;
  }

  try {
    const client = await pool.connect();
    client.query('BEGIN'); // Start a transaction

    // Create the new menu drink with Category_ID set to 8
    const insertMenuDrinkSQL = `
      INSERT INTO Menu_Drink (Name, Normal_Cost, Large_Cost, Norm_Consumer_Price, Lg_Consumer_Price, Category_ID)
      VALUES ($1, $2, $3, $4, $5, 8) -- Set Category_ID to 8
      RETURNING ID`;

    const menuDrinkValues = [name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice];
    const menuDrinkResult = await client.query(insertMenuDrinkSQL, menuDrinkValues);
    const menuDrinkId = menuDrinkResult.rows[0].id;

    // Insert ingredients into the Menu_Drink_Ingredient junction table
    const insertMenuDrinkIngredientSQL = 'INSERT INTO Menu_Drink_Ingredient (Menu_Drink_ID, Ingredient_ID) VALUES ($1, $2)';
    for (const ingredientPK of ingredientPKs) {
      await client.query(insertMenuDrinkIngredientSQL, [menuDrinkId, ingredientPK]);
    }

    client.query('COMMIT'); // Commit the transaction to save changes
    client.release();

    res.status(201).json({ message: 'Seasonal menu item added successfully' });
  } catch (error) {
    console.error('Error adding new seasonal menu item:', error);
    res.status(500).json({ error: 'An error occurred while adding the seasonal menu item' });
  }
});

app.get('/soldTogether/:startDate/:endDate', async (req, res) => {
  try {
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;

      const client = await pool.connect();

      const querySQL = `
          WITH OrdersOnDates AS (
              SELECT
                  o.ID AS OrderID,
                  md.ID AS MenuDrinkID
              FROM Orders o
              JOIN Order_Order_Drink ood ON o.ID = ood.Order_ID
              JOIN Order_Drink od ON ood.Order_Drink_ID = od.ID
              JOIN Menu_Drink md ON od.Menu_Drink_ID = md.ID
              WHERE o.Date BETWEEN $1 AND $2
          )
          SELECT
              md1.Name AS MenuDrink1,
              md2.Name AS MenuDrink2,
              COUNT(*) AS SalesCount
          FROM OrdersOnDates ood1
          JOIN Menu_Drink md1 ON ood1.MenuDrinkID = md1.ID
          JOIN OrdersOnDates ood2 ON ood1.OrderID = ood2.OrderID
          JOIN Menu_Drink md2 ON ood2.MenuDrinkID = md2.ID
          WHERE md1.ID < md2.ID
          GROUP BY md1.Name, md2.Name
          HAVING COUNT(*) > 1
          ORDER BY SalesCount DESC
      `;

      const result = await client.query(querySQL, [startDate, endDate]);
      client.release();

      const salesInfo = result.rows.map((row) => ({
          MenuDrink1: row.menudrink1,
          MenuDrink2: row.menudrink2,
          SalesCount: row.salescount,
      }));

      res.json(salesInfo);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/salesReport/:startDate/:endDate', async (req, res) => {
  try {
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;

      const client = await pool.connect();

      const querySQL = `
          SELECT
              MD.Name AS MenuDrinkName,
              MD.Norm_Consumer_Price AS MenuDrinkPrice,
              COUNT(OD.ID) AS AmountSold
          FROM
              Menu_Drink MD
          LEFT JOIN Order_Drink OD ON MD.ID = OD.Menu_Drink_ID
          LEFT JOIN Order_Order_Drink OOD ON OD.ID = OOD.Order_Drink_ID
          LEFT JOIN Orders O ON OOD.Order_ID = O.ID
          WHERE
              O.Date BETWEEN $1 AND $2
          GROUP BY
              MD.Name, MD.Norm_Consumer_Price
      `;

      const result = await client.query(querySQL, [startDate, endDate]);
      client.release();

      const salesReport = result.rows.map((row) => ({
          MenuDrinkName: row.menudrinkname,
          MenuDrinkPrice: row.menudrinkprice,
          AmountSold: row.amountsold,
      }));

      res.json(salesReport);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/excessReport/:startDate', async (req, res) => {
  try {
    const startDate = req.params.startDate;

    // Use Axios to make GET requests to the other routes
    const [numberOfMenuDrinksResponse, numberOfIngredientsResponse] = await Promise.all([
      axios.get(`${serverUrl}/menu-drink-amount`),
      axios.get(`${serverUrl}/ingredient-amount`),
    ]);

    // Extract data from the responses
    const numberOfMenuDrinks:number = numberOfMenuDrinksResponse.data.amount;
    const numberOfIngredients = numberOfIngredientsResponse.data.amount;

    // Initialize arrays and variables for the report
    var drinks:number[] = new Array();
    for (var i = 0; i < numberOfMenuDrinks; i++) {
      drinks[i] = 0;
    }
    var ingredients:number[] = new Array();
    for (var i = 0; i < numberOfIngredients; i++) {
        ingredients[i] = 0;
    }
    let report = '';

    // Retrieve order pairs for the given start date
    const orderPairsResponse = await axios.get<{orderdrinkid:number}[]>(`${serverUrl}/order-drink-pairs/${startDate}`);
    const idList = orderPairsResponse.data.map((item) => item.orderdrinkid);

    // Create a list of menu IDs for the order drinks
    const menuIdsResponse = await axios.get(`${serverUrl}/get-menu-drinks-for-order-drinks/${idList.join(',')}`);
    const menuIds = menuIdsResponse.data;

    // Count the number of each menu drink
    menuIds.forEach((menuId:number) => {
      drinks[menuId] += 1;
    });

    // Retrieve ingredients for menu drinks
    const ingredientsListResponse = await axios.get(
      `${serverUrl}/ingredients-for-menu-drinks/${menuIds.join()}`
    );
    const ingredientsList = ingredientsListResponse.data;
    console.log(ingredientsList);

    for (let i = 0; i < ingredientsList.length; i++) {
      for (let j = 0; j < ingredientsList[i].length; j++) {
        const ingredientID = ingredientsList[i][j];
        const drinkID = menuIds[i];

        // Use Axios to get the amount used for the ingredient
        const amountUsedResponse = await axios.get(`${serverUrl}/manager-view-ingredient/${ingredientID}`);
        const amountUsed = amountUsedResponse.data.amountUsed;

        ingredients[ingredientID] += drinks[drinkID] * amountUsed;
      }
    }
    console.log(ingredients);

    // Generate the report
    for (let i = 1; i <= ingredients.length; i++) {
      // Use Axios to get the ideal amount for the ingredient
      const idealAmountResponse = await axios.get(`${serverUrl}/get-ideal-ingredient-amount/${i}`);
      const idealAmount = idealAmountResponse.data.idealAmount;

      if (ingredients[i] / idealAmount < 0.1) {
        // Use Axios to get the ingredient name
        const ingredientNameResponse = await axios.get(`${serverUrl}/get-ingredient-name/${i}`);
        const ingredientName = ingredientNameResponse.data.ingredientName;

        report += `${ingredientName}\n`;
      }
    }

    res.send(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Ingredient
app.put('/update-ingredient/:id', async (req, res) => {
  const ingredientId = req.params.id;
  const { name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed, isIngredient } = req.body;

  if (
    !name ||
    currentAmount === undefined ||
    idealAmount === undefined ||
    restockPrice === undefined ||
    consumerPrice === undefined ||
    amountUsed === undefined ||
    isIngredient === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `
      UPDATE ingredient
      SET Ingredient_Name = $1, Current_Amount = $2, Ideal_Amount = $3,
      Restock_Price = $4, Consumer_Price = $5, Amount_Used = $6, Is_Ingredient = $7
      WHERE ID = $8`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed, isIngredient, ingredientId]);
    client.release();

    if (result.rowCount > 0) {
      res.json({ message: 'Ingredient updated successfully' });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update Menu Drink
app.put('/update-menu-drink/:id', async (req, res) => {
  const menuDrinkId = req.params.id;
  const { name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, category } = req.body;

  if (
    !name ||
    normalCost === undefined ||
    largeCost === undefined ||
    normConsumerPrice === undefined ||
    lgConsumerPrice === undefined ||
    category === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `UPDATE menu_drink
      SET Name = $1, Normal_Cost = $2, Large_Cost = $3,
      Norm_Consumer_Price = $4, Lg_Consumer_Price = $5, Category_ID = $6
      WHERE ID = $7`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, category, menuDrinkId]);
    client.release();

    if (result.rowCount > 0) {
      res.json({ message: 'Menu Drink updated successfully' });
    } else {
      res.status(404).json({ error: 'Menu Drink not found' });
    }
  } catch (error) {
    console.error('Error updating menu drink:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


//Get all drink categories 
app.get('/categories', async (req, res) => {
  try {
    const SQL = `SELECT Drink_Category FROM Category`;
    console.log('SQL query:', SQL);

    const client = await pool.connect();
    const result = await client.query(SQL);
    client.release();

    // Extract data from the result
    const categoryNames = result.rows.map((row) => row.drink_category);

    res.json({ categoryNames });
  } catch (error) {
    console.error('Error fetching category names:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//Get all drinks from a category given the category primary key
app.get('/drinks-from-category/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10); // Convert the string to a number

    // Check if the provided categoryId is a valid number
    if (isNaN(categoryId)) {
      res.status(400).json({ error: 'Invalid category ID' });
      return;
    }

    const SQL = `
      SELECT ID, Name, Normal_Cost, Large_Cost, Norm_Consumer_Price, Lg_Consumer_Price
      FROM Menu_Drink
      WHERE Category_ID = $1`;

    const client = await pool.connect();
    const result = await client.query(SQL, [categoryId]);
    client.release();

    // Check if any drinks were found
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No drinks found in the specified category' });
    } else {
      const drinks = result.rows;
      res.json({ drinks });
    }
  } catch (error) {
    console.error('Error fetching drinks from category:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//create menu drink
app.post('/create-menu-drink', async (req, res) => {
  const {
    name,
    normalCost,
    largeCost,
    normConsumerPrice,
    lgConsumerPrice,
    categoryID,
  } = req.body;

  if (
    !name ||
    isNaN(normalCost) ||
    isNaN(largeCost) ||
    isNaN(normConsumerPrice) ||
    isNaN(lgConsumerPrice) ||
    isNaN(categoryID)
  ) {
    res.status(400).json({ error: 'Invalid parameters in the request body' });
    return;
  }

  try {
    const client = await pool.connect();

    const insertMenuDrinkSQL = `
      INSERT INTO Menu_Drink (Name, Normal_Cost, Large_Cost, Norm_Consumer_Price, Lg_Consumer_Price, Category_ID)
      VALUES ($1, $2, $3, $4, $5, $6)`;

    const values = [name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, categoryID];

    await client.query(insertMenuDrinkSQL, values);
    client.release();

    res.status(201).json({ message: 'Menu Drink created successfully' });
  } catch (error) {
    console.error('Error creating menu drink:', error);
    res.status(500).json({ error: 'An error occurred while creating the menu drink' });
  }
});

//gets all ingredients that are actually ingredients 
app.get('/is-ingredient', async (req, res) => {
  try {
    const SQL = 'SELECT * FROM ingredient WHERE Is_Ingredient = true';

    const client = await pool.connect();
    const result = await client.query(SQL);
    client.release();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching ingredients with Is_Ingredient:', error);
    res.status(500).json({ error: 'An error occurred while fetching ingredients' });
  }
});

app.listen(port, () => {
console.log(`Example listening at  http://localhost:${port}`);
});