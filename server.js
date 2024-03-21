const express = require('express');
const mongoose = require('mongoose');
routes = require('./routes/api')
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('debug', true);

app.use(routes);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));