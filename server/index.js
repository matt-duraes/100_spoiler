require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./database');
const User = require('./models/User');
const Book = require('./models/Book');
const Friendship = require('./models/Friendship');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : '*';

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Associations
User.hasMany(Book);
Book.belongsTo(User);

User.belongsToMany(User, { as: 'Friends', through: Friendship, foreignKey: 'userId', otherKey: 'friendId' });

// Routes
app.use('/api', routes);

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
