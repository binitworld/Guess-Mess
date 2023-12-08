const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = 3000;
app.use(cors());

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 


const databaseUrl = 'mongodb+srv://admin:admin@cluster0.xstrq1b.mongodb.net/guessmess?retryWrites=true&w=majority';

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});



const storage = multer.diskStorage({
  destination: 'public/img', 
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


const itemSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
});

const Item = mongoose.model('genres', itemSchema);

app.get('/', (req, res) => {
  res.send("hello ");
})


app.post('/upload', upload.single('image'), async (req, res) => {
  try {

    const name = req.body.name;
    
    const imagePath = req.file.path;
    console.log("hello", imagePath);
    
    const newItem = new Item({
      name: name,
      imagePath: imagePath,
    });

    
    await newItem.save();

    res.status(200).json({ message: 'Item saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/fetchWord', async (req, res) => {
  try {
    const items = await Item.find();
    const randomItem = items[Math.floor(Math.random() * items.length)];
    res.json({ name: randomItem.name, imagePath: randomItem.imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


