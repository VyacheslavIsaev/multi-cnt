const keys  = require('./keys');

// Express App Setup
const express    = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection!'));

const sql = require('./sql');

// Redis Client Setup
const redis = require('redis');
const { values } = require('./sql');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Epress route handlers
app.get('/', (req, res)=>{
    res.send('Hi');
});

app.get('/values/all', async(req, resp)=>{
    pgClient
        .query(sql.create_table)
        .catch(err => console.log(err) );
    const values = await pgClient.query(sql.values);
    resp.send(values.rows);
});

app.get('/values/current', async(req, resp)=>{
    redisClient.hgetall('values', (err, values)=>{
        resp.send(values);
    });
});

app.post('/values', async (req, resp)=>{
    const index = req.body.index;

    if (parseInt(index) > 40){
        return resp.status(422).send('Index to high!');
    }
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);

    pgClient
        .query(sql.create_table)
        .catch(err => console.log(err) );
    pgClient.query(sql.insert, [index]);
    resp.send({working: true});
});

app.listen(5000, err=>{
    console.log('Listening');
});