import express, { Application, Request, Response, NextFunction } from 'express'
import fs, { link } from 'fs'
import https from 'https'
import session from 'express-session'
import api from './api'
import link_router from './link-router'

let app: Application = express();

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 1000 * 60 * 30 } // maxAge => 30 minutes
}));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => { 
  console.log("%s %s\n%s", req.method, req.url, JSON.stringify(req.body)); 
  next(); 
});

app.set('views', './static');
app.set('view engine', 'pug');

app.use(express.static('./static'));

app.use('/redirect', (req, res) => {  
  res.send(req.session!.url);
});

app.use('/api', api);

app.use(link_router);

const key: Buffer = fs.readFileSync('./secure/private.key');
const cert: Buffer = fs.readFileSync('./secure/cert.crt');

const options: https.ServerOptions = { key, cert };
const port: String = process.env.PORT || '8080';
https.createServer(options, app).listen(port);
console.log("listening on port " + port);
