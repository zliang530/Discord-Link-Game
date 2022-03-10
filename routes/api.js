const express = require('express')
const router = express.Router();

// generates a random link from 7-8 characters long
function _generateLink(){

    var caps = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    var lower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    var num = ['0','1','2','3','4','5','6','7','8','9',]

    var charCount = Math.round(Math.random() * (8 - 7) + 7)
    var selectChar; 
    var link = "";
    for (var i=0; i<charCount; i++){
        
        selectChar = Math.round(Math.random() * (3 - 1) + 1)

        if (selectChar === 1){
            let charIndex = Math.round(Math.random() * (25))
            link += caps[charIndex]
        }
        else if (selectChar === 2){
            let charIndex = Math.round(Math.random() * (25))
            link += lower[charIndex]
        }
        else{
            let charIndex = Math.round(Math.random() * (9))
            link += num[charIndex]
        }
    }
    return link
}

// generates an object of 10 links
function generateLink(){
    var links = {}
    for (var i=0; i<10; i++){
        let key = (i+1).toString()
        links[key] = _generateLink();
    }
    return links
}

router.get('/:numOflinks', (req, res) =>{
    const n = req.params.numOflinks;

    res.json(generateLink())
})

module.exports = router;