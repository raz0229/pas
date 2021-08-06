const express = require('express');
const sslRedirect = require('heroku-ssl-redirect').default;
const app = express();
const path = require('path');

const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(sslRedirect()) // enable ssl redirect

app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => 
console.log(`Server is running on: http://localhost:${port}`));