const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const pool = require('./db');
const app = express();
// Init middleware

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage Route
app.get('/', async(req, res) =>{
  const allMemes = await pool.query("SELECT * FROM memes_table LIMIT 100");
  const allMemesRows = allMemes.rows;
  allMemesRows.sort((a, b)=> 
  {return b.id - a.id;})
  res.render('index', {
    title: 'Meme Stream',
    memesList: allMemesRows
    })
  }
);

// Create Member
app.post('/', async(req, res) => {
  if (!req.body.name || !req.body.url) {
    return res.status(404).json({ msg: 'Please include a name and email' });
  }

  //check to see if it is not a duplicate POST request
  const name = req.body.name;
  const url = req.body.url;
  const check = await pool.query("SELECT * FROM memes_table WHERE name = $1 AND url = $2", [name, url]);
  if(check.rows[0]) return res.status(409).json("Meme already exists!");
  
  const caption = req.body.caption;
  const newMeme= await pool.query("INSERT INTO memes_table(name,url,caption) VALUES ($1, $2, $3) RETURNING *", [name, url, caption]);

  res.redirect('/');
});
// Set static folder
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'public')));
}
app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/memes', require('./routes/memes/members'));
//Handle any other undefined routes 
app.get("*", (req,res)=>{
  res.redirect("/");
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));