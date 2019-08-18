// Entry point to the back end
const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({ msg: 'Welcome to Bank of Dad!' }));

// Define routes
app.use('/parents', require('./routes/parents'));
app.use('/auth', require('./routes/auth'));
app.use('/kids', require('./routes/kids'));
app.use('/trxns', require('./routes/trxns'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
