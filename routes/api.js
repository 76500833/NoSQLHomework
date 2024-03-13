const router = require('express').Router();
const { User, Thought } = require('../../models');

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

module.exports = router;