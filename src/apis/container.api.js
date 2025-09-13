import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'

const moduleName = 'container'


// dummy program
const programs = {
	appgen: {type:'program', name:'generator', title:'Generator', url:'appgen'},
	account: {type:'program', name:'account', title:'Account', icon:'images/iconprograms/mcfly.png'},
	departement: {type:'program', name:'departement', title:'Departemen', icon: 'images/iconprograms/mcfly.png'},
	lokasi: {type:'program', name:'lokasi', title:'Lokasi', icon: 'images/iconprograms/medicine.png'},
	periode: {type:'program', name:'periode', title:'Periode', icon: 'images/iconprograms/mountain.png'},
	jurnal: {type:'program', name:'jurnal', title:'Jurnal Umum', icon: 'images/iconprograms/packman.png', disabled:true},
	payment: {type:'program', name:'payment', title:'Pembayaran', icon: 'images/iconprograms/photo.png'},
	hutang: {type:'program', name:'hutang', title:'Hutang', icon: 'images/iconprograms/pin.png'},
	user: {type:'program', name:'user', title:'User', icon: 'images/iconprograms/pizza.png'},
	group: {type:'program', name:'group', title:'Group', icon: 'images/iconprograms/speakers.png'},
	crud01: {type:'program', name:'crud01', title:'Simple CRUD', icon: 'images/iconprograms/speakers.png', url:'http://localhost:3000/user'},
}


// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)

		// set context dengan data session saat ini
		// this.context = {
		// 	userId: req.session.user.userId,
		// 	userName: req.session.user.userName,
		// 	userFullname: req.session.user.userFullname,
		// 	sid: req.sessionID,
		// 	notifierId: Api.generateNotifierId(moduleName, req.sessionID),
		// 	notifierSocket: req.app.locals.appConfig.notifierSocket,
		// 	notifierServer: req.app.locals.appConfig.notifierServer,
		// }

		
	}

	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await container_init(this, body) }	
}


async function container_init(self, body) {
	console.log('init container')
	

	const req = self.req
	req.session.sid = req.sessionID
	try {
		return {
			title: 'Application',
			userId: req.session.user.userId,
			userName:  req.session.user.userName,
			userFullname: req.session.user.userFullname,
			sid: req.session.sid,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,			
			programs: await getAllProgram(),
			favourites: getUserFavourites()
		}
	} catch (err) {
		throw err
	}
}


function getUserFavourites() {
	try {
		

		return []
	} catch (err) {
		throw err
	}
}

async function getAllProgram() {
	try {
		const programs = []
		const sql = "select directory_id, directory_name, directory_icon from core.directory"
		const result = await db.any(sql)
		for (let row of result) {
			const dir = {
				title: row.directory_name,
				border: false,
				items: []
			}	

			const sql = `
				select 
				A.program_id, A.program_name, A.program_title, A.program_icon,  A.program_parameter,
				B.apps_url
				from 
				core.program A inner join core.apps B on B.apps_id = A.apps_id 
				where 
				A.directory_id  = \${directory_id}		
			`

			const params = {directory_id: row.directory_id}
			const items = await db.any(sql, params)
			for (let item of items) {
				dir.items.push({
 					type:'program', 
					name: item.program_name, 
					title: item.program_title, 
					icon: `${item.apps_url}/${item.program_icon}`, //item.program_icon, 
					url: `${item.apps_url}/${item.program_name}`
				})
			}
			programs.push(dir)
		}

		return programs
	} catch (err) {
		throw err
	}
	
}




	// return [
	// 	programs.appgen,

	// 	{
	// 		title: 'Accounting',
	// 		border: false,
	// 		items: [
	// 			{
	// 				icon: 'images/icon-food.svg',
	// 				title: 'Master data',
	// 				items: [
	// 					programs.account,
	// 					programs.departement,
	// 					programs.lokasi,
	// 					programs.periode
	// 				]
	// 			},
	// 			{
	// 				title: 'Transaksi',
	// 				border: false,
	// 				items: [
	// 					programs.jurnal,
	// 					programs.payment,
	// 					programs.hutang



	// 				]
	// 			}
	// 		]
	// 	},
	// 	{
	// 		title: 'Administrator',
	// 		border: false,
	// 		items: [
	// 			programs.user,
	// 			programs.group,
	// 		]
	// 	},
		
	// 	programs.crud01,
	// ]