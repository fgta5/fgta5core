import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'


import * as Extender from './extenders/directory.apiext.js'

const moduleName = 'directory'
const headerSectionName = 'header'
const headerTableName = 'core.directory'

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await directory_init(this, body) }

	// header
	async headerList(body) { return await directory_headerList(this, body) }
	async headerOpen(body) { return await directory_headerOpen(this, body) }
	async headerUpdate(body) { return await directory_headerUpdate(this, body)}
	async headerCreate(body) { return await directory_headerCreate(this, body)}
	async headerDelete(body) { return await directory_headerDelete(this, body) }

}


async function directory_init(self, body) {
	console.log('init generator')
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


async function directory_headerList(self, body) {
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `directory_id=try_cast_int(\${searchtext}, 0) OR directory_name ILIKE '%' || \${searchtext} || '%'`,
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


		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename:headerTableName, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			// lookup: directory_parentname dari field directory_name pada table core.directory dimana (core.directory.directory_id = core.directory.directory_parent)
			{
				const { directory_name } = await sqlUtil.lookupdb(db, 'core.directory', 'directory_id', row.directory_parent)
				row.directory_parentname = directory_name
			}
			


			// pasang extender di sini
			if (typeof Extender.headerListRow === 'function') {
				await Extender.headerListRow(row)
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

async function directory_headerOpen(self, body) {
	try {
		const { id } = body 
		const criteria = { directory_id: id }
		const searchMap = { directory_id: `directory_id = \${directory_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename: headerTableName, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${headerTableName}] data dengan id '${id}' tidak ditemukan`) 
		}	

		// lookup: directory_parentname dari field directory_name pada table core.directory dimana (core.directory.directory_id = core.directory.directory_parent)
		{
			const { directory_name } = await sqlUtil.lookupdb(db, 'core.directory', 'directory_id', data.directory_parent)
			data.directory_parentname = directory_name
		}
		



		// pasang extender untuk olah data
		if (typeof Extender.headerOpen === 'function') {
			await Extender.headerOpen(data)
		}

		return data
	} catch (err) {
		throw err
	}
}


async function directory_headerCreate(self, body) {
	const { source, data } = body

	try {
		sqlUtil.connect(db)

		data._createby = 1
		data._createdate = (new Date()).toISOString()


		const cmd = sqlUtil.createInsertCommand(headerTableName, data, ['directory_id'])
		const result = await cmd.execute(data)
		
		// record log
		let logdata = {moduleName, source, tablename:headerTableName, section:headerSectionName, action:'CREATE', id: result.directory_id}
		await self.log(logdata)
		
		return result
	} catch (err) {
		throw err
	}
}

async function directory_headerUpdate(self, body) {
	const { source, data } = body

	try {
		sqlUtil.connect(db)

		data._modifyby = 1
		data._modifydate = (new Date()).toISOString()
		
		const cmd =  sqlUtil.createUpdateCommand(headerTableName, data, ['directory_id'])
		const result = await cmd.execute(data)
		
		// record log
		let logdata = {moduleName, source, tablename:headerTableName, section:headerSectionName, action:'UPDATE', id: data.directory_id} 
		await self.log(logdata)

		return result
	} catch (err) {
		throw err
	}
}


async function directory_headerDelete(self, body) {

	try {
		const { source, id } = body 
		const dataToRemove = {directory_id: id}

		const cmd = sqlUtil.createDeleteCommand(headerTableName, ['directory_id'])
		const result = await cmd.execute(dataToRemove)
	
		// record log
		let logdata = {moduleName, source, tablename:headerTableName, section:headerSectionName, action:'DELETE', id}
		await self.log(logdata)

		return result
	} catch (err) {
		throw err
	}
}