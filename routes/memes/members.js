// All API routes (/memes)

//Imports

const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Get the last (most recent) 100 memes

router.get('/', async(req, res) => {
  try{
  const lastMemes = await pool.query("SELECT * FROM (SELECT * FROM memes_table ORDER BY id DESC LIMIT 100)Var1 ORDER BY id ASC");
  const lastMemesRow = lastMemes.rows;
  res.json(lastMemesRow);
  }catch(err){
    console.log(err.message);
  }
});

// Get Single Meme with a specific id

router.get('/:id', async(req, res) => {
  const id = req.params.id;
  try{
    const meme = await pool.query("SELECT * FROM memes_table WHERE id = $1", [id]);
    if(meme.rows[0]){
      res.json(meme.rows[0]);
    }
    else res.status(404).json({msg: `No member was found with the id ${id} `});
  }catch(err){
    console.log(err.message);
  }
});

// Post a new meme (API)

router.post('/', async(req, res) => {
  //check to see if both name and url is provided
  if (!req.body.name || !req.body.url) {
    return res.status(404).json({ msg: 'Please include both name and email' });
  }
  //check to see if it is not a duplicate POST request
  const name = req.body.name;
  const url = req.body.url;
  const check = await pool.query("SELECT * FROM memes_table WHERE name = $1 AND url = $2", [name, url]);
  if(check.rows[0]) return res.status(409).json("Meme already exists!");
  try{
  const caption = req.body.caption;
  const newMeme= await pool.query("INSERT INTO memes_table(name,url,caption) VALUES ($1, $2, $3) RETURNING *", [name, url, caption]);
  res.json({"id":newMeme.rows[0].id});
  }catch(err){
    console.log(err.message);
  }
  });


// Update Member

router.patch('/:id', async(req, res) => {
  const id = req.params.id;
  const newcaption = req.body.caption;
  const newurl = req.body.url;
  try{
    const updatedMeme = await pool.query("UPDATE memes_table SET url = $1, caption = $2 WHERE id = $3 RETURNING *", [newurl, newcaption, id]);
    if(updatedMeme.rows[0]) 
    {
      return res.status(200).json(`Meme with the id ${id} updated sucessfully`);
    }
    else return res.status(404).json({msg: `No member was found with the id ${id} `});
  }catch(err) {
    res.status(404);
    console.log(err.message);
  }
});

// Delete Member

router.delete('/:id', async(req, res) => {
  try{
    const id = req.params.id;
    const check = await pool.query("SELECT * FROM memes_table WHERE id = $1", [id]);
    if(check.rows[0]){
    const meme = await pool.query("DELETE FROM memes_table WHERE id = $1",[id]);
    res.json(`Meme with the id: ${id} was sucessfully deleted`);
    }else{
      res.json(`No meme present with the id: ${id}`);
    }
  }catch(err){
    console.log(err.message);
  }
  });

module.exports = router;
