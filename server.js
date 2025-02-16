const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create acc.json if not exists
if (!fs.existsSync('acc.json')) {
    fs.writeFileSync('acc.json', '[]');
}

// Registration endpoint
app.post('/register', (req, res) => {
    const newUser = req.body;
    
    fs.readFile('acc.json', 'utf8', (err, data) => {
        try {
            const users = JSON.parse(data || '[]');
            
            if (users.some(u => u.email === newUser.email)) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            users.push(newUser);
            
            fs.writeFile('acc.json', JSON.stringify(users), (err) => {
                if (err) throw err;
                res.json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    fs.readFile('acc.json', 'utf8', (err, data) => {
        try {
            const users = JSON.parse(data || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});