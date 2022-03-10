const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');

// open database in memory
let db = new sqlite3.Database('db/dlg.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

router.get('/', (req, res) =>{
  res.render('leaderboard.ejs');
})

router.get('/:num' , (req, res) => {
  
  db.all(`select name, time from leaderboard
          order by time asc
          limit 10`,
          function(err, row){
            if (err) {
              throw err;
            }
            res.status(200).send(row)
          });
})

router.post('/', 
    body('name').trim(),
    body('name').customSanitizer(value => {
      if (value.length === 0){
        return "Anonymous"
      }
      return value.replace(/\s+/g, ' ')
    }),
    body('time').custom(value =>{
      if (/\d\d : \d\d : \d\d\d/g.test(value)){
        return true;
      }
      return false;
    }).withMessage("Not in the correct time format"),
    body('time').customSanitizer(value => {
      return value.replace(/\s/g, '').replace(/.(?=\d{3})/, '.')
    }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendStatus(400);
      }
      else{
        db.run(`insert into leaderboard(name, time)
        values(?,?)`, 
        [req.body.name, req.body.time], 
        function(err) {
          if (err) {
            return console.log(err.message);
          }
          res.redirect('/leaderboard')
        });
      }
      
    })

module.exports = router;