// models/recommendation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust the path as necessary

const Recommendation = sequelize.define(
  "Recommendation",
  {
    recommendationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    searchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

sequelize
  .sync()
  .then(() => {
    console.log(
      "Recommendation table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Recommendation model:",
      error
    )
  );
module.exports = Recommendation;
