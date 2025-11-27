import { workerData, parentPort } from 'worker_threads';
import path from 'path';
import pgp from 'pg-promise'
import db from '@agung_dhewe/webapps/src/db.js'

const { user_id, user_name, ipaddress, param } = workerData;

main(param)

async function main(param) {
	try {
		// siapkan data cache
		const sqlCache = 'select gen_random_uuid() as cache_id;'
		const row = await db.one(sqlCache)
		const cache_id = row.cache_id;

		
		// panggil stored procedure dengan cache_id




		await sleep(3)  // jeda 3 detik
		parentPort.postMessage({done:true, cache_id: cache_id})
	} catch (err) {
		err.message = `Generator Worker: ${err.message}`
		throw err
	}
}

async function sleep(s) {
	if (s==0) {
		return
	}
	return new Promise(lanjut=>{
		setTimeout(()=>{
			lanjut()
		}, s*1000)	
	})
}