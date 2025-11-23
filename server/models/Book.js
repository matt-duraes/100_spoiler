const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Autor não informado'
  },
  cover: {
    type: DataTypes.TEXT, // Using TEXT for base64 strings
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('to-read', 'read'),
    defaultValue: 'to-read'
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  },
  addedAt: {
    type: DataTypes.STRING,
    defaultValue: () => new Date().toLocaleDateString('pt-BR')
  }
});

module.exports = Book;
