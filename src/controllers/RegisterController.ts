import { Request, Response } from 'express';
import connection from '../config/dbConnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

async function RegisterController(req: Request, res: Response) {
  try {
    const client = await connection();
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send('All inputs required');
    }

    const oldUserQuery = {
      text: 'SELECT * FROM users where email = ($1)',
      values: [email.toLowerCase()],
    };

    const oldUser = await client.query(oldUserQuery);

    if (oldUser.rowCount > 0) {
      return res.status(409).send('User already exists. Please Login.');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const userQuery = {
      text: 'INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [first_name, last_name, email.toLowerCase(), encryptedPassword],
    };

    const user = await client.query(userQuery);

    
    const { id } = user.rows[0];

    const token = jwt.sign({ user_id: id, email }, process.env.TOKEN_KEY, {
      expiresIn: '2h',
    });

    const tokenQuery = {
      text: 'UPDATE users SET token = ($1) WHERE id = ($2)',
      values: [token, id],
    };

    await client.query(tokenQuery);
    
    res.status(201).json({message: `User registered with success`});
  } catch (err) {
    console.log(err);
  }
}

export default RegisterController;
