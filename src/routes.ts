import express from 'express'
import RegisterController from './controllers/RegisterController';
import LoginController from './controllers/LoginController';
import auth from './middlewares/auth';

const route = express();

route.post('/register', RegisterController);

route.post('/login', LoginController);
route.post('/welcome', auth, (req, res) => {
  res.status(200).send(`welcome`)
})

export default route 