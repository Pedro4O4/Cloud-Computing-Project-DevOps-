// Backend entry point
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mini-Jira API running on port ${PORT}`);
});
