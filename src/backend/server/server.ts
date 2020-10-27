import express from 'express';
var coronaRoutes = require('./routes/corona');

const app: express.Application = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
    res.send({express: "Hello World"})
});

app.use('/api/corona', coronaRoutes)

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received a post. This is what you send: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
