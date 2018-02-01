const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bookInsert = require('../database/bookInsertion');
const viewInsert = require('../database/viewInsertion');

//send to queues
const addToBookingQueue = require('./book_queue/sqs_sendmessage');
const addToViewQueue = require('./view_queue/sqs_sendmessage');
// const addToViewQueue;

app.use(bodyParser.json());

const PORT = 3000;
const HOST = '54.67.38.89';

app.get('/', (req, res) => res.send('Event Handler'));

app.post('/pageview', (req, res) => {
  if (req.body.viewId && req.body.hostId) {
    viewInsert(req.body.viewId, req.body.hostId);    
    //send message to queue
    res.status(200).send('Sent to queue');    
  } else {
    res.status(400).send('Send to queue failed');
  }

});

app.post('/booking', (req, res) => {
  if (req.body.bookId && req.body.hostId) {
    addToBookingQueue(req.body.viewId, req.body.hostId);
    res.status(200).send('Sent to queue');
  } else {
    res.status(400).send('Send to queue failed');
  }
});

app.listen(PORT, () => console.log(`Example app listening on ${PORT}`));

module.exports = app;