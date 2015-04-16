var http = require('http'); //importing http

var options = {
    host: 'air-quality-api.herokuapp.com',
    port: 80,
    path: '/health'
};
console.log("======Checking health ...");
http.get(options, function(res) {
    res.on('data', function(chunk) {
        try {
            // optional logging... disable after it's working
            console.log("======Checking health : HEROKU RESPONSE: " + chunk);
        } catch (err) {
            console.log(err.message);
        }
    });
}).on('error', function(err) {
    console.log("Error: " + err.message);
});
