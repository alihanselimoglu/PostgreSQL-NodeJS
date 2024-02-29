import express from 'express';

import postgresClient from '../config/db.js';

const router = express.Router();

//create user
router.post('/', async (req, res) => {
  try {
    const text =
      "INSERT INTO users (email, password, fullname) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING *";

      const values = [req.body.email, req.body.password, req.body.fullname];

      const { rows } = await postgresClient.query(text, values);

        return res.status(201).json({createdUser: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});


// Authenticate user
router.post('/login', async (req, res) => {
  try {
    const text = 'SELECT * FROM users WHERE email = $1 AND password = crypt($2, password)';

    const values = [req.body.email, req.body.password];

    const { rows } = await postgresClient.query(text, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({message: 'User logged in successfully', user: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

// update user
router.put('/update/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const text =
      "UPDATE users SET email = $1, fullname = $2 WHERE id = $3 RETURNING *";

    const values = [req.body.email, req.body.fullname, userId];

    const { rows } = await postgresClient.query(text, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({updatedUser: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

// delete user
router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const text = 'DELETE FROM users WHERE id = $1 RETURNING *';

    const values = [userId];

    const { rows } = await postgresClient.query(text, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({deletedUser: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

// get all users
router.get('/', async (req, res) => {
  try {
    const text = 'SELECT * FROM users ORDER BY id ASC';

    const { rows } = await postgresClient.query(text);

    return res.status(200).json({users: rows});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

// get user by id
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const text = 'SELECT * FROM users WHERE id = $1';

    const values = [userId];

    const { rows } = await postgresClient.query(text, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({user: rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

export default router;
