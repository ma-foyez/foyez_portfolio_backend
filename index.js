const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 4200;
// const fs = require('fs-extra');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.my6tz.mongodb.net/Portfolio_Database?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// app.use(bodyParser.json());
app.use(cors());
//===
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

client.connect(err => {
    const portfolioCollection = client.db("Portfolio_Database").collection("PortfolioList");
    // perform actions on the collection object

    //post portfolio
    app.post('/create-portfolio', (req, res) => {
        const portfolio = req.body;
        console.log('portfolio :>> ', portfolio);
        portfolioCollection.insertOne(portfolio)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    //load portfolio data
    app.get('/portfolio-list', (req, res) => {
        portfolioCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //close portfolio collection
    console.log('Database connected');
    // client.close();
});

app.get('/', (req, res) => {
    res.send("Hello I am working");
})
app.listen(process.env.PORT || port)