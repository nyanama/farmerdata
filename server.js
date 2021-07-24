const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

// ========================
// Link to Database
// ========================
// Updates environment variables
// @see https://zellwk.com/blog/environment-variables/
require('./dotenv')

// Replace process.env.DB_URL with your actual connection string
const connectionString = process.env.DB_URL

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('farmers-data-db')
    const quotesCollection = db.collection('farmers')
	quotesCollection.createIndex( { "phone": 1 }, { unique: true } )

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('farmers').find().toArray()
        .then(farmers => {
          res.render('index.ejs', { farmers: farmers, errormessage:'' })
        })
        .catch(/* ... */)
    })
	
	app.get('/farmer', (req, res) => {
      db.collection('farmers').findOne({phone: req.query.phone })
        .then(farmers => { 
		  if(farmers != null)
			res.render('index.ejs', { farmers: [farmers], errormessage:'' })
		  else{
		   db.collection('farmers').find().toArray()
        .then(farmers => {
          res.render('index.ejs', { farmers: farmers, errormessage:'no search found for the given input' })
        })
		  }
        })
        .catch(/* ... */)
    })

    app.post('/farmers', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => {
		//alert('error occured');
		res.redirect('/')
		})
    })

    app.put('/farmers', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { phone: req.body.phone },
        {
          $set: {
            name: req.body.name,
            phone: req.body.phone,
			address: req.body.address,
            landowner: req.body.landowner
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/farmers', (req, res) => {
      quotesCollection.deleteOne(
        { phone: req.body.phone }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(process.env.PORT || 5000, '0.0.0.0', function () {
      console.log(`listening on ${process.env.PORT}`)
    })
  })
  .catch(console.error)
