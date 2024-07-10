# FoodHub

This is a VueJS project for HD grade for the COS30043 - Interface Design and Development course.

# Prerequisites
- Node.js and npm installed on your machine
- MongoDB instance (local or remote)

# Setup instructions
## 1. Install Dependencies
```
npm install
```
## 2. Setup Environment Variables
Create a .env file in the root directory of the project based on the .env.example file
## 3. Connect to the database
1. Install **MongoDB for VS Code**. 
2. Open the Visual Studio Code Command Palette ([Please refer to this guide for more details](https://www.mongodb.com/docs/mongodb-vscode/connect/#open-the-command-palette)). 
3. Paste the connection string from the **.env** file to the command palette.
4. Click on the connection in the **Connections** pane to connect to the database (Required every time you use the app)

## 4. Run the application 
```
npm run dev
```

# Acknowledgements

API: [TheMealDB](https://themealdb.com/)
Database: [MongoDB](https://www.mongodb.com)
