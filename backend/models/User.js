const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Additional model options can go here
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// Synchronize the model with the database
// Make sure this synchronization is called before using the model elsewhere in your app
sequelize
  .sync()
  .then(() => {
    console.log(
      "User table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error("This error occurred while syncing the User model:", error)
  );

module.exports = User;
