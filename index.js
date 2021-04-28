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
//this 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

client.connect(err => {
    const portfolioCollection = client.db("Portfolio_Database").collection("PortfolioList");
    const skillsCollection = client.db("Portfolio_Database").collection("skillList");
    // perform actions on the collection object

    //post portfolio
    app.post('/create-portfolio', (req, res) => {
        const portfolio = req.body;
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

    // delete portfolio from database
    app.delete('/portfolio-delete', (req, res) => {
        portfolioCollection.deleteOne({ _id: ObjectId(req.query.id) })
            .then(result => {
                res.send(result)
            })
    })

    //add skills
    app.post('/add-skill', (req, res) => {
        const skillData = req.body;
        console.log('skillData :>> ', skillData);
        skillsCollection.insertOne(skillData)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    //get skills list data
    app.get('/skill-list', (req, res) => {
        skillsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // delete skill from database
    app.delete('/skill-delete', (req, res) => {
        skillsCollection.deleteOne({ _id: ObjectId(req.query.id) })
            .then(result => {
                res.send(result)
            })
    })

    // load single event
    app.get('/skill/:id', (req, res) => {
        skillsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    //update skills
    app.patch('/update-skill', (req, res) => {
        skillsCollection.updateOne({ _id: ObjectId(req.query.id) }, {
            $set: { technology: req.body.technology, expertise_level: req.body.expertise_level, tech_logo: req.body.tech_logo, tech_logoPreview: req.body.tech_logoPreview }
        })
            .then(result => {
                res.send(result)
            })
    })
    //close  collection
    console.log('Database connected');
    // client.close();
});

app.get('/', (req, res) => {
    res.send("Hello I am working");
})
app.listen(process.env.PORT || port)