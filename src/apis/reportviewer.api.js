import pgp from 'pg-promise'

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  

import jwt from 'jsonwebtoken';

const MINUTES = 60 * 1000

const moduleName = 'generator'
const generateTimeoutMs = 5 * MINUTES 

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)

	}

	async init(body) { return await reportviewer_init(this, body) }

	
}


// init module
async function reportviewer_init(self, body) {
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

		return initialData
	} catch (err) {
		throw err
	}
}
