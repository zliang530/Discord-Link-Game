const express = require('express')
const ejs = require('ejs')
const leaderboard = require('./routes/leaderboard');
const api = require('./routes/api');
const rateLimit = require('express-rate-limit')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const port = 3000

const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 15 minutes
	max: 720,
  message: "Too many request, try again later :("
})

app.use(apiLimiter)

setInterval(function(){
  let db = new sqlite3.Database('db/dlg.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  db.run(`delete from leaderboard`, (err)=>{
    if (err) {
      return console.log(err.message);
    }
  })
  db.close();
}, 86400000); 

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use('/leaderboard', leaderboard)
app.use('/api', api)

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.set('port', process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`app listening on port ${port}`) 
})