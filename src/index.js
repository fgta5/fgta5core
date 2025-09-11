import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { createWebApplication } from '@agung_dhewe/webapps'
import db from '@agung_dhewe/webapps/src/db.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webapp = createWebApplication()
const appName = 'core'


main()


async function main() {
	const port = process.env.PORT || webapp.defaultPort;
	const startingMessage = `Starting ${appName} module on port \x1b[32m${port}\x1b[0m`
	const redisUrl = process.env.REDIS_URL || webapp.defaultRedisUrl
	const notifierSocket = process.env.NOTIFIER_SOCKET || webapp.defaultNotifierSocket 
	const notifierServer = process.env.NOTIFIER_SERVER || webapp.defaultNotifierServer
	const fgta5jsDebugMode = process.env.DEBUG_MODE_FGTA5JS === 'true'
	const fgta5jsVersion = process.env.FGTA5JS_VERSION || ''
	const appDebugMode = process.env.DEBUG_MODE_APP === 'true'
	const router = createRouter()


	// variabel local konfigurasi yang bisa diakses dari api/router
	const appConfig = {
		appName, 
		fgta5jsDebugMode, 
		fgta5jsVersion, 
		appDebugMode,
		notifierSocket,
		notifierServer
	} 
	
	const rootDir = path.join(__dirname, '..')
	webapp.setRootDirectory(rootDir)
	webapp.start({
		port,
		startingMessage,
		redisUrl,
		appConfig,
		router
	})
}


function createRouter() {
	const router = express.Router()

	// router.get('/', (req, res)=>{
	// 	res.status(200).send('ini index custom')
	// })

	return router
}