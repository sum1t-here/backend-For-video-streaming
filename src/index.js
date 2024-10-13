import { config } from "dotenv";
import connectDB from "./db/dbconfig.js";
import app from "./app.js";

config();

connectDB()
  .then(() => {
    app
      .listen(process.env.PORT || 8000, () => {
        console.log(`App is listening on Port ${process.env.PORT}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log("\nPort is busy, try using another port !!!");
        } else {
          console.log(err);
        }
      });
  })
  .catch((err) => {
    console.log("\nMongoDB connection failed !!!", err);
  });
