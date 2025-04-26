import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas básicas
app.get('/', (req, res) => {
  res.send('CI/CD System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});