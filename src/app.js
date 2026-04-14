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

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173",
      "https://library-hub-frontend-theta.vercel.app",
      "https://library-hub-frontend-git-main-j-pradyumnas-projects.vercel.app",
      "https://library-hub-frontend-884r5frqm-j-pradyumnas-projects.vercel.app",
      // Add wildcard pattern for future Vercel previews: https://*-j-pradyumnas-projects.vercel.app
      /^https:\/\/.*-j-pradyumnas-projects\.vercel\.app$/
    ];
    // Check exact match or regex
    if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200 // For legacy browsers
};

app.use(cors());
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