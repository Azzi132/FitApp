import dotenv from 'dotenv';
import express from 'express';
import usersRouter from './routes/users.js';
import caloriesRouter from './routes/calories.js';
import goalsRouter from './routes/goals.js';
import workoutsRouter from './routes/workouts.js';

dotenv.config();

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use('/users', usersRouter);
app.use('/calories', caloriesRouter);
app.use('/workouts', workoutsRouter);
app.use('/goals', goalsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
