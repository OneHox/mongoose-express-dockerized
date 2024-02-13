const express = require("express");
const mongoose = require('mongoose');
const { User } = require('./models/user');
const { Post } = require('./models/post');
const { spawn } = require('child_process');

const app = express();

app.get("/create", async (req, res) => {
  try {
    // Create a new user
    const newUser = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      age: 25,
    });

    // Create a new post linked to the user
    const newPost = await Post.create({
      title: 'My First Post',
      content: 'This is the content of my first post.',
      author: newUser._id,
    });

    // Find the post along with its author
    const foundPost = await Post.findById(newPost._id).populate('author');

    res.json(foundPost);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      spawn('mongod', ['--fork', '--logpath', '/var/log/mongod.log'], {});
      setTimeout(() => resolve(), 1000);
    });
    await mongoose.connect('mongodb://localhost/sample', {});
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("Server Running");
  });
}

start();

