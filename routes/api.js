const router = require('express').Router();
const { User, Thought } = require('../models/model');


// Users routes
// GET route to fetch all users
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

// GET route to fetch a user by ID
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

// POST route to create a new user
router.post('/api/users', ({ body }, res) => {
  User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
});

// PUT route to update a user by ID
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

// DELETE route to delete a user by ID
router.delete('/api/users/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});



//Thoughts routes
// GET route to fetch all thoughts
router.get('/api/thoughts', (req, res) => {
  Thought.find({})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
});

// GET route to fetch all thoughts of a specific user
router.get('/api/users/:username/thoughts', (req, res) => {
  Thought.find({ username: req.params.username })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));

// POST route to create a new thought
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

});

// PUT route to update a thought by ID
router.put('/api/thoughts/:id', (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
});


// DELETE route to delete a thought by ID
router.delete('/api/thoughts/:id', (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
});


//! Friends routes
// POST route to add a friend to a user's friend list
router.post('/api/users/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
});

// DELETE route to remove a friend from a user's friend list
router.delete('/api/users/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
});
module.exports = router;