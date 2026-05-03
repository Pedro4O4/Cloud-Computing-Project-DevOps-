// Express app setup — middleware, routes, error handling
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/tasks', require('./routes/task.routes'));
// app.use('/api/projects', require('./routes/project.routes'));
// app.use('/api/teams', require('./routes/team.routes'));
// app.use('/api/users', require('./routes/user.routes'));

module.exports = app;
