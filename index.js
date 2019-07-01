const axios = require('axios')

const admin = require('firebase-admin');
const serviceAccount = require("./pokedex-50ff4-firebase-adminsdk-xo9lm-79e47b1da7.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pokedex-50ff4.firebaseio.com"
});

const db = admin.firestore();


let pkmns = []
let start = 159
let end   = 159

const save_document = (data)=> {
	let docRef = db.collection('pkmns').doc(data.name)
	docRef.set(data)
}

const get_pkmn = (id)=> {

	if( start <= end ) {
		let url = "https://pokeapi.co/api/v2/pokemon/" + id

		axios.get(url)
		.then( (response)=> {
			let res = response.data

			// Sprite
			let sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png"

			// Types
			let types = []
			res.types.forEach( (item)=> {
				types.push(item.type.name)
			})
			types.reverse()

			// Stats
			let stats = {
				speed 			: res.stats[0].base_stat,
				special_defense : res.stats[1].base_stat,
				special_attack  : res.stats[2].base_stat,
				defense 		: res.stats[3].base_stat,
				attack 			: res.stats[4].base_stat,
				hp 				: res.stats[5].base_stat,
			}

			// Abilities
			let abilities = {  primary: null, secondary: null, hidden: null }
			res.abilities.forEach( (item)=> {
				if( item.slot === 1 ) {
					abilities.primary = item.ability.name
				} else if ( item.slot === 2 ) {
					abilities.secondary = item.ability.name
				} else {
					abilities.hidden = item.ability.name
				}
			})

			let data = {
				name: res.name,
				id: res.id,
				weight: res.weight / 10,
				height: res.height / 10,
				sprite,
				types,
				stats,
				abilities
			}
			
			save_document(data)

		})
		.catch( (error)=> {
			console.log(error)
		})
		.then( ()=> {
			console.log(start)
			start += 1
			setTimeout( ()=>{
				get_pkmn(start)
			}, 2000)
		})

	}
}

get_pkmn(start)
