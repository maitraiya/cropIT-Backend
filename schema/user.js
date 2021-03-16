  const mongoose = require('mongoose');
  const jwt = require('jsonwebtoken');
  const config = require('config');

  const userSchema = new mongoose.Schema({
      name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
      },
      email: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 250,
          unique: true
      },
      password: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 1000,
      },
      phone: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 10
      },
      address: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 1000
      },
      city: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50
      },
      adhaar: {
          type: String,
          required: true,
          minlength: 12,
          maxlength: 12,
          unique: true
      },
      userType: {
          type: String,
          required: true
      },
      profile: {
        type: String
    }
  });

  const user = mongoose.model("user", userSchema)
  module.exports.user = user;