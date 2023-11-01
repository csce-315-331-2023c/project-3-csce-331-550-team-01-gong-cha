import express from 'express';
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({path: 'Credentials.env'} );
//Create experss app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
      Amount_Used DOUBLE PRECISION
    );

    CREATE TABLE Menu_Drink (
      ID SERIAL PRIMARY KEY,
      Name VARCHAR(50),
      Normal_Cost DOUBLE PRECISION,
      Large_Cost DOUBLE PRECISION,
      Norm_Consumer_Price DOUBLE PRECISION,
      Lg_Consumer_Price DOUBLE PRECISION
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

//create order
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
app.get('/manager-view-ingredient', async (req, res) => {
  const ingredientId = parseInt(req.query.ingredientId as string, 10);

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
app.get('/get-drink', async (req, res) => {
  const drinkId = parseInt(req.query.drinkId as string, 10);

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

//create Ingredient
app.post('/create-ingredient', async (req, res) => {
  const { name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed } = req.body;

  if (
    !name || 
    currentAmount === undefined ||
    idealAmount === undefined ||
    restockPrice === undefined ||
    consumerPrice === undefined ||
    amountUsed === undefined
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  try {
    const SQL = `INSERT INTO ingredient (Ingredient_Name, Current_Amount, Ideal_Amount, Restock_Price, Consumer_Price, Amount_Used)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID`;

    const client = await pool.connect();
    const result = await client.query(SQL, [name, currentAmount, idealAmount, restockPrice, consumerPrice, amountUsed]);
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
//restock Ingredients
app.get('/report-restock', async (req, res) => {
  var returnObject = []
  try {
    const querySQL = `
      SELECT ingredient_name, current_amount, ideal_amount
      FROM ingredient
      WHERE current_amount < (ideal_amount * 0.4)
    `;

    const client = await pool.connect();
    const { rows } = await client.query(querySQL);
    client.release();

    let result = "| Name of Ingredient                        | Current Amount  | Ideal Amount       |\n";

    for (const row of rows) {
      const name: string = row.ingredient_name;
      const currentAmount: number = row.current_amount;
      const idealAmount: number = row.ideal_amount;

      //result += `| ${name.padEnd(40)} | ${currentAmount.toString().padEnd(15)} | ${idealAmount.toString().padEnd(20)} |\n`;
      returnObject.push({ingredient_name: name, current_amount: currentAmount, ideal_amount: idealAmount})
    }

    //res.status(200).send(result);
    res.status(200).send(returnObject);
  } catch (error) {
    console.error('Error getting ingredients to restock:', error);
    res.status(500).json({ error: 'Error getting ingredients to restock' });
  }
});

//the listening happens here
app.listen(port, () => {
console.log(`Example listening at  http://localhost:${port}`);
});