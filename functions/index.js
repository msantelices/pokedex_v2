const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.getpkmn = functions.https.onRequest((req, res) => {
	const db = admin.firestore();

	let pkmn = req.query.name
	let docRef = db.collection('pkmns').doc(pkmn)

	let getDoc = docRef.get()
		.then( (doc)=> {
			if(!doc.exists) {
				res.send('No such pkmn');
			} else {
				res.json( doc.data() );
			}
		})
    	.catch(err => {
      		res.send('Error getting pkmn', err);
    });
})