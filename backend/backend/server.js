const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(cors());
app.use(express.json());


const adapter = new FileSync('db.json');
const db = low(adapter);


db.defaults({ movies: [] }).write();
console.log('✅ База данных готова (файл db.json)');


app.get('/api/movies', (req, res) => {
  const movies = db.get('movies').value();
  res.json(movies);
});


app.post('/api/movies', (req, res) => {
  const { title, genre, rating } = req.body;
  const newMovie = {
    id: Date.now(),
    title,
    genre: genre || 'Другое',
    rating: rating || 0,
    status: 'want_to_watch',
    createdAt: new Date().toISOString()
  };
  db.get('movies').push(newMovie).write();
  res.json(newMovie);
});


app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.get('movies').find({ id: Number(id) }).assign({ status }).write();
  res.json({ message: 'Статус обновлён' });
});


app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  db.get('movies').remove({ id: Number(id) }).write();
  res.json({ message: 'Удалено' });
});

app.listen(5000, () => console.log('🚀 Сервер на порту 5000'));