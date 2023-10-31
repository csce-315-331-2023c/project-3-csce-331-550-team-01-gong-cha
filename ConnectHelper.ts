import { Connection, DriverManager, PreparedStatement, ResultSet, Statement } from 'java.sql';
import { LocalDate, DateTimeFormatter } from 'java.time';
import { ArrayList } from 'java.util';
import * as path from 'path';

class ConnectHelper {
    private readonly url: string = "jdbc:postgresql:";
    private readonly user: string = "csce331_550_01_dyllenf";
    private readonly password: string = "uhz82L8R";

    public connect(): Connection {
        return DriverManager.getConnection(this.url, this.user, this.password);
    }

    public executeUpdateQuery(SQL: string): void {
        try {
            const conn: Connection = this.connect();
            const preparedStatement: PreparedStatement = conn.prepareStatement(SQL);
            preparedStatement.executeUpdate();
        } catch (ex) {
            console.log(ex.getMessage());
        }
    }

    public dropTables(): number {
        const SQL: string = "DROP TABLE employee CASCADE; DROP TABLE ingredient CASCADE; DROP TABLE ingredient_order_drink CASCADE; DROP TABLE menu_drink CASCADE; DROP TABLE menu_drink_ingredient CASCADE; DROP TABLE order_drink CASCADE; DROP TABLE order_order_drink CASCADE; DROP TABLE orders CASCADE;";
        let count: number = 0;
        try {
            const conn: Connection = this.connect();
            const stmt: Statement = conn.createStatement();
            const rs: ResultSet = stmt.executeQuery(SQL);
            rs.next();
            count = rs.getInt(1);
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return count;
    }

    public createTables(): number {
        const SQL: string = "CREATE TABLE Ingredient (ID SERIAL PRIMARY KEY,Ingredient_Name VARCHAR(50),Current_Amount DOUBLE PRECISION, Ideal_Amount DOUBLE PRECISION, Restock_Price DOUBLE PRECISION,Consumer_Price DOUBLE PRECISION,Amount_Used DOUBLE PRECISION);CREATE TABLE Menu_Drink(ID SERIAL PRIMARY KEY,Name VARCHAR(50),Normal_Cost DOUBLE PRECISION,Large_Cost DOUBLE PRECISION,Norm_Consumer_Price DOUBLE PRECISION,Lg_Consumer_Price DOUBLE PRECISION);CREATE TABLE Menu_Drink_Ingredient (Menu_Drink_ID INTEGER,Ingredient_ID INTEGER,PRIMARY KEY (Menu_Drink_ID, Ingredient_ID),CONSTRAINT fk_Menu_Drink FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID),CONSTRAINT fk_Ingredient FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID));CREATE TABLE Employee(ID SERIAL PRIMARY KEY,Manager_ID INTEGER,Name VARCHAR(50),isManager BOOLEAN,Username VARCHAR(50),Password VARCHAR(200),FOREIGN KEY (Manager_ID) REFERENCES Employee(ID));CREATE TABLE Order_Drink(ID SERIAL PRIMARY KEY,Total_Price DOUBLE PRECISION,Size INTEGER,Menu_Drink_ID INTEGER,Ice_Level INTEGER,Sugar_Level INTEGER,FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID));CREATE TABLE Ingredient_Order_Drink(Order_Drink_ID INTEGER,Ingredient_ID INTEGER,Amount INTEGER,PRIMARY KEY (Order_Drink_ID, Ingredient_ID),FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID),FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID));CREATE TABLE Orders(ID SERIAL PRIMARY KEY,Server_ID INTEGER,Name VARCHAR(50),Cost DOUBLE PRECISION,Price DOUBLE PRECISION,Profit DOUBLE PRECISION, Tip DOUBLE PRECISION, Takeout BOOLEAN,Date DATE NOT NULL DEFAULT CURRENT_DATE,Time TIME,FOREIGN KEY (Server_ID) REFERENCES Employee(ID));CREATE TABLE Order_Order_Drink (Order_ID INTEGER,Order_Drink_ID INTEGER,PRIMARY KEY (Order_ID, Order_Drink_ID),FOREIGN KEY (Order_ID) REFERENCES Orders(ID),FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID));";
        let count: number = 0;
        try {
            const conn: Connection = this.connect();
            const stmt: Statement = conn.createStatement();
            const rs: ResultSet = stmt.executeQuery(SQL);
            rs.next();
            count = rs.getInt(1);
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return count;
    }

    public populateTables(): number {
        const directory: string = path.resolve(__dirname);

        const SQL: string = "\\copy employee from '" + directory + "/employee.csv' delimiter ',' CSV HEADER;";
        console.log(SQL);
        let count: number = 0;
        try {
            const conn: Connection = this.connect();
            const stmt: Statement = conn.createStatement();
            const rs: ResultSet = stmt.executeQuery(SQL);
            rs.next();
            count = rs.getInt(1);
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return count;
    }

    public createOrderDrink(topping_cost: number, size: number, mdID: number, iceLevel: number, sugarLevel: number): number[] {
        let total_price: number = 0;
        let drink_price: number = 0;
        let make_cost: number = 0;

        const sizeStr: string = size.toString();
        const drinkID: string = mdID.toString();
        const ice: string = iceLevel.toString();
        const sugar: string = sugarLevel.toString();
        let priceQuery: string = "";
        if (size == 0) {
            priceQuery = `SELECT norm_consumer_price AS consumer_price, Normal_Cost AS make_cost FROM menu_drink WHERE ID = ${drinkID}`;
        } else if (size == 1) {
            priceQuery = `SELECT lg_consumer_price as consumer_price, Large_Cost AS make_cost FROM menu_drink WHERE ID = ${drinkID}`;
        }
        try {
            const conn: Connection = this.connect();
            const stmt: Statement = conn.createStatement();
            const rs: ResultSet = stmt.executeQuery(priceQuery);
            while (rs.next()) {
                drink_price = rs.getDouble("consumer_price");
                make_cost = rs.getDouble("make_cost");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        total_price += drink_price + topping_cost;
        const drink_order_query: string = `INSERT INTO order_drink (menu_drink_id, total_price, size, ice_level, sugar_level) VALUES (${drinkID}, ${total_price}, ${sizeStr}, ${ice}, ${sugar})`;
        let generatedKey: number = -1;
        try {
            const conn: Connection = this.connect();
            const preparedStatement: PreparedStatement = conn.prepareStatement(drink_order_query, Statement.RETURN_GENERATED_KEYS);
            preparedStatement.executeUpdate();
            const rs: ResultSet = preparedStatement.getGeneratedKeys();
            if (rs.next()) {
                generatedKey = rs.getDouble(1);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        const result: number[] = new Array(3);
        result[0] = total_price;
        result[1] = generatedKey;
        result[2] = make_cost;
        return result;
    }

    public createOrder(serverID: number, total_cost: number, price: number, profit: number, tipped: number, takeout: boolean, date: string, time: string, nm: string): void {
        const sID: string = serverID.toString();
        const cost: string = total_cost.toString();
        const prc: string =  price.toString();
        const prof: string =  profit.toString();
        const tip: string =  tipped.toString();
        const take: string = takeout ? "TRUE" : "FALSE";
        const name: string = nm;
        const SQL: string = `INSERT INTO orders (server_id, name, cost, price, profit, tip, takeout, date, time) VALUES (${sID}, '${name}', ${cost}, ${prc}, ${prof}, ${tip}, ${take}, '${date}', '${time}')`;
        try {
            const conn: Connection = this.connect();
            const preparedStatement: PreparedStatement = conn.prepareStatement(SQL);
            preparedStatement.executeUpdate();
        } catch (ex) {
            ex.printStackTrace();
        }
    }

    public createIngredientOrderDrinks(toppingPKs: ArrayList<number>, toppingAmounts: ArrayList<number>, orderDrinkPK: number): void {
        const oID: string =  orderDrinkPK.toString();
        for (let i = 0; i < toppingAmounts.size(); i++) {
            const currentPK: string =  toppingPKs.get(i).toString();
            const currentAmount: string =  toppingAmounts.get(i).toString();
            const SQL: string = `INSERT INTO ingredient_order_drink (order_drink_id, ingredient_id, amount) VALUES (${oID}, ${currentPK}, ${currentAmount})`;
            this.executeUpdateQuery(SQL);
        }
    }

    public managerViewIngredient(ingredientId: number): string {
        let result: string = "";
        const id: string =  ingredientId.toString();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL: string = `SELECT * FROM ingredient WHERE id = ${id}`;
            const resultSet: ResultSet = statement.executeQuery(SQL);

            while (resultSet.next()) {
                const amountUsed: number = resultSet.getDouble("amount_used");
                const ingredientAmount: number = resultSet.getInt("current_amount");
                const ingredientIdeal: number = resultSet.getInt("ideal_amount");

                result += `Current Amount: ${ingredientAmount}, Ideal Amount: ${ingredientIdeal}, Amount Used: ${amountUsed}\n`;
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public managerUpdateIngredients(ingredientID: number, updateAmount: number): void {
        const id: string =  ingredientID.toString();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL: string = `SELECT current_amount FROM ingredient WHERE id = ${id}`;
            const resultSet: ResultSet = statement.executeQuery(SQL);
            let newAmount: number = 0;

            while (resultSet.next()) {
                const current: number = resultSet.getInt("current_amount");
                newAmount = current + updateAmount;
                const amount: string =  newAmount.toString();
                this.executeUpdateQuery(`UPDATE ingredient SET current_amount = ${amount} WHERE id = ${id}`);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
    }

    public changePrice(drink_id: number, size: number, price: number): void {
        const id: string =  drink_id.toString();
        const newPrice: string =  price.toString();
        let SQL: string = "";
        if (size == 0) {
            SQL = `UPDATE menu_drink SET norm_consumer_price = ${newPrice} WHERE id = ${id}`;
            this.executeUpdateQuery(SQL);
        } else {
            SQL = `UPDATE menu_drink SET lg_consumer_price = ${newPrice} WHERE id = ${id}`;
            this.executeUpdateQuery(SQL);
        }
    }

    public getDrink(drinkId: number): string {
        let result: string = "";
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL: string = `SELECT Name, norm_consumer_price, lg_consumer_price FROM Menu_Drink WHERE ID = ${drinkId}`;
            const resultSet: ResultSet = statement.executeQuery(SQL);

            if (resultSet.next()) {
                const drinkName: string = resultSet.getString("Name");
                const normalCost: number = resultSet.getDouble("norm_consumer_price");
                const largeCost: number = resultSet.getDouble("lg_consumer_price");

                result = `Normal price of ${drinkName}: ${normalCost}\n` +
                    `Large price of ${drinkName}: ${largeCost}`;
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public getPopularDrink(): string {
        let drinkName: string = "";
        let drinkCount: string = "";
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL: string = "SELECT md.Name AS drink_name, COUNT(ood.Order_ID) AS order_count FROM Orders o JOIN Order_Order_Drink ood ON o.ID = ood.Order_ID JOIN Menu_Drink md ON ood.Order_Drink_ID = md.ID GROUP BY md.name;";
            const resultSet: ResultSet = statement.executeQuery(SQL);
            if (resultSet.next()) {
                drinkName = resultSet.getString("drink_name");
                drinkCount =  (resultSet.getString("order_count"));
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return drinkName + ": " + drinkCount;
    }


    public salesReport(startDate: string, endDate: string): string {
        let result = "";
        const start = startDate.valueOf();
        const end = endDate.valueOf();

        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const querySQL = "SELECT " +
                "    MD.Name AS MenuDrinkName, " +
                "    MD.Norm_Consumer_Price AS MenuDrinkPrice, " +
                "    COUNT(OD.ID) AS AmountSold " +
                "FROM " +
                "    Menu_Drink MD " +
                "LEFT JOIN Order_Drink OD ON MD.ID = OD.Menu_Drink_ID " +
                "LEFT JOIN Order_Order_Drink OOD ON OD.ID = OOD.Order_Drink_ID " +
                "LEFT JOIN Orders O ON OOD.Order_ID = O.ID " +
                "WHERE " +
                "    O.Date BETWEEN ? AND ? " +
                "GROUP BY " +
                "    MD.Name, MD.Norm_Consumer_Price ";
            const preparedStatement: PreparedStatement = conn.prepareStatement(querySQL);
            preparedStatement.setDate(1, start);
            preparedStatement.setDate(2, end);

            const resultSet: ResultSet = preparedStatement.executeQuery();
            result += String(`| Name of Drink | Amount Sold | Price of Drink |\n`);

            while (resultSet.next()) {
                const MenuDrinkName = resultSet.getString("MenuDrinkName");
                const quantitySold = resultSet.getInt("AmountSold");
                const menuDrinkPrice = resultSet.getDouble("MenuDrinkPrice");

                result += String(`| ${MenuDrinkName} | ${quantitySold} | ${menuDrinkPrice} |\n`);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public newSeasonalMenuItem(name: string, normalCost: number, largeCost: number, normConsumerPrice: number, lgConsumerPrice: number, ingredientPKs: Array<number>): void {
        try {
            const conn: Connection = this.connect();
            conn.setAutoCommit(false);

            const insertMenuDrinkSQL = "INSERT INTO Menu_Drink (Name, Normal_Cost, Large_Cost, Norm_Consumer_Price, Lg_Consumer_Price) VALUES (?, ?, ?, ?, ?) RETURNING ID";
            let menuDrinkId: number = 0;
            try {
                const preparedStatement: PreparedStatement = conn.prepareStatement(insertMenuDrinkSQL, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1, name);
                preparedStatement.setDouble(2, normalCost);
                preparedStatement.setDouble(3, largeCost);
                preparedStatement.setDouble(4, normConsumerPrice);
                preparedStatement.setDouble(5, lgConsumerPrice);
                preparedStatement.executeUpdate();
                const generatedKeys: ResultSet = preparedStatement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    menuDrinkId = generatedKeys.getInt(1);
                } else {
                    throw new Error("Failed to retrieve generated keys.");
                }
            } catch (ex) {
                console.log(ex.getMessage());
            }

            const insertMenuDrinkIngredientSQL = "INSERT INTO Menu_Drink_Ingredient (Menu_Drink_ID, Ingredient_ID) VALUES (?, ?)";
            try {
                const preparedStatement: PreparedStatement = conn.prepareStatement(insertMenuDrinkIngredientSQL);
                for (const ingredientPK of ingredientPKs) {
                    preparedStatement.setInt(1, menuDrinkId);
                    preparedStatement.setInt(2, ingredientPK);
                    preparedStatement.executeUpdate();
                }
            } catch (ex) {
                console.log(ex.getMessage());
            }
            conn.commit();
            conn.setAutoCommit(true);
        } catch (ex) {
            console.log(ex.getMessage());
        }
    }

    public getAllDrinkNames(): Array<Array<string>> {
        const drinkNames: Array<string> = new Array<string>();
        const drinkIDs: Array<string> = new Array<string>();
        const result: Array<Array<string>> = new Array<Array<string>>();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL = "SELECT Name, id FROM Menu_Drink";
            const resultSet: ResultSet = statement.executeQuery(SQL);
            while (resultSet.next()) {
                const drinkName = resultSet.getString("Name");
                const drinkID = resultSet.getString("id");
                drinkIDs.push(drinkID);
                drinkNames.push(drinkName);
            }
            result.push(drinkIDs);
            result.push(drinkNames);
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public getEmployeeUsernamesAndPasswords(): Array<Array<string>> {
        const result: Array<Array<string>> = new Array<Array<string>>();
        const usernames: Array<string> = new Array<string>();
        const passwords: Array<string> = new Array<string>();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL = "SELECT Username, Password FROM Employee";
            const resultSet: ResultSet = statement.executeQuery(SQL);
            while (resultSet.next()) {
                const username = resultSet.getString("Username");
                const password = resultSet.getString("Password");
                usernames.push(username);
                passwords.push(password);
            }

            result.push(usernames);
            result.push(passwords);
        }
        catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public getIngredientData(): Array<Array<string>> {
        const result: Array<Array<string>> = new Array<Array<string>>();
        const ingredientNames: Array<string> = new Array<string>();
        const currentAmounts: Array<string> = new Array<string>();
        const amountUsed: Array<string> = new Array<string>();
        const consumerPrices: Array<string> = new Array<string>();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL = "SELECT Ingredient_Name, Current_Amount, Amount_Used, Consumer_Price FROM Ingredient LIMIT 15 OFFSET 25";
            const resultSet: ResultSet = statement.executeQuery(SQL);
            while (resultSet.next()) {
                const name = resultSet.getString("Ingredient_Name");
                const currentAmount = resultSet.getString("Current_Amount");
                const usedAmount = resultSet.getString("Amount_Used");
                const price = resultSet.getString("Consumer_Price");
                ingredientNames.push(name);
                currentAmounts.push(currentAmount);
                amountUsed.push(usedAmount);
                consumerPrices.push(price);
            }

            result.push(ingredientNames);
            result.push(currentAmounts);
            result.push(amountUsed);
            result.push(consumerPrices);
        }
        catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public getIngredientNames(): Array<string> {
        const ingredientNames: Array<string> = new Array<string>();
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const SQL = "SELECT Ingredient_Name FROM Ingredient";
            const resultSet: ResultSet = statement.executeQuery(SQL);
            while (resultSet.next()) {
                const name = resultSet.getString("Ingredient_Name");
                ingredientNames.push(name);
            }
        }
        catch (ex) {
            console.log(ex.getMessage());
        }
        return ingredientNames;
    }

    public createIngredient(name: string, cAmount: number, iAmount: number, restockPrice: number, consumerPrice: number, amountUsed: number): number {
        const currentAmount =  (cAmount);
        const ideal =  (iAmount);
        const restock =  (restockPrice);
        const consumer =  (consumerPrice);
        const used =  (amountUsed);
        const SQL = String("INSERT INTO ingredient (Ingredient_Name, Current_Amount, Ideal_Amount, Restock_Price, Consumer_Price, Amount_Used) " +
            `VALUES ('${name}', ${currentAmount}, ${ideal}, ${restock}, ${consumer}, ${used}) RETURNING ID`);
        try {
            const conn: Connection = this.connect();
            const preparedStatement: PreparedStatement = conn.prepareStatement(SQL);
            const resultSet: ResultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("ID");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return -1;
    }

    public restockIngredients(): string {
        let result = "";
        try {
            const conn: Connection = this.connect();
            const statement: Statement = conn.createStatement();
            const querySQL = "SELECT * FROM ingredient WHERE ingredient.Current_Amount < (Ingredient.Ideal_Amount * 0.4);\r\n";
            const preparedStatement: PreparedStatement = conn.prepareStatement(querySQL);

            const resultSet: ResultSet = preparedStatement.executeQuery();
            result += String("| Name of Ingredient | Curent Amount | Ideal Amount |\n");

            while (resultSet.next()) {
                const name = resultSet.getString("ingredient_name");
                const currentAmount = resultSet.getInt("current_amount");
                const idealAmount = resultSet.getInt("ideal_amount");

                result += String(`| ${name} | ${currentAmount} | ${idealAmount} |\n`);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public soldTogether(startDate: string, endDate: string): string {
        let result: string = "";
        let start: Date = new Date(startDate);
        let end: Date = new Date(endDate);
        try {
            let conn: Connection = this.connect();
            let statement: Statement = conn.createStatement();
            let querySQL: string = `WITH OrdersOnDates AS (
                SELECT
                    o.ID AS OrderID,
                    md.ID AS MenuDrinkID
                FROM Orders o
                JOIN Order_Order_Drink ood ON o.ID = ood.Order_ID
                JOIN Order_Drink od ON ood.Order_Drink_ID = od.ID
                JOIN Menu_Drink md ON od.Menu_Drink_ID = md.ID
                WHERE o.Date BETWEEN ? AND ?
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
            ORDER BY SalesCount DESC`;
            let preparedStatement: PreparedStatement = conn.prepareStatement(querySQL);
            preparedStatement.setDate(1, start);
            preparedStatement.setDate(2, end);

            let resultSet: ResultSet = preparedStatement.executeQuery();
            result += `| ${"Item 1".padEnd(40)} | ${"Item 2".padEnd(15)} | ${"Count".padEnd(5)} |\n`;

            while (resultSet.next()) {
                let drink1: string = resultSet.getString("menudrink1");
                let drink2: string = resultSet.getString("menudrink2");
                let salesCount: number = resultSet.getInt("salescount");

                result += `| ${drink1.padEnd(40)} | ${drink2.padEnd(40)} | ${salesCount.toString().padEnd(5)} |\n`;
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return result;
    }

    public excessReport(startDate: string): string {
        let amount: number = this.numberOfMenuDrinks() + 1;
        let menuDrinkTuple: string = "(";
        for (let i = 1; i < amount + 1; i++) {
            menuDrinkTuple += i + ",";
        }
        menuDrinkTuple = menuDrinkTuple.substring(0, menuDrinkTuple.length - 1);
        menuDrinkTuple += ")";
        let drinks: number[] = new Array(amount);
        let ingAmount: number = this.numberOfIngredients();
        let ingredients: number[] = new Array(ingAmount + 1);
        let report: string = "";
        let orderPairs: ResultSet = this.getOrderDrinkPairs(startDate);
        let idTuple: string = "(";
        try {
            while (orderPairs.next()) {
                let orderDrinkID: number = orderPairs.getInt("OrderDrinkID");
                idTuple += orderDrinkID.toString() + ",";
            }
            idTuple = idTuple.substring(0, idTuple.length - 1);
            idTuple += ")";
            let menuIds: number[] = this.getMenuDrinksforOrderDrinks(idTuple);
            for (let i = 0; i < menuIds.length - 1; i++) {
                drinks[menuIds[i]]++;
            }
        } catch (e) {
            console.log(e.printStackTrace());
        }

        let ingredientsList: number[][] = this.getIngredientsForMenuDrinks(menuDrinkTuple, amount + 1);
        for (let i = 0; i < ingredientsList.length - 1; i++) {
            let amountUsed: number = 0;
            for (let j = 0; j < ingredientsList[i].length - 1; j++) {
                let query: string = "SELECT Amount_Used FROM ingredient WHERE ID = ?";
                try {
                    let conn: Connection = this.connect();
                    let preparedStatement: PreparedStatement = conn.prepareStatement(query);
                    preparedStatement.setInt(1, ingredientsList[i][j]);
                    let resultSet: ResultSet = preparedStatement.executeQuery();
                    if (resultSet.next()) {
                        amountUsed = resultSet.getDouble("Amount_Used");
                    } else {

                    }
                } catch (ex) {
                    console.log(ex.getMessage());
                }
                ingredients[ingredientsList[i][j] - 1] = ((drinks[i] as number) * amountUsed);
            }
        }
        for (let i = 1; i < ingredients.length - 1; i++) {
            if (ingredients[i] / (this.getIdealAmountForIngredient(i)) < .1) {
                report = report + " " + this.getIngredientName(i) + "\n";
            }
        }
        return report;
    }


    public getIdealAmountForIngredient(ingredientId: number): number {
        let idealAmount: number = -1.0;
        try {
            let conn: Connection = this.connect();
            let preparedStatement: PreparedStatement = conn.prepareStatement("SELECT Ideal_Amount FROM ingredient WHERE ID = ?");
            preparedStatement.setInt(1, ingredientId);
            let resultSet: ResultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                idealAmount = resultSet.getDouble("Ideal_Amount");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return idealAmount;
    }


    public getIngredientName(ingredientId: number): string {
        let ingredientName: string = "";
        try {
            let conn: Connection = this.connect();
            let preparedStatement: PreparedStatement = conn.prepareStatement("SELECT Ingredient_Name FROM ingredient WHERE ID = ?");
            preparedStatement.setInt(1, ingredientId);
            let resultSet: ResultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                ingredientName = resultSet.getString("Ingredient_Name");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return ingredientName;
    }

    public getMenuDrinksforOrderDrinks(idTuple: string): number[] {
        let drinks: number[] = new Array();
        try {
            let conn: Connection = this.connect();
            let preparedStatement: PreparedStatement = conn.prepareStatement("SELECT Menu_Drink_ID FROM Order_Drink WHERE ID IN " + idTuple);
            let resultSet: ResultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                let menuDrinkId: number = resultSet.getInt("Menu_Drink_ID");
                drinks.push(menuDrinkId);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return drinks;
    }

    public numberOfMenuDrinks(): number {
        let amount: number = 0;
        try {
            let conn: Connection = this.connect();
            let statement: Statement = conn.createStatement();
            let SQL: string = "SELECT COUNT(ID) from menu_drink";
            let resultSet: ResultSet = statement.executeQuery(SQL);
            if (resultSet.next()) {
                amount = resultSet.getInt("Count");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return amount;
    }

    public  numberOfIngredients(): number {
        let amount: number = 0;
        try {
            let conn: Connection = this.connect();
            let statement: Statement = conn.createStatement();
            let SQL: string = "SELECT COUNT(ID) from ingredient";
            let resultSet: ResultSet = statement.executeQuery(SQL);
            if (resultSet.next()) {
                amount = resultSet.getInt("Count");
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return amount;
    }

    public getOrderDrinkPairs(startDate: string): ResultSet {
        let start: Date = new Date(startDate);
        let query: string = `SELECT O.ID AS OrderID, OD.ID AS OrderDrinkID
            FROM Orders O
            INNER JOIN Order_Order_Drink OOD ON O.ID = OOD.Order_ID
            INNER JOIN Order_Drink OD ON OOD.Order_Drink_ID = OD.ID
            WHERE Date >= ? AND Date <= current_date`;
        try {
            let conn: Connection = this.connect();
            let statement: Statement = conn.createStatement();
            let preparedStatement: PreparedStatement = conn.prepareStatement(query);
            preparedStatement.setDate(1, start);
            let result: ResultSet = preparedStatement.executeQuery();

            return result;
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return null;
    }

    public getIngredientsForMenuDrinks(menuDrinkIDs: string, numberOfMenuDrinks: number): number[][] {
        let ingsForMenuDrinks: number[][] = new Array();
        for (let i = 0; i < numberOfMenuDrinks; i++) {
            ingsForMenuDrinks.push(new Array());
        }
        try {
            let conn: Connection = this.connect();
            let preparedStatement: PreparedStatement = conn.prepareStatement(`SELECT i.ID AS Ingredient_ID, i.Ingredient_Name, mdi.Menu_Drink_ID FROM Menu_Drink_Ingredient mdi JOIN Ingredient i ON mdi.Ingredient_ID = i.ID WHERE mdi.Menu_Drink_ID IN ${menuDrinkIDs}`);
            let resultSet: ResultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                let menuDrinkID: number = resultSet.getInt("menu_drink_id");
                let ingredientID: number = resultSet.getInt("ingredient_id");
                ingsForMenuDrinks[menuDrinkID].push(ingredientID);
            }
        } catch (ex) {
            console.log(ex.getMessage());
        }
        return ingsForMenuDrinks;
    }

}
