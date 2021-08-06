const express = require('express');
const forceSsl = require('heroku-ssl-redirect');
const app = express();
const path = require('path');

const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(forceSsl()) // enable ssl redirect

app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => 
console.log(`Server is running on: http://localhost:${port}`));