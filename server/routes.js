const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const Book = require('./models/Book');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Helper to generate 6-digit code
const generateFriendCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Auth Routes
router.post('/auth/register', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let friendCode;
    let isUnique = false;
    while (!isUnique) {
      friendCode = generateFriendCode();
      const existing = await User.findOne({ where: { friendCode } });
      if (!existing) isUnique = true;
    }

    const user = await User.create({ name, email, password: hashedPassword, friendCode });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        friendCode: user.friendCode 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Friend Routes
router.post('/friends/add', authenticateToken, async (req, res) => {
  try {
    const { friendCode } = req.body;
    const friend = await User.findOne({ where: { friendCode } });
    
    if (!friend) return res.status(404).json({ error: 'Usuário não encontrado com este código' });
    if (friend.id === req.user.id) return res.status(400).json({ error: 'Você não pode adicionar a si mesmo' });

    const user = await User.findByPk(req.user.id);
    await user.addFriend(friend);
    
    res.json({ message: 'Amigo adicionado com sucesso', friend: { id: friend.id, name: friend.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: User,
        as: 'Friends',
        attributes: ['id', 'name', 'friendCode']
      }
    });
    res.json(user.Friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:id/books', authenticateToken, async (req, res) => {
  try {
    // Check if they are friends
    const user = await User.findByPk(req.user.id);
    const friends = await user.getFriends({ where: { id: req.params.id } });
    
    if (friends.length === 0) {
      return res.status(403).json({ error: 'Você precisa ser amigo para ver os livros' });
    }

    const books = await Book.findAll({ where: { UserId: req.params.id } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book Routes
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await Book.findAll({ where: { UserId: req.user.id } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/books', authenticateToken, async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    
    await book.update(req.body);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    
    await book.destroy();
    res.json({ message: 'Livro excluído' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
