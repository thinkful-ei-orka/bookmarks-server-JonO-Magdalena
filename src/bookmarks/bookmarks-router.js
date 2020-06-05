const express = require('express');
const bookmarks = require('../store');
const logger = require('../logger');

const bookmarkRouter = express.Router();

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post((req, res) => {
    
  });

bookmarkRouter.get('/bookmarks/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const bookmark = bookmarks.find(book => book.id == id);

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Bookmark not found');
  }

  res.json(bookmark);
});



module.exports = bookmarkRouter;