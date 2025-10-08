import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { createWebApplication, createDefaultAppConfig } from '@agung_dhewe/webapps'
import { createRouter } from './router.js'
import db from '@agung_dhewe/webapps/src/db.js'
import bucket from '@agung_dhewe/webapps/src/bucket.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webapp = createWebApplication()
const appName = 'core'


main()


async function main() {
	const port = process.env.PORT || webapp.defaultPort;
	const startingMessage = `Starting ${appName} module on port \x1b[32m${port}\x1b[0m`
	
	// Baca Data Dari Konfigurasi
	const redisUrl = process.env.REDIS_URL
	const sessionName = process.env.SESSION_NAME
	const sessionSecret = process.env.SESSION_SECRET
	const sessionMaxAge = process.env.SESSION_MAXAGE 
	const sessionDomain = process.env.SESSION_DOMAIN
	const sessionSecure = process.env.SESSION_SECURE 
	const sessionHttpOnly = process.env.SESSION_HTTPONLY
	const notifierSocket = process.env.NOTIFIER_SOCKET 
	const notifierServer = process.env.NOTIFIER_SERVER

	const fgta5jsDebugMode = process.env.DEBUG_MODE_FGTA5JS === 'true'
	const fgta5jsVersion = process.env.FGTA5JS_VERSION || ''
	const appDebugMode = process.env.DEBUG_MODE_APP === 'true'


	const router = createRouter()

	// ambil setting system
	const applicationSetting = await getApplicationSetting()


	// variabel local konfigurasi yang bisa diakses dari api/router
	const appConfig = {
		...createDefaultAppConfig(),
		...applicationSetting,
		...{
			appName, 
			fgta5jsDebugMode, 
			fgta5jsVersion, 
			appDebugMode,
			notifierSocket,
			notifierServer,

			redisUrl,
			
			sessionName,
			sessionSecret,
			sessionMaxAge : sessionMaxAge * 60 * 1000,
			sessionDomain,
			sessionSecure : sessionSecure.toLowerCase()==='true' ? true : false,
			sessionHttpOnly : sessionHttpOnly.toLowerCase()==='false' ? false : true

		}
	} 
	
	const rootDir = path.join(__dirname, '..')
	webapp.setRootDirectory(rootDir)
	webapp.start({
		port,
		startingMessage,
		redisUrl,
		appConfig,
		router,
		allowedOrigins: [
			'http://localhost:3000',
			/^https:\/\/.*\.transfashion\.id$/
		] 
	})
}

async function getApplicationSetting() {
	const setting = {}
	try {
		const sql = 'select setting_id, setting_value from core.setting'
		const rows = await db.any(sql);
		for (var row of rows) {
			const setting_id = row.setting_id
			const setting_value = row.setting_value
			setting[setting_id] = setting_value
		}
		return setting
	} catch (err) {
		throw err
	}
}