import express from 'express';

import postgresClient from './config/db.js';
import userRouter from './routers/userRoutes.js';

const app = express();

app.use(express.json());


app.use('/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  postgresClient.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database.....');
    }
  });
});
