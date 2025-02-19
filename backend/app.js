const express = require('express');
const bodyParser = require('body-parser');
const mongooes = require('mongoose');

mongooes.connect('mongodb+srv://tejasriram:tejasriram@spa-pro-gno71.mongodb.net/AngularData?retryWrites=true&w=majority')
  .then(() => {
    console.log('database is connected');
  })

  .catch(() => {
    console.log('connection failed');
  });

const Post = require('./models/post');

const app = express();

// bodyParser implementation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

// post the data
app.post('/api/posts',(req,res,next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  // console.log(post);
  // res.status(201).json({
  //   message: 'post is successfully added'
  });
});

app.get('/api/posts',(req,res,next) =>{

  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'message is sussesfully uploaded',
      post: documents
    });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
