import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cluster from 'cluster';
import https from 'https';
import fs from "fs";
import os from 'os';
import ffmpeg from 'ffmpeg';
import morgan from 'morgan';
var compression =  require('compression');

var cacheExpress: any = require('cache-express');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    // log the master
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    // listen for any dying workers'
    cluster.on("exit", function (worker) {
        // replace the dead workers.
        console.log("Worker %d died :(", worker.id)
        cluster.fork();
    })

} else {
    // Workers can share any TCP connection. In this case it is an HTTP server

    // create epress instance
    const app = express();
    // cache

    // var cache = expressRedisCache(); // require redis server
    // Port
    const PORT = 3031;
    // host
    const HOST = "localhost";
    // compress all response except when this 'x-no-compression' specified in the request headers 
    app.use(compression({ filter: shouldCompress }));

    function shouldCompress(req: any, res: any) {
        if (req.headers["x-no-compression"]) {
            // don't compress with this header set
            return false;
        }
        // compress
        return compression.filter(req, res);
    }

    // for parsing application/json
    app.use(express.json());
    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));
    // parse cookies
    app.use(cookieParser());
    // rate limiting
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,  //15mins
        max: 100 // Limit each IP to 100 request per windowMs
    }))

    // monitor with morgan
    app.use(morgan('combined'));
    // monitor with winston
    // const logger:any = winston.createLogger({
    //     level:'info',
    //     format:winston.format.json(),
    //     transports:[new winston.transports.Console()]
    // });
    // app.use(logger);
    // app.use(newrelic.middleware())
    // app.use(prometheus.middleware())

    // apply default cors to the server
    app.use(cors());
    // set view engine
    app.set('view engine', 'ejs');
    // set views
    app.set('views', 'views');

    app.get(
        "/",
        cacheExpress(),
        async (req, res) => {
            try {
                res.render("home", { clusterId: cluster.worker?.id });
            } catch (error) {
                // catch error
                console.warn(error);
            }
        });

    app.get(
        "/api/encrypt",
        cacheExpress(),
        async (req, res) => {
            var encrypt: any = require('encryptjs');
            const plainText = '{nam:"Aliyu"}';
            var encryptData = encrypt.encrypt(plainText, "ali", 256);
            console.log(encryptData);
            var decryptData = encrypt.decrypt(encryptData, "ali", 256);
            console.log(decryptData);

            try {
                res.status(200).json({
                    clusterId: cluster.worker?.id    //encryptData
                });
            } catch (error) {
                // catch error
                console.warn(error);
            }
        });

    app.get("/api/compress", () => {
        try {
            new ffmpeg('./public/images/zakatable-assets-3.mp4', (err, video) => {
                if (!err) {
                    video.setVideoSize('50%', true, true)
                        // .setVideoCodec("libfaac")
                        .save('./')
                } else {
                    console.error(err)
                }

            });
        } catch (error) {
            console.error(error);

        }

    })

    app.get("/api/events", (req, res) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        var data = JSON.stringify({ name: "aliyu" });

        try {
            var timer = setInterval(function () {
                res.write(`data:${data}\n\n`);
            }, 2000);

            res.on("close", function () {
                clearInterval(timer);
            })

        } catch (error) {
            console.error(error);

        }

    })

    // https.createServer({
    //     key: fs.readFileSync("server.key"),
    //     cert: fs.readFileSync("server.cert")
    // }, app)
        // listent to server
        app.listen(PORT, HOST, () => {
            // log to the console
            // console.log("Worker ", process.pid, " handled the request");
            console.log(`The server host is ${HOST} and is listening at port ${PORT}. Worker %d running`, cluster.worker?.id);
        });

    // make app object available to the whole application
    module.exports = app;
}



