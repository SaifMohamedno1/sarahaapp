
import express from "express";
import messageController from "./Modules/Users/Services/message/message.controller.js";
import userController from  "./Modules/Users/Services/User/user.controller.js";
import dbconnection from "../Src/db/Models/db.connection.js";
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "./Utils/token.utilis.js";

dbconnection();
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/messages', messageController);
app.use('/users', userController);

app.use((req, res) => {
    res.status(404).send({ message: "404 Noot Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
