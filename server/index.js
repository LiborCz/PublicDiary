const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const helmet = require('helmet') // creates headers that protect from attacks (security)
const cors = require('cors')  // allows/disallows cross-site communication
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000/', 'http://localhost:8080/', 'https://public-diary.herokuapp.com', 'http://publicdiary.website']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(helmet())
app.use(cors(corsOptions))

app.get('/api/', (req, res) => {
  res.send({ people: 'You want to see people I assume' });
});

app.post('/api/', (req, res) => {
  res.send( `Person created: ${req.body.person.name}`);
});


if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../client/build')));

  console.log("dirname: " + __dirname);

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8080
app.listen(PORT, (req, res) => { console.log(`server listening on port: ${PORT}`) });
