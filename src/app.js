import express from "express";
import bookRouter  from "./routes/books.route.js";
import memberRouter from "./routes/members.route.js";
import publisherRouter from "./routes/publishers.route.js";
import transactionRouter from "./routes/transactions.route.js";
const app = express();
app.use(express.json());

app.use('/api/v1/book',bookRouter);
app.use('/api/v1/member',memberRouter);
app.use('/api/v1/publisher',publisherRouter)
app.use('/api/v1/transaction',transactionRouter)
export default app;