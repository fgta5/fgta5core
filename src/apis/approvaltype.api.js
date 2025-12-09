import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/approvaltype.apiext.js'

const moduleName = 'approvaltype'
const headerSectionName = 'header'
const headerTableName = 'core.approvaltype' 
const roleTableName = 'core.approvaltyperole'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await approvaltype_init(this, body) }

	// header
	async headerList(body) { return await approvaltype_headerList(this, body) }
	async headerOpen(body) { return await approvaltype_headerOpen(this, body) }
	async headerUpdate(body) { return await approvaltype_headerUpdate(this, body)}
	async headerCreate(body) { return await approvaltype_headerCreate(this, body)}
	async headerDelete(body) { return await approvaltype_headerDelete(this, body) }
	
	
	// role	
	async roleList(body) { return await approvaltype_roleList(this, body) }
	async roleOpen(body) { return await approvaltype_roleOpen(this, body) }
	async roleUpdate(body) { return await approvaltype_roleUpdate(this, body)}
	async roleCreate(body) { return await approvaltype_roleCreate(this, body) }
	async roleDelete(body) { return await approvaltype_roleDelete(this, body) }
	async roleDeleteRows(body) { return await approvaltype_roleDeleteRows(this, body) }
			
}	

// init module
async function approvaltype_init(self, body) {
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

		const initialData = {
			userId: req.session.user.userId,
			userName: req.session.user.userName,
			userFullname: req.session.userFullname,
			sid: req.session.sid ,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,
			appsUrls: appsUrls,
			setting: {}
		}
		
		if (typeof Extender.approvaltype_init === 'function') {
			// export async function approvaltype_init(self, initialData) {}
			await Extender.approvaltype_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// data logging
async function approvaltype_log(self, body, startTime, tablename, id, action, data={}, remark='') {
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



async function approvaltype_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `approvaltype_name ILIKE '%' || \${searchtext} || '%'`,
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

		const args = { db, criteria }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.headerListCriteria === 'function') {
			// export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.headerListCriteria(self, db, searchMap, criteria, sort, columns, args)
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
				// export async function headerListRow(self, row, args) {}
				await Extender.headerListRow(self, row, args)
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

async function approvaltype_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { approvaltype_id: id }
		const searchMap = { approvaltype_id: `approvaltype_id = \${approvaltype_id}`}
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
		// export async function headerOpen(self, db, data) {}
		if (typeof Extender.headerOpen === 'function') {
			// export async function headerOpen(self, db, data) {}
			await Extender.headerOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}


async function approvaltype_headerCreate(self, body) {
	const { source='approvaltype', data={} } = body
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


			const args = { section: 'header' }

			
			// buat short sequencer	
			const sequencer = createSequencerLine(tx, {})

			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}

			// generate short id sesuai prefix (default: ) reset pertahun
			const seqdata = await sequencer.yearlyshort(args.prefix)
			data.approvaltype_id = seqdata.id

			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerCreating === 'function') {
				// export async function headerCreating(self, tx, data, seqdata, args) {}
				await Extender.headerCreating(self, tx, data, seqdata, args)
			}

			

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerCreated === 'function') {
				// export async function headerCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.headerCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			approvaltype_log(self, body, startTime, tablename, ret.approvaltype_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function approvaltype_headerUpdate(self, body) {
	const { source='approvaltype', data={} } = body
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
				// export async function headerUpdating(self, tx, data) {}
				await Extender.headerUpdating(self, tx, data)
			}

			// eksekusi update
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['approvaltype_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			approvaltype_log(self, body, startTime, tablename, data.approvaltype_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function approvaltype_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {approvaltype_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data role
			{
				const sql = `select * from ${roleTableName} where approvaltype_id=\${approvaltype_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowrole of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.roleDeleting === 'function') {
						// export async function roleDeleting(self, tx, rowrole, logMetadata) {}
						await Extender.roleDeleting(self, tx, rowrole, logMetadata)
					}

					const param = {approvaltyperole_id: rowrole.approvaltyperole_id}
					const cmd = sqlUtil.createDeleteCommand(roleTableName, ['approvaltyperole_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.roleDeleted === 'function') {
						// export async function roleDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.roleDeleted(self, tx, deletedRow, logMetadata)
					}					

					approvaltype_log(self, body, startTime, roleTableName, rowrole.approvaltyperole_id, 'DELETE', {rowdata: deletedRow})
					approvaltype_log(self, body, startTime, headerTableName, rowrole.approvaltype_id, 'DELETE ROW ROLE', {approvaltyperole_id: rowrole.approvaltyperole_id, tablename: roleTableName}, `removed: ${rowrole.approvaltyperole_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['approvaltype_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, ret, logMetadata) {}
				await Extender.headerDeleted(self, tx, ret, logMetadata)
			}

			// record log
			approvaltype_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// role	

async function approvaltype_roleList(self, body) {
	const tablename = roleTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		approvaltype_id: `approvaltype_id=try_cast_bigint(\${approvaltype_id}, 0)`,
	};


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		const args = { db, criteria }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.roleListCriteria === 'function') {
			// export async function roleListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.roleListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

			// lookup: approvalsigntype_name dari field approvalsigntype_name pada table core.approvalsigntype dimana (core.approvalsigntype.approvalsigntype_id = core.approvaltype.approvalsigntype_id)
			{
				const { approvalsigntype_name } = await sqlUtil.lookupdb(db, 'core.approvalsigntype', 'approvalsigntype_id', row.approvalsigntype_id)
				row.approvalsigntype_name = approvalsigntype_name
			}
			// lookup: rolelevel_name dari field rolelevel_name pada table core.rolelevel dimana (core.rolelevel.rolelevel_id = core.approvaltype.rolelevel_id)
			{
				const { rolelevel_name } = await sqlUtil.lookupdb(db, 'core.rolelevel', 'rolelevel_id', row.rolelevel_id)
				row.rolelevel_name = rolelevel_name
			}
			// lookup: role_name dari field role_name pada table core.role dimana (core.role.role_id = core.approvaltype.role_id)
			{
				const { role_name } = await sqlUtil.lookupdb(db, 'core.role', 'role_id', row.role_id)
				row.role_name = role_name
			}
			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				// export async function detilListRow(self, row, args) {}
				await Extender.detilListRow(self, row, args)
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

async function approvaltype_roleOpen(self, body) {
	const tablename = roleTableName

	try {
		const { id } = body 
		const criteria = { approvaltyperole_id: id }
		const searchMap = { approvaltyperole_id: `approvaltyperole_id = \${approvaltyperole_id}`}
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


		// lookup: approvalsigntype_name dari field approvalsigntype_name pada table core.approvalsigntype dimana (core.approvalsigntype.approvalsigntype_id = core.approvaltype.approvalsigntype_id)
		{
			const { approvalsigntype_name } = await sqlUtil.lookupdb(db, 'core.approvalsigntype', 'approvalsigntype_id', data.approvalsigntype_id)
			data.approvalsigntype_name = approvalsigntype_name
		}
		// lookup: rolelevel_name dari field rolelevel_name pada table core.rolelevel dimana (core.rolelevel.rolelevel_id = core.approvaltype.rolelevel_id)
		{
			const { rolelevel_name } = await sqlUtil.lookupdb(db, 'core.rolelevel', 'rolelevel_id', data.rolelevel_id)
			data.rolelevel_name = rolelevel_name
		}
		// lookup: role_name dari field role_name pada table core.role dimana (core.role.role_id = core.approvaltype.role_id)
		{
			const { role_name } = await sqlUtil.lookupdb(db, 'core.role', 'role_id', data.role_id)
			data.role_name = role_name
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
		// export async function roleOpen(self, db, data) {}
		if (typeof Extender.roleOpen === 'function') {
			// export async function roleOpen(self, db, data) {}
			await Extender.roleOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function approvaltype_roleCreate(self, body) {
	const { source='approvaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = roleTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'role', 
				prefix: ''	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.approvaltyperole_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.roleCreating === 'function') {
				// export async function roleCreating(self, tx, data, seqdata, args) {}
				await Extender.roleCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.roleCreated === 'function') {
				// export async function roleCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.roleCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			approvaltype_log(self, body, startTime, tablename, ret.approvaltyperole_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function approvaltype_roleUpdate(self, body) {
	const { source='approvaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = roleTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.roleUpdating === 'function') {
				// export async function roleUpdating(self, tx, data) {}
				await Extender.roleUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['approvaltyperole_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.roleUpdated === 'function') {
				// export async function roleUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.roleUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			approvaltype_log(self, body, startTime, tablename, data.approvaltyperole_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function approvaltype_roleDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = roleTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {approvaltyperole_id: id}
			const sql = `select * from ${roleTableName} where approvaltyperole_id=\${approvaltyperole_id}`
			const rowrole = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.roleDeleting === 'function') {
				// export async function roleDeleting(self, tx, rowrole, logMetadata) {}
				await Extender.roleDeleting(self, tx, rowrole, logMetadata)
			}

			const param = {approvaltyperole_id: rowrole.approvaltyperole_id}
			const cmd = sqlUtil.createDeleteCommand(roleTableName, ['approvaltyperole_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.roleDeleted === 'function') {
				// export async function roleDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.roleDeleted(self, tx, deletedRow, logMetadata)
			}					

			approvaltype_log(self, body, startTime, roleTableName, rowrole.approvaltyperole_id, 'DELETE', {rowdata: deletedRow})
			approvaltype_log(self, body, startTime, headerTableName, rowrole.approvaltype_id, 'DELETE ROW ROLE', {approvaltyperole_id: rowrole.approvaltyperole_id, tablename: roleTableName}, `removed: ${rowrole.approvaltyperole_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function approvaltype_roleDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = roleTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {approvaltyperole_id: id}
				const sql = `select * from ${roleTableName} where approvaltyperole_id=\${approvaltyperole_id}`
				const rowrole = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.roleDeleting === 'function') {
					// async function roleDeleting(self, tx, rowrole, logMetadata) {}
					await Extender.roleDeleting(self, tx, rowrole, logMetadata)
				}

				const param = {approvaltyperole_id: rowrole.approvaltyperole_id}
				const cmd = sqlUtil.createDeleteCommand(roleTableName, ['approvaltyperole_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.roleDeleted === 'function') {
					// export async function roleDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.roleDeleted(self, tx, deletedRow, logMetadata)
				}					

				approvaltype_log(self, body, startTime, roleTableName, rowrole.approvaltyperole_id, 'DELETE', {rowdata: deletedRow})
				approvaltype_log(self, body, startTime, headerTableName, rowrole.approvaltype_id, 'DELETE ROW ROLE', {approvaltyperole_id: rowrole.approvaltyperole_id, tablename: roleTableName}, `removed: ${rowrole.approvaltyperole_id}`)
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

	