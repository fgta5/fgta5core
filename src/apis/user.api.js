import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerDocument } from '@agung_dhewe/webapps/src/sequencerdoc.js' 
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/user.apiext.js'

const moduleName = 'user'
const headerSectionName = 'header'
const headerTableName = 'core.user' 
const loginTableName = 'core.userlogin'  
const propTableName = 'core.userprop'  
const groupTableName = 'core.usergroup'  
const favouriteTableName = 'core.userfavouriteprogram'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await user_init(this, body) }

	// header
	async headerList(body) { return await user_headerList(this, body) }
	async headerOpen(body) { return await user_headerOpen(this, body) }
	async headerUpdate(body) { return await user_headerUpdate(this, body)}
	async headerCreate(body) { return await user_headerCreate(this, body)}
	async headerDelete(body) { return await user_headerDelete(this, body) }
	
	
	// login	
	async loginList(body) { return await user_loginList(this, body) }
	async loginOpen(body) { return await user_loginOpen(this, body) }
	async loginUpdate(body) { return await user_loginUpdate(this, body)}
	async loginCreate(body) { return await user_loginCreate(this, body) }
	async loginDelete(body) { return await user_loginDelete(this, body) }
	async loginDeleteRows(body) { return await user_loginDeleteRows(this, body) }
	
	// prop	
	async propList(body) { return await user_propList(this, body) }
	async propOpen(body) { return await user_propOpen(this, body) }
	async propUpdate(body) { return await user_propUpdate(this, body)}
	async propCreate(body) { return await user_propCreate(this, body) }
	async propDelete(body) { return await user_propDelete(this, body) }
	async propDeleteRows(body) { return await user_propDeleteRows(this, body) }
	
	// group	
	async groupList(body) { return await user_groupList(this, body) }
	async groupOpen(body) { return await user_groupOpen(this, body) }
	async groupUpdate(body) { return await user_groupUpdate(this, body)}
	async groupCreate(body) { return await user_groupCreate(this, body) }
	async groupDelete(body) { return await user_groupDelete(this, body) }
	async groupDeleteRows(body) { return await user_groupDeleteRows(this, body) }
	
	// favourite	
	async favouriteList(body) { return await user_favouriteList(this, body) }
	async favouriteOpen(body) { return await user_favouriteOpen(this, body) }
	async favouriteUpdate(body) { return await user_favouriteUpdate(this, body)}
	async favouriteCreate(body) { return await user_favouriteCreate(this, body) }
	async favouriteDelete(body) { return await user_favouriteDelete(this, body) }
	async favouriteDeleteRows(body) { return await user_favouriteDeleteRows(this, body) }
			
}	

// init module
async function user_init(self, body) {
	const req = self.req

	// set sid untuk session ini, diperlukan ini agar session aktif
	req.session.sid = req.sessionID

	try {
		// ambil data app dari database
		const sql = 'select apps_id, apps_url from core."apps"'
		const result = await db.any(sql)

		const appsUrls = {}
		for (let row of result) {
			appsUrls[row.apps_id] = {
				url: row.apps_url
			}
		}

		return {
			userId: req.session.user.userId,
			userName: req.session.user.userName,
			userFullname: req.session.userFullname,
			sid: req.session.sid ,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,
			appsUrls: appsUrls
		}
		
	} catch (err) {
		throw err
	}
}


// data logging
async function user_log(self, body, startTime, tablename, id, action, data={}, remark='') {
	const { source } = body
	const req = self.req
	const user_id = req.session.user.userId
	const user_name = req.session.user.userFullname
	const ipaddress = req.ip
	const metadata = JSON.stringify({...{source:source}, ...data})
	const endTime = process.hrtime.bigint();
	const executionTimeMs = Number((endTime - startTime) / 1_000_000n); // hasil dalam ms tanpa desimal
	
	const logdata = {id, user_id, user_name, moduleName, action, tablename, executionTimeMs, remark, metadata, ipaddress}
	const ret = await logger.log(logdata)
	return ret
}



