import express from "express";
import bookRouter  from "./routes/books.route.js";
import memberRouter from "./routes/members.route.js";
import publisherRouter from "./routes/publishers.route.js";
import transactionRouter from "./routes/transactions.route.js";
import adminRouter from "./routes/admins.route.js";
import borrowRequestRouter from "./routes/borrowRequest.route.js";
import notificationRouter from "./routes/notifications.route.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173","https://library-hub-frontend-theta.vercel.app","https://library-hub-frontend-git-main-j-pradyumnas-projects.vercel.app","https://library-hub-frontend-884r5frqm-j-pradyumnas-projects.vercel.app"], // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form
app.use("/uploads", express.static("uploads"));
app.use('/api/v1/book',bookRouter);
app.use('/api/v1/member',memberRouter);
app.use('/api/v1/publisher',publisherRouter)
app.use('/api/v1/transaction',transactionRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/borrowRequest',borrowRequestRouter)
app.use('/api/v1/notification',notificationRouter)
export default app;