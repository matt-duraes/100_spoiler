const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('./database');
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
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let friendCode;
    let isUnique = false;
    while (!isUnique) {
      friendCode = generateFriendCode();
      const existing = await prisma.user.findUnique({ where: { friendCode } });
      if (!existing) isUnique = true;
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, friendCode }
    });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Erro ao criar usuário. Tente novamente.' });
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
    const user = await prisma.user.findUnique({ where: { email } });
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login. Tente novamente.' });
  }
});

// Friend Routes
router.post('/friends/add', authenticateToken, async (req, res) => {
  try {
    const { friendCode } = req.body;
    const friend = await prisma.user.findUnique({ where: { friendCode } });
    
    if (!friend) return res.status(404).json({ error: 'Usuário não encontrado com este código' });
    if (friend.id === req.user.id) return res.status(400).json({ error: 'Você não pode adicionar a si mesmo' });

    // Add friend (bidirectional or unidirectional depending on logic, assuming uni for now based on 'addFriend')
    // Prisma many-to-many requires connecting
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        friends: {
          connect: { id: friend.id }
        }
      }
    });
    
    res.json({ message: 'Amigo adicionado com sucesso', friend: { id: friend.id, name: friend.name } });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ error: 'Erro ao adicionar amigo. Tente novamente.' });
  }
});

router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        friends: {
          select: { id: true, name: true, friendCode: true }
        }
      }
    });
    res.json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Erro ao buscar amigos. Tente novamente.' });
  }
});

router.get('/users/:id/books', authenticateToken, async (req, res) => {
  try {
    // Check if they are friends
    // Check if they are friends
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        friends: {
          where: { id: parseInt(req.params.id) }
        }
      }
    });
    
    if (!user || user.friends.length === 0) {
      return res.status(403).json({ error: 'Você precisa ser amigo para ver os livros' });
    }

    const books = await prisma.book.findMany({ where: { userId: parseInt(req.params.id) } });
    res.json(books);
  } catch (error) {
    console.error('Get friend books error:', error);
    res.status(500).json({ error: 'Erro ao buscar livros do amigo. Tente novamente.' });
  }
});

// Book Routes
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await prisma.book.findMany({ where: { userId: req.user.id } });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Erro ao buscar livros. Tente novamente.' });
  }
});

router.post('/books', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.create({
      data: { ...req.body, userId: req.user.id }
    });
    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Erro ao criar livro. Tente novamente.' });
  }
});

router.put('/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updatedBook);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Erro ao atualizar livro. Tente novamente.' });
  }
});

router.delete('/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await prisma.book.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    
    await prisma.book.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Livro excluído' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Erro ao excluir livro. Tente novamente.' });
  }
});

module.exports = router;
