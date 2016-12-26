var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var path = require('path');
var requestify = require('requestify');
var assert = require('assert');
var colors = require('colors');

var port = process.env.PORT || 3000;
var initStr = "hello";
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(bodyParser.json());

router.use(function(req, res, next) {
    console.log("\nClient Connecting\n...".yellow);
    next(); // w/o this we'd be stuck in this router forevs.
});

router.get('/', function(req, res) {
    res.json({
        message: initStr
    });
});

router.route('/meetup/:url').get(function(req,res) {
    var query = "https://api.meetup.com/" + req.params.url + "/events?photo-host=public&page=20&sig_id=197582927&sig=c5891d6697925adbf58ab4a075bc32672b023231&key=77b21577617574d425111110460";
    requestify.get(query).then(function(response) {
        var data = (response.getBody());
        res.json({
            events: data
        })
    })
})

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/api', router);
app.listen(port, function() {
 	console.log("Started")
});