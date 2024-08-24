const express = require("express");
const sequelize = require("./config/db");
require("dotenv").config();
const recommendroutes = require("./routes/recommendationRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("API is running...");
});



app.use("/Recommend", recommendroutes);
app.use("/users", userRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
