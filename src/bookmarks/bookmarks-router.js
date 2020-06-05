const express = require('express');
const bookmarks = require('../store');
const logger = require('../logger');
const { v4: uuid } = require('uuid');
const { isWebUri } = require('valid-url');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, desc='', rating=0 } = req.body;

    if(!title) {
      logger.error(`Title is required`);
      return res 
        .status(400)
        .send('Invalid data')
    }
    if(!url) {
      logger.error(`Url is required`);
      return res
        .status(400)
        .send('Invalid data')
    }
    if(typeof url !== 'string' || url.length <= 0 || !isWebUri(url)) {
      logger.error('Url is not valid');
      return res
        .status(400)
        .send('Invalid data')
    }
    if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating ${rating}`)
      return res
        .status(400)
        .send('Rating must be a number between 1 and 5')
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    }

    bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/list/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
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
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(book => book.id == id);

    if(bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);
    res
      .status(204)
      .end();
  })



module.exports = bookmarkRouter;