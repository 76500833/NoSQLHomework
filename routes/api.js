const router = require('express').Router();
const { User, Thought } = require('../models/model');

router.get('/api/users', (req, res) => {
  User.find({})
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get('/api/users/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.post('/api/users', ({ body }, res) => {
  User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
});

router.put('/api/users/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
});

router.delete('/api/users/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});

router.post('/api/thoughts', (req, res) => {
  Thought.create(req.body)
    .then(({ _id, username }) => {
      return User.findOneAndUpdate(
        { username },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});

//route to get all thoughts
router.get('/api/thoughts', (req, res) => {
  Thought.find({})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
});

//get a specific users thoughts
router.get('/api/users/:username/thoughts', (req, res) => {
  Thought.find({ username: req.params.username })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
});
module.exports = router;