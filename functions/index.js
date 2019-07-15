const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

app.get('/', (req, res)=> {
	res.send('Working!');
});

app.get('/getpkmn', (req, res)=> {
	let pkmn = req.query.name
	if( pkmn === undefined ) {
		res.send('Error getting pkmn - Invalid request');
	}

	let docRef = db.collection('pkmns').doc(pkmn)

	let getDoc = docRef.get()
		.then( (doc)=> {
			if( !doc.exists ) {
				res.send('No such pkmn');
			} else {
				res.json( doc.data() );
			}
		})
		.catch( err => {
			res.send('Error getting pkmn', err );
		})
});

const api = functions.https.onRequest(app);

module.exports = { api };