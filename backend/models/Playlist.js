// models/playlist.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust the path as necessary

const Playlist = sequelize.define(
  "Playlist",
  {
    playlistId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playlistTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playlistUrl: {
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
      "Playlist table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Playlist model:",
      error
    )
  );

module.exports = Playlist;
