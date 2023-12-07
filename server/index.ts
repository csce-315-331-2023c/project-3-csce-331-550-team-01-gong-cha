import express from 'express';
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import { Queue } from 'queue-typescript';
//const { Queue } = require('queue-typescript')

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



/*
* gets all the employees
* @ returns A status and a JSON body containing the result. On success the body contains all employee names, on failure output contains the error code
*/
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

/*
* gets all menu drinks
* @returns A status and a JSON body containing the result. On success the body contains a dictionary containing menu drink primary keys and the corresponding names, on failure it contains the error message
*/
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

/*
* gets all the ingredients
* @returns A status and a JSON body containing the result. On success the body contains a dictionary with the ingredient primary keys and corresponding names, on failure it contains the error code.
*/
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

/*
* function that drops the tables from the database
*/
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

/*
* Drops all tables from the database
*/
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

/*
* Asynchronous function to create an order drink
* @params ToppingCost The cost of the toppings used on the order drink
* @params size The size of the drink. Valid inputs include 0 for regular and 1 for large
* @params mdID The primary key of the menu drink used as the base for the order drink
* @params iceLevel The level of ice to put in the drink. Valid inputs include 1, 2, or 3 for different levels of ice
* @params sugarLevel The level of sugar in the drink. Valid inputs include 0-4, inclusive
* @params total_price_override The final price of the order drink
* @returns An array containing the total_price, the primary key of the new drink, and the cost it takes the store to make the drink. on failure, array contains [0, -1, 0]
*/
async function createOrderDrink(
  toppingCost: number,
  size: number,
  mdID: number,
  iceLevel: number,
  sugarLevel: number,
  total_price_override: number // New parameter to directly pass the total price
): Promise<number[]> {
  let total_price = total_price_override; // Use the passed total price directly
  let drink_price = 0;
  let make_cost = 0;

  const sizeStr = size.toString();
  const drinkID = mdID.toString();
  const ice = iceLevel.toString();
  const sugar = sugarLevel.toString();

  try {
    const client = await pool.connect();
    const priceQuery = size === 0
      ? `SELECT Normal_Cost AS make_cost FROM menu_drink WHERE ID = $1`
      : `SELECT Large_Cost AS make_cost FROM menu_drink WHERE ID = $1`;

    const priceResult = await client.query(priceQuery, [mdID]);
    client.release();

    if (priceResult.rows.length > 0) {
      drink_price = total_price_override;
      make_cost = priceResult.rows[0].make_cost;
    }
  } catch (error) {
    console.error('Error fetching drink price:', error);
    return [0, -1, 0]; // Return an array indicating failure
  }

  total_price = drink_price;

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

/*
* @params body A JSON body containing the total price, size, menu drink id, ice level, and sugar level of the new order drink
* @returns A status and a JSON body. On success the body contains the total price, newly generated key, and make cost of the drink, on failure it contains the error code.
*/
app.post('/create-order-drink', async (req, res) => {
  console.log('Received request body:', req.body);

  const { Total_Price, Size, Menu_Drink_ID, Ice_Level, Sugar_Level } = req.body;

  if (
    Total_Price == undefined ||
    (Size < 0 || Size > 1 || Size == undefined) ||
    Menu_Drink_ID == undefined ||
    Ice_Level == undefined ||
    (Sugar_Level < 0 || Sugar_Level > 4 || Sugar_Level == undefined)
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  // Pass Total_Price directly to the function
  const result = await createOrderDrink(
    parseFloat(Total_Price),
    parseInt(Size, 10),
    parseInt(Menu_Drink_ID, 10),
    parseInt(Ice_Level, 10),
    parseInt(Sugar_Level, 10),
    parseFloat(Total_Price) // Pass Total_Price directly
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

/*
* Creates empty tables after a database reset
*/
async function createTables(): Promise<number> {
  const SQL = `
    CREATE TABLE Ingredient (
      ID SERIAL PRIMARY KEY,
      Ingredient_Name VARCHAR(50),
      Current_Amount DOUBLE PRECISION,
      Ideal_Amount DOUBLE PRECISION,
      Consumer_Price DOUBLE PRECISION,
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
      Email VARCHAR(50),
      IsAdmin BOOLEAN DEFAULT FALSE,
      IsEmployed BOOLEAN DEFAULT FALSE,
      IsManager BOOLEAN DEFAULT FALSE,
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
      Name VARCHAR(50),
      Cost DOUBLE PRECISION,
      Status INTEGER DEFAULT 0,
      Price DOUBLE PRECISION,
      Profit DOUBLE PRECISION,
      Tip DOUBLE PRECISION,
      Takeout BOOLEAN,
      Date DATE NOT NULL DEFAULT CURRENT_DATE,
      Time TIME,
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

/*
* Calls the createTables async function from the URL
*/
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

/*
* create ingredient
* @params body A JSON body containing the name of the ingredient, the current amount in the store, the ideal amount for the store to have, the price to add to the drink, and whether it is a topping or an ingredient
* @returns A status and a JSON body. On success the body contains the primary key of the new ingredient, on failure it contains the error code
*/
app.post('/create-ingredient', async (req, res) => {
  const { name, currentAmount, idealAmount, consumerPrice, isIngredient } = req.body;

  if (
    !name ||
    currentAmount === undefined ||
    idealAmount === undefined ||
    consumerPrice === undefined ||
    isIngredient === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const SQL = `
      INSERT INTO ingredient (Ingredient_Name, Current_Amount, Ideal_Amount, Consumer_Price, Is_Ingredient)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ID`;

    const client = await pool.connect();
    const result = await client.query(SQL, [name, currentAmount, idealAmount, consumerPrice, isIngredient]);
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

/*
* Create order
* @params body A JSON body that contains cost, price, profit, tipped, takout, date, time, status, and name
* @returns A JSON containing the primary key of the new order
*/
app.post('/create-order', async (req, res) => {
  console.log('Received request body:', req.body);

  const {
    name,
    cost,
    status,
    price,
    profit,
    tip,
    takeout,
    date,
    time,
  } = req.body;

  if (
    isNaN(cost) ||
    isNaN(price) ||
    isNaN(profit) ||
    isNaN(tip) ||
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
      INSERT INTO Orders (Name, Cost, Status, Price, Profit, Tip, Takeout, Date, Time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING ID`; // Add RETURNING ID to get the primary key

    const values = [
      name,
      cost,
      status || 0, // Default to 0 if status is not provided
      price,
      profit,
      tip,
      takeout,
      date,
      time,
    ];

    const result = await client.query(insertOrderSQL, values);

    const orderID = result.rows[0].id; // Extract the ID from the result

    client.release();

    // Log the result to the terminal
    console.log('Order created successfully. Order ID:', orderID);

    // Send the result in the response
    res.status(201).json({ message: 'Order created successfully', orderID });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
});

/*
* create Ingredient Order drink
* @params toppingPKs An array of the primary keys of any toppings put on the order drink
* @params toppingAmounts An array of the amounts of each topping
* @params orderDrinkPK The primary key of the order drink
*/
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

/*
* @params body A JSON body containing toppingPKs, toppingAmounts, and orderDrinkPK
*/
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

/*
* managerViewIngredient
* @params ingredientID The primary key of the ingredient to be viewed
* @returns A JSON body containing the ingredientname, current amount, and ideal amount
*/
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
    const ingredientAmount = ingredient.current_amount;
    const ingredientIdeal = ingredient.ideal_amount;

    res.json({
      ingredientName,
      currentAmount: ingredientAmount,
      idealAmount: ingredientIdeal,
    });
  } catch (error) {
    console.error('Error fetching ingredient data:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

/*
* update Ingredients
* @params body A JSON body containing the ingredient id to be updated and the updated inventory amount
*/
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

/*
* change drink price
* @params body A JSON containing the primary key of the drink to be changed, the size to be changed, and the new price of that sized drink
*/
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


/*
* Get drink
* @params drinkID The drink to be retrieved
* @returns A JSON body containing the drink name, the price for a small, and the price for a large
*/
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

/*
* get popular drink
* @returns A JSON body containing the name of the most popular drink and the number of times it has been ordered
*/
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

/*
* getAllDrinkNames
* @returns A 2d array containing all drink names and corresponding primary keys
*/
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

/*
* getIngredientNameAndPrice
* @returns A JSON body that contiains all ingredient names and corresponding prices
*/
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

/*
* restock ingredients
* @returns A String containing all ingredients that need to be restocked, their current amount, and the ideal amount
*/
app.post('/restock-ingredients', async (req, res) => {
  try {
    const fetchIngredientsSQL = `
      SELECT * 
      FROM ingredient 
      WHERE current_amount < (ideal_amount * 0.4);
    `;

    const client = await pool.connect();
    const { rows } = await client.query(fetchIngredientsSQL);

    if (rows.length > 0) {
      const updateIngredientsSQL = `
        UPDATE ingredient
        SET current_amount = ideal_amount
        WHERE current_amount < (ideal_amount * 0.4);
      `;

      await client.query(updateIngredientsSQL);

      const result: string[] = [];
      result.push("| Name of Ingredient                        | Current Amount  | Ideal Amount       |");

      for (const row of rows) {
        const name: string = row.ingredient_name;
        const idealAmount: number = row.ideal_amount;

        result.push(`| ${name.padEnd(40)} | ${idealAmount.toString().padEnd(15)} | ${idealAmount.toString().padEnd(20)} |`);
      }

      res.status(200).json({ message: 'Ingredients restocked successfully', result });
    } else {
      res.status(404).json({ error: 'No ingredients require restocking' });
    }

    client.release();
  } catch (error) {
    console.error('Error restocking ingredients:', error);
    res.status(500).json({ error: 'An error occurred while restocking ingredients' });
  }
});

/*
* get ideal ingredient amount
* @params ingredientID The id of the ingredient needed
* @returns A JSON body containing the ideal amount for the requested ingredient
*/
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

/*
* get ideal amounts for all ingredients
* @params tuple A tuple that contains multiple ingredients to query
* @returns A JSON body containing the ideal amount and ingredient name for each ingredient in tuple
*/
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

/*
* View what ingredients need to be restocked
* @returns A 2D array, the outer array contains arrays containing the name, current amount, and ideal amount for each ingredient
*/
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


/*
* get ingredient name given primary key
* @params ingredientID
* @returns A JSON body containing the name of the target ingredient
*/
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

/*
* getMenuDrinks for Order Drinks
* @params idTuple A tuple containing the primary keys of the target order drinks
* @returns A JSON body containing the corresponding menu drink used as a base for each order drink
*/
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

/*
* get number of menu drinks
* @returns A JSON body containing the total number of menu drinks in the system
*/
app.get('/menu-drink-amount', async (req, res) => {
  try {
    const querySQL = 'SELECT COUNT(ID) FROM menu_drink';
    const testSQL = 'SELECT COUNT(*) FROM menu_drink';

    const client = await pool.connect();
    const { rows } = await client.query(testSQL);
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

/* 
* get number of ingredients
* @returns A JSON body containing the total number of ingredients in the system
*/
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

/*
* order drink pairs
* @params startDate The start date, in yyyy-mm-dd format, for the report
* @returns A JSON body containing every order drink since the start date until the current date, and its corresponding order number
*/
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

/*
* @params menuDrinkIDs A tuple of menu drink primary keys for which to return the ingredients for
* @returns A JSON body containing arrays of ingredients corresponding to each menu drink in the input
*/
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

/*
* reports on what drinks were sold together in a certain date range
* @params startDate The start date of the report, in yyyy-mm-dd format
* @params endDate The end date of the report, in yyyy-mm-dd format
* @returns A JSON body that contains each pair of drinks sold together in the date range, as well as the numebr of times they were sold together
*/
app.get('/sold-together/:startDate/:endDate', async (req, res) => {
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

/*
* reports on what drinks were sold together in a certain date range
* @params startDate The start date of the report, in yyyy-mm-dd format
* @params endDate The end date of the report, in yyyy-mm-dd format
* @returns A JSON body that contains the name, price, and numeber of each specific drink sold in the given time range
*/
app.get('/sales-report/:startDate/:endDate', async (req, res) => {
  try {
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;

      const client = await pool.connect();

      const querySQL = `
      SELECT
      MD.Name AS MenuDrinkName,
      MD.Norm_Consumer_Price AS MenuDrinkPrice,
      MD.ID AS MenuDrinkID,
      COUNT(OD.ID) AS AmountSold
  FROM
      Menu_Drink MD
  LEFT JOIN Order_Drink OD ON MD.ID = OD.Menu_Drink_ID
  LEFT JOIN Order_Order_Drink OOD ON OD.ID = OOD.Order_Drink_ID
  LEFT JOIN Orders O ON OOD.Order_ID = O.ID
  WHERE
      O.Date BETWEEN '2023-10-01' AND '2023-10-03'
  GROUP BY
      MD.Name, MD.Norm_Consumer_Price, MD.ID;

      `;

      const result = await client.query(querySQL, [startDate, endDate]);
      client.release();

      const salesReport = result.rows.map((row) => ({
          MenuDrinkName: row.menudrinkname,
          MenuDrinkPrice: row.menudrinkprice,
          AmountSold: row.amountsold,
          MenuDrinkPk: row.menudrinkid
      }));

      res.json(salesReport);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
* @params startDate The start date of the report, in yyyy-mm-dd format
* @returns A JSON containing the primary key and name of each ingredient that has not sold more than 10% of its ideal amount since the start date
*/
app.get('/excess-report/:startDate', async (req, res) => {
  try {
    const startDate = req.params.startDate;

    const client = await pool.connect();

    //Get a list of all PK's for menu drinks and ingredients
    const menuDrinkResponse = await axios.get<{id:number}[]>(`${serverUrl}/menu-drink`);
    const drinkIDs =  menuDrinkResponse.data.map((item) => item.id);

    const ingredientsResponse = await axios.get<{id:number}[]>(`${serverUrl}/ingredients`);
    const ingredientIDs =  ingredientsResponse.data.map((item) => item.id);

    // Initialize arrays and variables for the report
    let drinks: { [key: number]: number } = {};
    for (let i = 0; i < drinkIDs.length; i++) {
        drinks[drinkIDs[i]] = 0;
    }
    let ingredients: { [key: number]: number } = {};
    for (let i = 0; i < ingredientIDs.length; i++) {
      ingredients[ingredientIDs[i]] = 0;
    }
    let report : number[] = [];

    // Retrieve order pairs for the given start date
    const orderPairsResponse = await axios.get<{orderdrinkid:number}[]>(`${serverUrl}/order-drink-pairs/${startDate}`);
    let idList = orderPairsResponse.data.map((item) => item.orderdrinkid);
    let menuIds : number[] = [];

    while (idList.length != 0) {
      // Create a list of menu IDs for the order drinks
      const menuIdsResponse = await axios.get(`${serverUrl}/get-menu-drinks-for-order-drinks/${idList.splice(0, Math.min(1800, idList.length)).join()}`);
      menuIds = menuIds.concat(menuIdsResponse.data);
    }

    // Count the number of each menu drink
    menuIds.forEach((menuId:number) => {
      drinks[menuId] += 1;
    });

    // Retrieve ingredients for menu drinks
    const ingredientsListResponse = await axios.get(`${serverUrl}/ingredients-for-menu-drinks/${drinkIDs.join()}`);
    const ingredientsList = ingredientsListResponse.data;

    for (let i = 0; i < ingredientsList.length; i++) {
      for (let j = 0; j < ingredientsList[i].length; j++) {
        const ingredientID = ingredientsList[i][j];
        const drinkID = drinkIDs[i];

        ingredients[ingredientID] += drinks[drinkID];
      }
    }

    // Generate the report
    for (let i = 0; i < ingredientIDs.length; i++) {
      let ing = ingredientIDs[i]
      // Use Axios to get the ideal amount for the ingredient
      const idealAmountResponse = await axios.get(`${serverUrl}/get-ideal-ingredient-amount/${ing}`);
      const idealAmount = idealAmountResponse.data.idealAmount;

      if (ingredients[ing] / idealAmount < 0.1) {
        report.push(ing);
      }
    }
    let querySQL = `SELECT id, ingredient_name FROM ingredient WHERE id IN (${report.join()})`

    const result = await client.query(querySQL);
    client.release();

    const excessReport = result.rows.map((row) => ({
        Ingredient_ID: row.id,
        Ingredient_Name: row.ingredient_name,
    }));

    res.status(200).json(excessReport);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
* Update Ingredient
* @params id A primary key for an ingredient
* @params body A JSON body containing the name, current amount, ideal amount, consumer price, and is ingredient, used to update the given id
*/
app.put('/update-ingredient/:id', async (req, res) => {
  const ingredientId = req.params.id;
  const { name, currentAmount, idealAmount, consumerPrice, isIngredient } = req.body;

  if (
    name === undefined ||
    currentAmount === undefined ||
    idealAmount === undefined ||
    consumerPrice === undefined ||
    isIngredient === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `
      UPDATE ingredient
      SET Ingredient_Name = $1, Current_Amount = $2, Ideal_Amount = $3,
      Consumer_Price = $4, Is_Ingredient = $5
      WHERE ID = $6`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [name, currentAmount, idealAmount, consumerPrice, isIngredient, ingredientId]);
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

/*
* Update Menu Drink
* @params id
* @params body A JSON body containing the name, normal cost, large cost, normal consumer price, large consumer price, category, and is offered, used to update the given id
*/
app.put('/update-menu-drink/:id', async (req, res) => {
  const menuDrinkId = req.params.id;
  const { name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, category, isOffered } = req.body;

  if (
    !name ||
    normalCost === undefined ||
    largeCost === undefined ||
    normConsumerPrice === undefined ||
    lgConsumerPrice === undefined ||
    category === undefined ||
    isOffered === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `UPDATE menu_drink
      SET Name = $1, Normal_Cost = $2, Large_Cost = $3,
      Norm_Consumer_Price = $4, Lg_Consumer_Price = $5, Category_ID = $6, Is_Offered = $7
      WHERE ID = $8`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, category, isOffered, menuDrinkId]);
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

/*
* Update employee
* @params id A primary key for an employee
* @params body A JSON body containing the manager id, name, is manager, email, is admin, and is employed, used to update the given id
*/
app.put('/update-employee/:id', async (req, res) => {
  const employeeId = req.params.id;
  const { manager_id, name, isManager, email, isAdmin, isEmployed } = req.body;

  if (
    name === undefined ||
    manager_id === undefined ||
    isManager === undefined ||
    isEmployed === undefined ||
    isAdmin === undefined ||
    email === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `
      UPDATE employee
      SET manager_id = $1, name = $2, ismanager = $3,
      email = $4, isadmin = $5, isemployed = $6
      WHERE ID = $7`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [manager_id, name, isManager, email, isAdmin, isEmployed, employeeId]);
    client.release();

    if (result.rowCount > 0) {
      res.json({ message: 'Employee updated successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


/* 
* Get all drink categories 
* @returns A JSON body containing the name of all drink categories
*/
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


/*
* Gets all drinks from a category given the category primary key and Is_Offered is true
* @param json containing the primary key of the category you want to get all the drinks from
* @return   json containing all the menu drinks from that are offered
*/
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
      WHERE Category_ID = $1 AND Is_Offered = true`;

    const client = await pool.connect();
    const result = await client.query(SQL, [categoryId]);
    client.release();

    // Check if any drinks were found
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No offered drinks found in the specified category' });
    } else {
      const drinks = result.rows;
      res.json({ drinks });
    }
  } catch (error) {
    console.error('Error fetching offered drinks from category:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//create menu drink
/*
* Creates a menu drink
* @param json containing menu drink attributes (name, costs, consumer prices, category primary key, isOffered)
* @return   json containing primary key of the new menu drink and success status
*/
app.post('/create-menu-drink', async (req, res) => {
  const {
    name,
    normalCost,
    largeCost,
    normConsumerPrice,
    lgConsumerPrice,
    categoryID,
    isOffered,  // Add this line to include Is_Offered in the request body
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
      INSERT INTO Menu_Drink (Name, Normal_Cost, Large_Cost, Norm_Consumer_Price, Lg_Consumer_Price, Category_ID, Is_Offered)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ID`; // Add RETURNING ID to get the generated ID

    const values = [name, normalCost, largeCost, normConsumerPrice, lgConsumerPrice, categoryID, isOffered !== undefined ? isOffered : true];

    const result = await client.query(insertMenuDrinkSQL, values);
    const generatedId = result.rows[0].id; // Get the generated ID from the result
    client.release();

    res.status(201).json({ message: 'Menu Drink created successfully', id: generatedId });
  } catch (error) {
    console.error('Error creating menu drink:', error);
    res.status(500).json({ error: 'An error occurred while creating the menu drink' });
  }
});


/*
* Gets all ingredients that aren't toppings
* @return   json containing all ingredients that aren't toppings
*/
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

/*
* Changes the IsOffered variable for a menu drink
* @param json containing primary key of menu drink that you want to change IsOffered for
* @return   json containing success status
*/
app.put('/change-offered/:id', async (req, res) => {
  const menuDrinkId = req.params.id;

  try {
    const client = await pool.connect();

    // Retrieve the current value of Is_Offered
    const currentOfferedResult = await client.query('SELECT Is_Offered FROM Menu_Drink WHERE ID = $1', [menuDrinkId]);

    if (currentOfferedResult.rows.length === 0) {
      // If the menu drink is not found, return an error
      res.status(404).json({ error: 'Menu Drink not found' });
      return;
    }

    const currentOffered = currentOfferedResult.rows[0].is_offered;

    // Toggle the value of Is_Offered
    const newOffered = !currentOffered;

    // Update the menu drink with the new value of Is_Offered
    const updateOfferedResult = await client.query('UPDATE Menu_Drink SET Is_Offered = $1 WHERE ID = $2', [newOffered, menuDrinkId]);
    client.release();

    if (updateOfferedResult.rowCount > 0) {
      res.json({ message: 'Is_Offered changed successfully' });
    } else {
      res.status(500).json({ error: 'Error changing Is_Offered' });
    }
  } catch (error) {
    console.error('Error changing Is_Offered:', error);
    res.status(500).json({ error: 'An error occurred while changing Is_Offered' });
  }
});

//create menu drink ingredient
/*
* makes menu drink ingredients
* @param json containing menu drink ingredient attributes (menu drink and ingredients primary keys)
* @return   json containing the two primary keys and a success status
*/
app.post('/create-menu-drink-ingredient', async (req, res) => {
  const { menuDrinkId, ingredientIds } = req.body;

  if (!menuDrinkId || !ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
    res.status(400).json({ error: 'Invalid parameters in the request body' });
    return;
  }

  try {
    const client = await pool.connect();

    // Use VALUES construct to insert multiple rows in a single query
    const insertMenuDrinkIngredientsSQL = `
      INSERT INTO Menu_Drink_Ingredient (Menu_Drink_ID, Ingredient_ID)
      VALUES ${ingredientIds.map((_, index) => `($1, $${index + 2})`).join(', ')}
      RETURNING Menu_Drink_ID, Ingredient_ID`;

    const values = [menuDrinkId, ...ingredientIds];

    const result = await client.query(insertMenuDrinkIngredientsSQL, values);
    client.release();

    if (result.rows.length > 0) {
      const menuDrinkIds = result.rows.map(row => row.menu_drink_id);
      const ingredientIds = result.rows.map(row => row.ingredient_id);
      res.status(201).json({ message: 'Menu Drink Ingredients created successfully', menuDrinkIds, ingredientIds });
    } else {
      res.status(500).json({ error: 'Error creating Menu Drink Ingredients' });
    }
  } catch (error) {
    console.error('Error creating Menu Drink Ingredients:', error);
    res.status(500).json({ error: 'An error occurred while creating Menu Drink Ingredients' });
  }
});

/*
* Changes whether ot not an ingredient is considered a topping
* @param primary key for the ingredient you want to change is ingredient for
* @return   json containing success status
*/
app.put('/change-is-ingredient/:id', async (req, res) => {
  const ingredientId = req.params.id;

  try {
    const client = await pool.connect();

    // Retrieve the current value of Is_Ingredient
    const currentIsIngredientResult = await client.query('SELECT Is_Ingredient FROM Ingredient WHERE ID = $1', [ingredientId]);

    if (currentIsIngredientResult.rows.length === 0) {
      // If the ingredient is not found, return an error
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    const currentIsIngredient = currentIsIngredientResult.rows[0].is_ingredient;

    // Toggle the value of Is_Ingredient
    const newIsIngredient = !currentIsIngredient;

    // Update the ingredient with the new value of Is_Ingredient
    const updateIsIngredientResult = await client.query('UPDATE Ingredient SET Is_Ingredient = $1 WHERE ID = $2', [newIsIngredient, ingredientId]);
    client.release();

    if (updateIsIngredientResult.rowCount > 0) {
      res.json({ message: 'Is_Ingredient changed successfully' });
    } else {
      res.status(500).json({ error: 'Error changing Is_Ingredient' });
    }
  } catch (error) {
    console.error('Error changing Is_Ingredient:', error);
    res.status(500).json({ error: 'An error occurred while changing Is_Ingredient' });
  }
});

//create order order drink

/*
* Gets total number of menu drinks offered
* @param json containing order order drink attributes: (order id and array of order drink ids)
* @return   json containing primary key of the order order drink
*/
app.post('/create-order-order-drink', async (req, res) => {
  console.log('Received request body:', req.body);

  const { orderID, orderDrinkIDs } = req.body;

  if (!orderID || !orderDrinkIDs || !Array.isArray(orderDrinkIDs)) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const client = await pool.connect();

    // Iterate through each order drink ID and create an Order_Order_Drink entry
    const orderOrderDrinkIDs: number[] = [];
    for (const orderDrinkID of orderDrinkIDs) {
      const orderOrderDrinkSQL = `
        INSERT INTO order_order_drink (order_id, order_drink_id)
        VALUES ($1, $2)
        RETURNING order_drink_id`;

      const orderOrderDrinkResult = await client.query(orderOrderDrinkSQL, [
        orderID,
        orderDrinkID
      ]);

      orderOrderDrinkIDs.push(orderOrderDrinkResult.rows[0].order_drink_id);
    }

    client.release();

    // Log the result to the terminal
    console.log('Order_Order_Drinks created successfully. Order_Order_Drink IDs:', orderOrderDrinkIDs);

    // Send the result in the response
    res.json({
      message: 'Order_Order_Drinks created successfully',
      order_order_drink_ids: orderOrderDrinkIDs
    });
  } catch (error) {
    console.error('Error creating Order_Order_Drinks:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//get total number of menu drinks offered

/*
* Gets total number of menu drinks offered
* @return   json containing the number of menu drinks offered (int)
*/
app.get('/get-offered-menu-drinks', async (req, res) => {
  try {
    const client = await pool.connect();

    const countMenuDrinksSQL = `
      SELECT COUNT(*) AS offered_menu_drinks_count
      FROM Menu_Drink
      WHERE Is_Offered = true`;

    const result = await client.query(countMenuDrinksSQL);
    const offeredMenuDrinksCount = result.rows[0].offered_menu_drinks_count;

    client.release();

    res.json({ offered_menu_drinks_count: offeredMenuDrinksCount });
  } catch (error) {
    console.error('Error getting offered menu drinks count:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

/*
* Gets a user by email
* @params email The email of a user in the database
* @returns the name of the user with the given email
*/
app.get('/get-email/:email', async (req, res) => {
  console.log('Received request body:', req.body);

  const email = req.params.email;

  try {
    const client = await pool.connect();

    const countMenuDrinksSQL = `SELECT public.getUser(\'${email}\');`;

    const result = await client.query(countMenuDrinksSQL);

    client.release();

    res.json({exist: result.rows[0].getuser});
  } catch (error) {
    console.error('Error getting offered menu drinks count:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//delete menu drink ingredient
/*
* Deletes menu drink ingredient pairs of a menu drink
* @param the menu Drink primary key for the menu drink ingredients you want deleted
* @return   json containing the number of menu drinks offered (int)
*/
app.delete('/delete-menu-drink-ingredients/:menuDrinkID', async (req, res) => {
  const menuDrinkID = req.params.menuDrinkID;
  const ingredientIDs = req.body.ingredientIDs;

  if (!Array.isArray(ingredientIDs)) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const client = await pool.connect();

    // Iterate through each ingredient primary key and delete corresponding entries
    for (const ingredientID of ingredientIDs) {
      const deleteIngredientSQL = `
        DELETE FROM Menu_Drink_Ingredient
        WHERE Menu_Drink_ID = $1 AND Ingredient_ID = $2`;

      await client.query(deleteIngredientSQL, [menuDrinkID, ingredientID]);
    }

    client.release();

    res.json({ message: 'Menu drink ingredients deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu drink ingredients:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//delete ingredient
/*
* Deletes an ingredient
* @param the ingredient primary key you want to delete
* @return   json containing the number of menu drinks offered (int)
*/
app.delete('/delete-ingredient/:ingredientID', async (req, res) => {
  const ingredientID = req.params.ingredientID;

  try {
    const client = await pool.connect();

    const deleteIngredientSQL = `
      DELETE FROM Ingredient
      WHERE ID = $1
      RETURNING ID`;

    const result = await client.query(deleteIngredientSQL, [ingredientID]);
    client.release();

    if (result.rows.length > 0) {
      const deletedIngredientID = result.rows[0].id;
      res.json({ message: 'Ingredient deleted successfully', deletedIngredientID });
    } else {
      res.status(404).json({ error: 'Ingredient not found' });
    }
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


/*
* Deletes a menu drink
* @params menu drink primary key
* @return body A message stating whether or not the deletion was successful
*/

app.delete('/delete-menu-drink/:menuDrinkID', async (req, res) => {
  const menuDrinkID = Number(req.params.menuDrinkID);

  if (!menuDrinkID || isNaN(menuDrinkID)) {
    res.status(400).json({ error: 'Invalid menu drink ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Check if the menu drink exists
    const checkMenuDrinkSQL = 'SELECT * FROM Menu_Drink WHERE ID = $1';
    const checkMenuDrinkResult = await client.query(checkMenuDrinkSQL, [menuDrinkID]);

    if (checkMenuDrinkResult.rows.length === 0) {
      client.release();
      res.status(404).json({ error: 'Menu drink not found' });
      return;
    }

    // Delete the menu drink
    const deleteMenuDrinkSQL = 'DELETE FROM Menu_Drink WHERE ID = $1';
    await client.query(deleteMenuDrinkSQL, [menuDrinkID]);

    client.release();

    res.json({ message: 'Menu drink deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu drink:', error);
    res.status(500).json({ error: 'An error occurred while deleting menu drink' });
  }
});

//get an employees info
/*
* Get employee info
* @params A primary key for an employee
* @return body A JSON body containing the manager id, name, is manager, email, is admin, and is employed, used to update the given id
*/
app.get('/get-employee-info/:employeeID', async (req, res) => {
  const employeeID = Number(req.params.employeeID);

  if (isNaN(employeeID)) {
    res.status(400).json({ error: 'Invalid employee ID' });
    return;
  }

  try {
    const client = await pool.connect();

    const querySQL = `
      SELECT *
      FROM Employee
      WHERE ID = $1;
    `;

    const result = await client.query(querySQL, [employeeID]);
    client.release();

    if (result.rows.length > 0) {
      const employeeInfo = result.rows[0];
      res.status(200).json({ message: 'Employee information retrieved successfully', employeeInfo });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error retrieving employee information:', error);
    res.status(500).json({ error: 'An error occurred while retrieving employee information' });
  }
});

//update employee
/*
* Update employee
* @params id A primary key for an employee
* @params body A JSON body containing the manager id, name, is manager, email, is admin, and is employed, used to update the given id
* @return a success message 
*/
app.put('/update-employee/:id', async (req, res) => {
  const employeeId = req.params.id;
  const { manager_id, name, isManager, email, isAdmin, isEmployed } = req.body;

  if (
    name === undefined ||
    manager_id === undefined ||
    isManager === undefined ||
    isEmployed === undefined ||
    isAdmin === undefined ||
    email === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const updateSQL = `
      UPDATE employee
      SET manager_id = $1, name = $2, ismanager = $3,
      email = $4, isadmin = $5, isemployed = $6
      WHERE ID = $7`;

    const client = await pool.connect();
    const result = await client.query(updateSQL, [manager_id, name, isManager, email, isAdmin, isEmployed, employeeId]);
    client.release();

    if (result.rowCount > 0) {
      res.json({ message: 'Employee updated successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


/*
* Get orders given a day
* @params A date to find the orders on that day
* @return json containing orders for that day
*/
app.get('/get-orders-of-day/:day', async (req, res) => {
  const requestedDate = req.params.day;

  if (!requestedDate) {
    res.status(400).json({ error: 'Missing or invalid "day" parameter' });
    return;
  }

  try {
    const query = `
      SELECT *
      FROM Orders
      WHERE Date = $1`;

    const client = await pool.connect();
    const result = await client.query(query, [requestedDate]);
    client.release();

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting orders for the day:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders for the day' });
  }
});

/*
* Deletes an order
* @params primary key of order you want deleted
* @return body A success message for the deletion
*/
app.delete('/delete-order/:orderID', async (req, res) => {
  const orderID = Number(req.params.orderID);

  if (!orderID || isNaN(orderID)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Begin a transaction to ensure atomicity
    await client.query('BEGIN');

    try {
      // Delete related records in Order_Order_Drink
      const deleteOrderOrderDrinksSQL = 'DELETE FROM Order_Order_Drink WHERE Order_ID = $1';
      await client.query(deleteOrderOrderDrinksSQL, [orderID]);

      // Delete the order
      const deleteOrderSQL = 'DELETE FROM Orders WHERE ID = $1';
      await client.query(deleteOrderSQL, [orderID]);

      // Commit the transaction
      await client.query('COMMIT');

      res.json({ message: 'Order and associated records deleted successfully' });
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client after the transaction is complete
      client.release();
    }
  } catch (error) {
    console.error('Error deleting order and associated records:', error);
    res.status(500).json({ error: 'An error occurred while deleting order and associated records' });
  }
});

/*
* Create employee
* @params json containing employee elements
* @return primary key of new employee
*/
app.post('/create-employee', async (req, res) => {
  console.log('Received request body:', req.body);

  const { Manager_ID, Name, isManager, Email, IsAdmin, IsEmployed } = req.body;

  // Basic validation for required fields
  if (
    Manager_ID === undefined ||
    Name === undefined ||
    isManager === undefined ||
    Email === undefined ||
    IsAdmin === undefined ||
    IsEmployed === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const client = await pool.connect();

    // Insert the new employee into the Employee table
    const insertEmployeeSQL = `
      INSERT INTO Employee (Manager_ID, Name, isManager, Email, IsAdmin, IsEmployed)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ID;
    `;

    const values = [Manager_ID, Name, isManager, Email, IsAdmin, IsEmployed];
    const result = await client.query(insertEmployeeSQL, values);

    client.release();

    res.status(201).json({ message: 'Employee created successfully', employeeID: result.rows[0].id });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'An error occurred while creating the employee' });
  }
});

/*
* Delete employee
* @params primary key of employee to be deleted
* @return primary key of new employee
*/
app.delete('/delete-employee/:employeeID', async (req, res) => {
  const employeeID = Number(req.params.employeeID);

  if (!employeeID || isNaN(employeeID)) {
    res.status(400).json({ error: 'Invalid employee ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Begin a transaction to ensure atomicity
    await client.query('BEGIN');

    try {
      // Delete the employee
      const deleteEmployeeSQL = 'DELETE FROM Employee WHERE ID = $1 RETURNING Manager_ID';
      const result = await client.query(deleteEmployeeSQL, [employeeID]);

      // If the employee had Manager_ID, update other employees referencing the deleted employee as their manager
      const managerID = result.rows[0]?.manager_id;
      if (managerID !== null && managerID !== undefined) {
        const updateManagersSQL = 'UPDATE Employee SET Manager_ID = $1 WHERE Manager_ID = $2';
        await client.query(updateManagersSQL, [null, employeeID]);
      }

      // Commit the transaction
      await client.query('COMMIT');

      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client after the transaction is complete
      client.release();
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'An error occurred while deleting employee' });
  }
});

/*
* Change IsAdmin
* @params primary key of employee to have AdminStatus Changed
* @return success message with admin status
*/
app.put('/change-admin/:employeeID', async (req, res) => {
  const employeeID = Number(req.params.employeeID);

  if (!employeeID || isNaN(employeeID)) {
    res.status(400).json({ error: 'Invalid employee ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Begin a transaction to ensure atomicity
    await client.query('BEGIN');

    try {
      // Toggle the IsAdmin status
      const toggleAdminSQL = 'UPDATE Employee SET IsAdmin = NOT IsAdmin WHERE ID = $1 RETURNING IsAdmin';
      const result = await client.query(toggleAdminSQL, [employeeID]);

      // Commit the transaction
      await client.query('COMMIT');

      res.json({ message: 'IsAdmin status changed successfully', IsAdmin: result.rows[0].isadmin });
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client after the transaction is complete
      client.release();
    }
  } catch (error) {
    console.error('Error changing IsAdmin status:', error);
    res.status(500).json({ error: 'An error occurred while changing IsAdmin status' });
  }
});

/*
* Change IsManager
* @params primary key of employee to have Manager status Changed
* @return success message with manager status
*/
app.put('/change-manager/:employeeID', async (req, res) => {
  const employeeID = Number(req.params.employeeID);

  if (!employeeID || isNaN(employeeID)) {
    res.status(400).json({ error: 'Invalid employee ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Begin a transaction to ensure atomicity
    await client.query('BEGIN');

    try {
      // Toggle the isManager status
      const toggleManagerSQL = 'UPDATE Employee SET isManager = NOT isManager WHERE ID = $1 RETURNING isManager';
      const result = await client.query(toggleManagerSQL, [employeeID]);

      // Commit the transaction
      await client.query('COMMIT');

      res.json({ message: 'isManager status changed successfully', isManager: result.rows[0].ismanager });
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client after the transaction is complete
      client.release();
    }
  } catch (error) {
    console.error('Error changing isManager status:', error);
    res.status(500).json({ error: 'An error occurred while changing isManager status' });
  }
});

/*
* Gets all the ingredient primary keys for every single menu drink
* @return all the ingredient primary keys for every single menu drink
*/
app.get('/get-menu-drinks-with-ingredients', async (req, res) => {
  try {
    const client = await pool.connect();

    const getMenuDrinksWithIngredientsSQL = `
      SELECT
        MD.ID AS MenuDrinkID,
        ARRAY_AGG(MDI.Ingredient_ID) AS Ingredients
      FROM
        Menu_Drink MD
      LEFT JOIN
        Menu_Drink_Ingredient MDI ON MD.ID = MDI.Menu_Drink_ID
      GROUP BY
        MD.ID`;

    const result = await client.query(getMenuDrinksWithIngredientsSQL);

    client.release();

    const menuDrinksWithIngredients = result.rows.map(row => [row.menudrinkid, row.ingredients]);

    res.json({ menuDrinksWithIngredients });
  } catch (error) {
    console.error('Error fetching menu drinks with ingredients:', error);
    res.status(500).json({ error: 'An error occurred while fetching menu drinks with ingredients' });
  }
});

/*
* Gets all the order drinks for an order
* @param the order primary key you want order drinks for
* @return all the order drink primary keys for the order
*/
app.get('/get-order-drinks-for-order/:orderID', async (req, res) => {
  const orderID = Number(req.params.orderID);

  if (!orderID || isNaN(orderID)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  try {
    const client = await pool.connect();

    const getOrderDrinksForOrderSQL = `
      SELECT OOD.Order_Drink_ID
      FROM Order_Order_Drink OOD
      WHERE OOD.Order_ID = $1`;

    const result = await client.query(getOrderDrinksForOrderSQL, [orderID]);

    client.release();

    const orderDrinkIDs = result.rows.map(row => row.order_drink_id);

    res.json({ orderDrinkIDs });
  } catch (error) {
    console.error('Error fetching order drinks for order:', error);
    res.status(500).json({ error: 'An error occurred while fetching order drinks for order' });
  }
});

/*
* Gets all the info for an order drink given its primary key
* @param the order drink primary key for the order drink
* @return all the fileds for that order drink
*/
app.get('/get-order-drink/:orderDrinkID', async (req, res) => {
  const orderDrinkID = Number(req.params.orderDrinkID);

  if (!orderDrinkID || isNaN(orderDrinkID)) {
    res.status(400).json({ error: 'Invalid order drink ID' });
    return;
  }

  try {
    const client = await pool.connect();

    const getOrderDrinkSQL = `
      SELECT *
      FROM Order_Drink
      WHERE ID = $1`;

    const result = await client.query(getOrderDrinkSQL, [orderDrinkID]);

    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Order drink not found' });
      return;
    }

    const orderDrink = result.rows[0];

    res.json({ orderDrink });
  } catch (error) {
    console.error('Error fetching order drink:', error);
    res.status(500).json({ error: 'An error occurred while fetching order drink' });
  }
});

/*
* Deletes an order drink
* @param the order drink primary key to be deleted
* @return success status
*/
app.delete('/delete-order-drink/:orderDrinkID', async (req, res) => {
  const orderDrinkID = Number(req.params.orderDrinkID);

  if (!orderDrinkID || isNaN(orderDrinkID)) {
    res.status(400).json({ error: 'Invalid order drink ID' });
    return;
  }

  try {
    const client = await pool.connect();

    // Delete from Order_Order_Drink
    const deleteOrderOrderDrinkSQL = `
      DELETE FROM Order_Order_Drink
      WHERE Order_Drink_ID = $1`;

    await client.query(deleteOrderOrderDrinkSQL, [orderDrinkID]);

    // Delete from Ingredient_Order_Drink
    const deleteIngredientOrderDrinkSQL = `
      DELETE FROM Ingredient_Order_Drink
      WHERE Order_Drink_ID = $1`;

    await client.query(deleteIngredientOrderDrinkSQL, [orderDrinkID]);

    // Delete from Order_Drink (with CASCADE effect)
    const deleteOrderDrinkSQL = `
      DELETE FROM Order_Drink
      WHERE ID = $1`;

    await client.query(deleteOrderDrinkSQL, [orderDrinkID]);

    client.release();

    res.json({ message: 'Order drink deleted successfully' });
  } catch (error) {
    console.error('Error deleting order drink:', error);
    res.status(500).json({ error: 'An error occurred while deleting order drink' });
  }
});

app.listen(port, () => {
  console.log(`Example listening at  http://localhost:${port}`);
  });