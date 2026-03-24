import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';
dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connectDB();
        app.on("error",(error) => {
            console.error("ERROR",error)
            throw error;
        });
        app.listen( process.env.PORT|| 5000, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("MongoDB Connection failed",error)
    }
}
app.get("/",(req,res) => {
    res.json({
         message: "Hello from server",
    });
});

startServer();