async function user_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `user_name ILIKE '%' || \${searchtext} || '%'`,
	};

	try {
	
		// jika tidak ada default searchtext
		if (searchMap.searchtext===undefined) {
			throw new Error(`'searchtext' belum didefinisikan di searchMap`)	
		}
		

		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.headerListCriteria === 'function') {
			await Extender.headerListCriteria(self, db, searchMap, criteria, sort, columns)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			
			// pasang extender di sini
			if (typeof Extender.headerListRow === 'function') {
				await Extender.headerListRow(self, row)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function user_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { user_id: id }
		const searchMap = { user_id: `user_id = \${user_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename: tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	

		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}
		
		// pasang extender untuk olah data
		if (typeof Extender.headerOpen === 'function') {
			await Extender.headerOpen(self, data)
		}

		return data
	} catch (err) {
		throw err
	}
}


async function user_headerCreate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = headerTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			// buat sequencer document	
			const sequencer = createSequencerDocument(tx, { 
				COMPANY_CODE: req.app.locals.appConfig.COMPANY_CODE,
				blockLength: 3,
				numberLength: 6,
			})

			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				await Extender.sequencerSetup(self, tx, sequencer, data)
			}

			// generate data USR reset pertahun
			const seqdata = await sequencer.yearly('USR')	
			data.user_id = seqdata.id
			
			
				

			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerCreating === 'function') {
				await Extender.headerCreating(self, tx, data, seqdata)
			}


			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerCreated === 'function') {
				await Extender.headerCreated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, ret.user_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function user_headerUpdate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerUpdating === 'function') {
				await Extender.headerUpdating(self, tx, data)
			}

			// eksekusi update
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['user_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			user_log(self, body, startTime, tablename, data.user_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function user_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {user_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data login
			{
				const sql = `select * from ${loginTableName} where user_id=\${user_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowlogin of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.loginDeleting === 'function') {
						await Extender.loginDeleting(self, tx, rowlogin, logMetadata)
					}

					const param = {userlogin_id: rowlogin.userlogin_id}
					const cmd = sqlUtil.createDeleteCommand(loginTableName, ['userlogin_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.loginDeleted === 'function') {
						await Extender.loginDeleted(self, tx, deletedRow, logMetadata)
					}					

					user_log(self, body, startTime, loginTableName, rowlogin.userlogin_id, 'DELETE', {rowdata: deletedRow})
					user_log(self, body, startTime, headerTableName, rowlogin.user_id, 'DELETE ROW LOGIN', {userlogin_id: rowlogin.userlogin_id, tablename: loginTableName}, `removed: ${rowlogin.userlogin_id}`)


				}	
			}

			// hapus data prop
			{
				const sql = `select * from ${propTableName} where user_id=\${user_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowprop of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.propDeleting === 'function') {
						await Extender.propDeleting(self, tx, rowprop, logMetadata)
					}

					const param = {userprop_id: rowprop.userprop_id}
					const cmd = sqlUtil.createDeleteCommand(propTableName, ['userprop_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.propDeleted === 'function') {
						await Extender.propDeleted(self, tx, deletedRow, logMetadata)
					}					

					user_log(self, body, startTime, propTableName, rowprop.userprop_id, 'DELETE', {rowdata: deletedRow})
					user_log(self, body, startTime, headerTableName, rowprop.user_id, 'DELETE ROW PROP', {userprop_id: rowprop.userprop_id, tablename: propTableName}, `removed: ${rowprop.userprop_id}`)


				}	
			}

			// hapus data group
			{
				const sql = `select * from ${groupTableName} where user_id=\${user_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowgroup of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.groupDeleting === 'function') {
						await Extender.groupDeleting(self, tx, rowgroup, logMetadata)
					}

					const param = {usergroup_id: rowgroup.usergroup_id}
					const cmd = sqlUtil.createDeleteCommand(groupTableName, ['usergroup_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.groupDeleted === 'function') {
						await Extender.groupDeleted(self, tx, deletedRow, logMetadata)
					}					

					user_log(self, body, startTime, groupTableName, rowgroup.usergroup_id, 'DELETE', {rowdata: deletedRow})
					user_log(self, body, startTime, headerTableName, rowgroup.user_id, 'DELETE ROW GROUP', {usergroup_id: rowgroup.usergroup_id, tablename: groupTableName}, `removed: ${rowgroup.usergroup_id}`)


				}	
			}

			// hapus data favourite
			{
				const sql = `select * from ${favouriteTableName} where user_id=\${user_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowfavourite of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.favouriteDeleting === 'function') {
						await Extender.favouriteDeleting(self, tx, rowfavourite, logMetadata)
					}

					const param = {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id}
					const cmd = sqlUtil.createDeleteCommand(favouriteTableName, ['userfavouriteprogram_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.favouriteDeleted === 'function') {
						await Extender.favouriteDeleted(self, tx, deletedRow, logMetadata)
					}					

					user_log(self, body, startTime, favouriteTableName, rowfavourite.userfavouriteprogram_id, 'DELETE', {rowdata: deletedRow})
					user_log(self, body, startTime, headerTableName, rowfavourite.user_id, 'DELETE ROW FAVOURITE', {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id, tablename: favouriteTableName}, `removed: ${rowfavourite.userfavouriteprogram_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['user_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				await Extender.headerDeleted(self, tx, ret, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// login	

async function user_loginList(self, body) {
	const tablename = loginTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		user_id: `user_id=try_cast_bigint(\${user_id}, 0)`,
	};


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.userListCriteria === 'function') {
			await Extender.userListCriteria(self, db, searchMap, criteria, sort, columns)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				await Extender.detilListRow(row)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function user_loginOpen(self, body) {
	const tablename = loginTableName

	try {
		const { id } = body 
		const criteria = { userlogin_id: id }
		const searchMap = { userlogin_id: `userlogin_id = \${userlogin_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	


		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}	

		return data
	} catch (err) {
		throw err
	}
}

async function user_loginCreate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = loginTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const sequencer = createSequencerLine(tx, {})
			const id = await sequencer.increment('USR')
			data.userlogin_id = id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.loginCreating === 'function') {
				await Extender.loginCreating(self, tx, data)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.loginCreated === 'function') {
				await Extender.loginCreated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, ret.userlogin_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function user_loginUpdate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = loginTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.loginUpdating === 'function') {
				await Extender.loginUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['userlogin_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.loginUpdated === 'function') {
				await Extender.loginUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, data.userlogin_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function user_loginDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = loginTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {userlogin_id: id}
			const sql = `select * from ${loginTableName} where userlogin_id=\${userlogin_id}`
			const rowlogin = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.loginDeleting === 'function') {
				await Extender.loginDeleting(self, tx, rowlogin, logMetadata)
			}

			const param = {userlogin_id: rowlogin.userlogin_id}
			const cmd = sqlUtil.createDeleteCommand(loginTableName, ['userlogin_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.loginDeleted === 'function') {
				await Extender.loginDeleted(self, tx, deletedRow, logMetadata)
			}					

			user_log(self, body, startTime, loginTableName, rowlogin.userlogin_id, 'DELETE', {rowdata: deletedRow})
			user_log(self, body, startTime, headerTableName, rowlogin.user_id, 'DELETE ROW LOGIN', {userlogin_id: rowlogin.userlogin_id, tablename: loginTableName}, `removed: ${rowlogin.userlogin_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function user_loginDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = loginTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {userlogin_id: id}
				const sql = `select * from ${loginTableName} where userlogin_id=\${userlogin_id}`
				const rowlogin = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.loginDeleting === 'function') {
					await Extender.loginDeleting(self, tx, rowlogin, logMetadata)
				}

				const param = {userlogin_id: rowlogin.userlogin_id}
				const cmd = sqlUtil.createDeleteCommand(loginTableName, ['userlogin_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.loginDeleted === 'function') {
					await Extender.loginDeleted(self, tx, deletedRow, logMetadata)
				}					

				user_log(self, body, startTime, loginTableName, rowlogin.userlogin_id, 'DELETE', {rowdata: deletedRow})
				user_log(self, body, startTime, headerTableName, rowlogin.user_id, 'DELETE ROW LOGIN', {userlogin_id: rowlogin.userlogin_id, tablename: loginTableName}, `removed: ${rowlogin.userlogin_id}`)
			}
		})

		const res = {
			deleted: true,
			message: ''
		}
		return res
	} catch (err) {
		throw err
	}	
}


// prop	

async function user_propList(self, body) {
	const tablename = propTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		user_id: `user_id=try_cast_bigint(\${user_id}, 0)`,
	};


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.userListCriteria === 'function') {
			await Extender.userListCriteria(self, db, searchMap, criteria, sort, columns)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				await Extender.detilListRow(row)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function user_propOpen(self, body) {
	const tablename = propTableName

	try {
		const { id } = body 
		const criteria = { userprop_id: id }
		const searchMap = { userprop_id: `userprop_id = \${userprop_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	


		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}	

		return data
	} catch (err) {
		throw err
	}
}

async function user_propCreate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = propTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const sequencer = createSequencerLine(tx, {})
			const id = await sequencer.increment('USR')
			data.userprop_id = id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.propCreating === 'function') {
				await Extender.propCreating(self, tx, data)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.propCreated === 'function') {
				await Extender.propCreated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, ret.userprop_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function user_propUpdate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = propTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.propUpdating === 'function') {
				await Extender.propUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['userprop_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.propUpdated === 'function') {
				await Extender.propUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, data.userprop_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function user_propDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = propTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {userprop_id: id}
			const sql = `select * from ${propTableName} where userprop_id=\${userprop_id}`
			const rowprop = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.propDeleting === 'function') {
				await Extender.propDeleting(self, tx, rowprop, logMetadata)
			}

			const param = {userprop_id: rowprop.userprop_id}
			const cmd = sqlUtil.createDeleteCommand(propTableName, ['userprop_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.propDeleted === 'function') {
				await Extender.propDeleted(self, tx, deletedRow, logMetadata)
			}					

			user_log(self, body, startTime, propTableName, rowprop.userprop_id, 'DELETE', {rowdata: deletedRow})
			user_log(self, body, startTime, headerTableName, rowprop.user_id, 'DELETE ROW PROP', {userprop_id: rowprop.userprop_id, tablename: propTableName}, `removed: ${rowprop.userprop_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function user_propDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = propTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {userprop_id: id}
				const sql = `select * from ${propTableName} where userprop_id=\${userprop_id}`
				const rowprop = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.propDeleting === 'function') {
					await Extender.propDeleting(self, tx, rowprop, logMetadata)
				}

				const param = {userprop_id: rowprop.userprop_id}
				const cmd = sqlUtil.createDeleteCommand(propTableName, ['userprop_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.propDeleted === 'function') {
					await Extender.propDeleted(self, tx, deletedRow, logMetadata)
				}					

				user_log(self, body, startTime, propTableName, rowprop.userprop_id, 'DELETE', {rowdata: deletedRow})
				user_log(self, body, startTime, headerTableName, rowprop.user_id, 'DELETE ROW PROP', {userprop_id: rowprop.userprop_id, tablename: propTableName}, `removed: ${rowprop.userprop_id}`)
			}
		})

		const res = {
			deleted: true,
			message: ''
		}
		return res
	} catch (err) {
		throw err
	}	
}


// group	

async function user_groupList(self, body) {
	const tablename = groupTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		user_id: `user_id=try_cast_bigint(\${user_id}, 0)`,
	};


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.userListCriteria === 'function') {
			await Extender.userListCriteria(self, db, searchMap, criteria, sort, columns)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			// lookup: group_name dari field group_name pada table core.group dimana (core.group.group_id = core.user.group_id)
			{
				const { group_name } = await sqlUtil.lookupdb(db, 'core.group', 'group_id', row.group_id)
				row.group_name = group_name
			}
			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				await Extender.detilListRow(row)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function user_groupOpen(self, body) {
	const tablename = groupTableName

	try {
		const { id } = body 
		const criteria = { usergroup_id: id }
		const searchMap = { usergroup_id: `usergroup_id = \${usergroup_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	


		// lookup: group_name dari field group_name pada table core.group dimana (core.group.group_id = core.user.group_id)
		{
			const { group_name } = await sqlUtil.lookupdb(db, 'core.group', 'group_id', data.group_id)
			data.group_name = group_name
		}
		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}	

		return data
	} catch (err) {
		throw err
	}
}

async function user_groupCreate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = groupTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const sequencer = createSequencerLine(tx, {})
			const id = await sequencer.increment('USR')
			data.usergroup_id = id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.groupCreating === 'function') {
				await Extender.groupCreating(self, tx, data)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.groupCreated === 'function') {
				await Extender.groupCreated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, ret.usergroup_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function user_groupUpdate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = groupTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.groupUpdating === 'function') {
				await Extender.groupUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['usergroup_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.groupUpdated === 'function') {
				await Extender.groupUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, data.usergroup_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function user_groupDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = groupTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {usergroup_id: id}
			const sql = `select * from ${groupTableName} where usergroup_id=\${usergroup_id}`
			const rowgroup = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.groupDeleting === 'function') {
				await Extender.groupDeleting(self, tx, rowgroup, logMetadata)
			}

			const param = {usergroup_id: rowgroup.usergroup_id}
			const cmd = sqlUtil.createDeleteCommand(groupTableName, ['usergroup_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.groupDeleted === 'function') {
				await Extender.groupDeleted(self, tx, deletedRow, logMetadata)
			}					

			user_log(self, body, startTime, groupTableName, rowgroup.usergroup_id, 'DELETE', {rowdata: deletedRow})
			user_log(self, body, startTime, headerTableName, rowgroup.user_id, 'DELETE ROW GROUP', {usergroup_id: rowgroup.usergroup_id, tablename: groupTableName}, `removed: ${rowgroup.usergroup_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function user_groupDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = groupTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {usergroup_id: id}
				const sql = `select * from ${groupTableName} where usergroup_id=\${usergroup_id}`
				const rowgroup = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.groupDeleting === 'function') {
					await Extender.groupDeleting(self, tx, rowgroup, logMetadata)
				}

				const param = {usergroup_id: rowgroup.usergroup_id}
				const cmd = sqlUtil.createDeleteCommand(groupTableName, ['usergroup_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.groupDeleted === 'function') {
					await Extender.groupDeleted(self, tx, deletedRow, logMetadata)
				}					

				user_log(self, body, startTime, groupTableName, rowgroup.usergroup_id, 'DELETE', {rowdata: deletedRow})
				user_log(self, body, startTime, headerTableName, rowgroup.user_id, 'DELETE ROW GROUP', {usergroup_id: rowgroup.usergroup_id, tablename: groupTableName}, `removed: ${rowgroup.usergroup_id}`)
			}
		})

		const res = {
			deleted: true,
			message: ''
		}
		return res
	} catch (err) {
		throw err
	}	
}


// favourite	

async function user_favouriteList(self, body) {
	const tablename = favouriteTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		user_id: `user_id=try_cast_bigint(\${user_id}, 0)`,
	};


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.userListCriteria === 'function') {
			await Extender.userListCriteria(self, db, searchMap, criteria, sort, columns)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			// lookup: program_name dari field program_name pada table core.program dimana (core.program.program_id = core.user.program_id)
			{
				const { program_name } = await sqlUtil.lookupdb(db, 'core.program', 'program_id', row.program_id)
				row.program_name = program_name
			}
			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				await Extender.detilListRow(row)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function user_favouriteOpen(self, body) {
	const tablename = favouriteTableName

	try {
		const { id } = body 
		const criteria = { userfavouriteprogram_id: id }
		const searchMap = { userfavouriteprogram_id: `userfavouriteprogram_id = \${userfavouriteprogram_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	


		// lookup: program_name dari field program_name pada table core.program dimana (core.program.program_id = core.user.program_id)
		{
			const { program_name } = await sqlUtil.lookupdb(db, 'core.program', 'program_id', data.program_id)
			data.program_name = program_name
		}
		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}	

		return data
	} catch (err) {
		throw err
	}
}

async function user_favouriteCreate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = favouriteTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const sequencer = createSequencerLine(tx, {})
			const id = await sequencer.increment('USR')
			data.userfavouriteprogram_id = id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.favouriteCreating === 'function') {
				await Extender.favouriteCreating(self, tx, data)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.favouriteCreated === 'function') {
				await Extender.favouriteCreated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, ret.userfavouriteprogram_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function user_favouriteUpdate(self, body) {
	const { source='user', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = favouriteTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.favouriteUpdating === 'function') {
				await Extender.favouriteUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['userfavouriteprogram_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.favouriteUpdated === 'function') {
				await Extender.favouriteUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			user_log(self, body, startTime, tablename, data.userfavouriteprogram_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function user_favouriteDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = favouriteTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {userfavouriteprogram_id: id}
			const sql = `select * from ${favouriteTableName} where userfavouriteprogram_id=\${userfavouriteprogram_id}`
			const rowfavourite = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.favouriteDeleting === 'function') {
				await Extender.favouriteDeleting(self, tx, rowfavourite, logMetadata)
			}

			const param = {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id}
			const cmd = sqlUtil.createDeleteCommand(favouriteTableName, ['userfavouriteprogram_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.favouriteDeleted === 'function') {
				await Extender.favouriteDeleted(self, tx, deletedRow, logMetadata)
			}					

			user_log(self, body, startTime, favouriteTableName, rowfavourite.userfavouriteprogram_id, 'DELETE', {rowdata: deletedRow})
			user_log(self, body, startTime, headerTableName, rowfavourite.user_id, 'DELETE ROW FAVOURITE', {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id, tablename: favouriteTableName}, `removed: ${rowfavourite.userfavouriteprogram_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function user_favouriteDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = favouriteTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {userfavouriteprogram_id: id}
				const sql = `select * from ${favouriteTableName} where userfavouriteprogram_id=\${userfavouriteprogram_id}`
				const rowfavourite = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.favouriteDeleting === 'function') {
					await Extender.favouriteDeleting(self, tx, rowfavourite, logMetadata)
				}

				const param = {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id}
				const cmd = sqlUtil.createDeleteCommand(favouriteTableName, ['userfavouriteprogram_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.favouriteDeleted === 'function') {
					await Extender.favouriteDeleted(self, tx, deletedRow, logMetadata)
				}					

				user_log(self, body, startTime, favouriteTableName, rowfavourite.userfavouriteprogram_id, 'DELETE', {rowdata: deletedRow})
				user_log(self, body, startTime, headerTableName, rowfavourite.user_id, 'DELETE ROW FAVOURITE', {userfavouriteprogram_id: rowfavourite.userfavouriteprogram_id, tablename: favouriteTableName}, `removed: ${rowfavourite.userfavouriteprogram_id}`)
			}
		})

		const res = {
			deleted: true,
			message: ''
		}
		return res
	} catch (err) {
		throw err
	}	
}

	