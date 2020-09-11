var express = require('express');
var router = express();
var utils = require("../utils");
var fs = require( 'fs' );
var readline = require('readline')
var _ = require("lodash");
var w2v = require('word2vector');

console.time("read");
w2v.load(utils.GOOGLE_BIN);
console.timeEnd("read");

var sentences = []
readline.createInterface({
  input: fs.createReadStream('./wikisent2.txt'),
  terminal: false
}).on('line', function(line) {
  if (line.length > 15 && line.length <100) {
    sentences.push(line)
  }
});

/*
var sentences = fs.readFileSync('./wikisent2.txt').toString()
sentences = sentences.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split("|")

sentences = sentences.filter(sen => {
  if (sen.length < 15 || sen.length > 100) {
    return false;
  } else {
    return true;
  }
})
*/

router.get('/',function(req, res){
  res.json([
    "/similarWords/:q",
    "/vectors/:qs",
    "/neighbors/:q",
    "/similarity/:q1/:q2",
    "/randsent"
  ]);
})

router.get('/similarWords/:q',function(req, res){
  res.json(w2v.getSimilarWords( req.params.q ));
})
router.get('/vectors/:qs',function(req, res){
  res.json(w2v.getVectors( req.params.qs.split(',') ));
})
router.get('/neighbors/:q',function(req, res){
  res.json(w2v.getNeighbors( w2v.getVector( req.params.q ) ));
})
router.post('/neighborsvector/', function(req,res){
  res.json(w2v.getNeighbors( req.body.vector ));
})
router.get('/similarity/:q1/:q2',function(req, res){
  res.json(w2v.similarity(req.params.q1, req.params.q2));
})
router.get('/randsent', function(req, res){
  var rand = Math.floor(Math.random() * sentences.length)
  res.json(sentences[rand].replace(/([.?!\n\t])/g,''));
})

module.exports = router;
