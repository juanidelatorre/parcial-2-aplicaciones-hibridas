const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
res.send('Servidor backend funcionando');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));