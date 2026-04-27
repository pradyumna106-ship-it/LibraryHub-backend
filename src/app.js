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
app.use(cors({
  origin: [
    "https://library-hub-frontend-snowy.vercel.app",
    "https://library-hub-frontend-git-main-j-pradyumnas-projects.vercel.app",
    "https://library-hub-frontend-7339xwdn6-j-pradyumnas-projects.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true}));
app.options('/{*path}', cors());
app.use('/{*path}', handler);
app.get('/{*path}', handler);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form
app.use("/uploads", express.static("uploads"));
app.get('/', (req, res) => {
  res.status(200).json({ message: "API Connected Successfully" })
})
app.use('/api/v1/book',bookRouter);
app.use('/api/v1/member',memberRouter);
app.use('/api/v1/publisher',publisherRouter)
app.use('/api/v1/transaction',transactionRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/borrowRequest',borrowRequestRouter)
app.use('/api/v1/notification',notificationRouter)
export default app;