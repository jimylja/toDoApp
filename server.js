const app = require('./backend/app');

const server = app.listen(process.env.PORT || 3000, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});
