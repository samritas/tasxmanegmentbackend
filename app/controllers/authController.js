const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Connection = require('../config/connection');

const JWT_SECRET = 'your_jwt_secret_key';

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = Connection.pool; // Access the pool property of Connection object

        // Check if username already exists
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = Connection.pool; // Access the pool property of Connection object

        // Check if user exists
        const [user] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0 || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user[0].id, username: user[0].username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
