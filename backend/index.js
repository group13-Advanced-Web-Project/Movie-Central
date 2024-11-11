import express from 'express';
import cors from 'cors';

const port = 3001;

const app = express();
app.use(cors());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
})

app.listen(port);