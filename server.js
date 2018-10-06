/**
 * Created by yizheng on 2018/10/6.
 */

var express = require('express'),
    app = express(),
    MBTiles = require('@mapbox/mbtiles'),
    fs = require('fs');

var port = 8080;

app.get('/tile/:z/:x/:y.*', function (req, res) {
    console.log('called for ' + req.params.z + '/' + req.params.x + '/' + req.params.y);
    var extention = req.param(0);
    switch (extention) {
        case "mvt":
            var filePath = __dirname + '/lib/tile/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.mvt';
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    //允许跨域
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader('Content-Type', 'text/plain');
                    console.log('err');
                    res.status(404).send('not exist');
                } else {
                    console.log(filePath + 'exists');
                    console.log(data);
                    //允许跨域访问
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader('Content-Type', 'application/x-protobuf');
                    res.send(data);
                }
            });

            break;
        case "pbf":
            var filePath = __dirname + '/lib/tile/test.mbtiles';
            new MBTiles(filePath, function (err, mbtiles) {
                if (err) console.log(err)
                else {
                    mbtiles.getTile(req.params.z, req.params.x, req.params.y, function (err, grid, header) {
                        if (err) {
                            console.log('does not exit ' + req.params.z + '/' + req.params.x + '/' + req.params.y);
                            //允许跨域访问
                            res.setHeader("Access-Control-Allow-Origin", "*");
                            res.header(header);
                            res.status(404).send('Grid rendering error:' + err + '\n');
                        }
                        else {
                            res.header(header);
                            //允许跨域访问
                            res.setHeader("Access-Control-Allow-Origin", "*");
                            res.send(grid);
                        }
                    })
                }
            });
            break;
        default:
            console.log('this type ' + extention + ' does\'t exit');
            break;
    }
});

app.listen(port,function () {
    console.log('Listening on port:' + port);
});
