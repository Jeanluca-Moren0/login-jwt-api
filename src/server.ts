import express from 'express';
import { config } from 'dotenv';

import route from './routes'

config();


const PORT = Number(process.env.PORT) || 3333;

const app = express();

app.use(express.json());
app.use(route)
app.listen(PORT);
