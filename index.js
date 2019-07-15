const fs = require('fs');
const utf8 = require('utf8');
const admin = require("firebase-admin");
const serviceAccount = require("./conf/admin.json");
const dbURL = require('./conf/db.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: dbURL
});

const db = admin.firestore();

// let data = require('./R/pkmn_dataset.json')
let data = require('./R/test.json')


console.log(data)
// let docRef = db.collection('pkmns')
// data.forEach( (item, index)=> {
// 	docRef.doc(item.name).set(item)
// 	console.log(index + 1)
// })
