
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
    Lg_Consumer_Price DOUBLE PRECISION,
    Category_ID INTEGER,
    CONSTRAINT fk_Category FOREIGN KEY (Category_ID) REFERENCES Category(ID),
    Is_Offered BOOLEAN DEFAULT TRUE
);

CREATE TABLE Menu_Drink_Ingredient (
    Menu_Drink_ID INTEGER,
    Ingredient_ID INTEGER,
    PRIMARY KEY (Menu_Drink_ID, Ingredient_ID),
    CONSTRAINT fk_Menu_Drink FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID),
    CONSTRAINT fk_Ingredient FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID)
);


CREATE TABLE Employee(
    ID SERIAL PRIMARY KEY,
    Manager_ID INTEGER,
    Name VARCHAR(50),
    isManager BOOLEAN,
    Email VARCHAR(50),
    IsAdmin BOOLEAN DEFAULT FALSE,
    IsEmployed BOOLEAN DEFAULT TRUE,
    IsManager BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Manager_ID) REFERENCES Employee(ID)
);

CREATE TABLE Order_Drink(
    ID SERIAL PRIMARY KEY,
    Total_Price DOUBLE PRECISION,
    Size INTEGER,
    Menu_Drink_ID INTEGER,
    Ice_Level INTEGER,
    Sugar_Level INTEGER,
    FOREIGN KEY (Menu_Drink_ID) REFERENCES Menu_Drink(ID)
);


-- additions junction table
CREATE TABLE Ingredient_Order_Drink(
    Order_Drink_ID INTEGER,
    Ingredient_ID INTEGER,
    Amount INTEGER,
    PRIMARY KEY (Order_Drink_ID, Ingredient_ID),
    CONSTRAINT fk_Order_Drink FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID),
    CONSTRAINT fk_Ingredient FOREIGN KEY (Ingredient_ID) REFERENCES Ingredient(ID)
);


CREATE TABLE Orders(
    ID SERIAL PRIMARY KEY,
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


-- order and order drink junction table
CREATE TABLE Order_Order_Drink (
    Order_ID INTEGER,
    Order_Drink_ID INTEGER,
    PRIMARY KEY (Order_ID, Order_Drink_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(ID),
    FOREIGN KEY (Order_Drink_ID) REFERENCES Order_Drink(ID)
);
