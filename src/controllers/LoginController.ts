import { Request, Response } from 'express';
import connection from '../config/dbConnection'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config();

async function LoginController(req: Request, res: Response) {
  try {
    const client = await connection();
    const { email, password } = req.body;

    if(!(email && password)){
      res.status(400).send("All inputs are required")
    }

    const UserQuery = {
      text: 'SELECT * FROM users where email = ($1)',
      values: [email.toLowerCase()],
    };

    const user = await client.query(UserQuery);
    
    const { id } = user.rows[0];

    if(user.rows && (await bcrypt.compare(password, user.rows[0].password))){
      const token = jwt.sign({ user_id: id, email }, process.env.TOKEN_KEY, {
        expiresIn: '2h',
      });

      const tokenQuery = {
        text: 'UPDATE users SET token = ($1) WHERE id = ($2)',
        values: [token, id],
      };
  
      await client.query(tokenQuery);

      res.status(200).json({message: `User *${user.rows[0].first_name} ${user.rows[0].last_name}* logged-in successfully`});
    }else{
      res.status(400).send("Invalid Credentials");
    }
    
  } catch (err) {
    console.log(err);
  }
}

export default LoginController;
