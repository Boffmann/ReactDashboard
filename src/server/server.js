"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var coronaRoutes = require('./routes/corona');
var app = express_1["default"]();
var port = process.env.PORT || 5000;
app.get('/api/hello', function (req, res) {
    res.send({ express: "Hello World" });
});
app.use('/api/corona', coronaRoutes);
app.post('/api/world', function (req, res) {
    console.log(req.body);
    res.send('I received a post. This is what you send: ${req.body.post}');
});
app.listen(port, function () { return console.log('Listening on port ${port}'); });
