import Context from './reportviewer-context.mjs'
import * as reportPage from './reportPage.mjs' 

const app = Context.app
const Crsl = Context.Crsl

const btnLoad = document.getElementById('btnLoad')
const btnPrint = document.getElementById('btnPrint')
const btnDownload = document.getElementById('btnDownload')


export default class extends Module {
	constructor() {
		super()
	}

	async main(args={}) {
		console.log('initializing viewer...')
		
		app.showFooter(false)

		const self = this

		try {
			
			// inisiasi sisi server
			try {
				const result = await Module.apiCall(`/${Context.moduleName}/init`, { })
				Context.notifierId = result.notifierId
				Context.notifierSocket = result.notifierSocket
				Context.userId = result.userId
				Context.userFullname = result.userFullname
				Context.sid = result.sid
				Context.targetDirectory = result.targetDirectory
				Context.appsUrls = result.appsUrls
				
				

			} catch (err) {
				throw err
			} 


			await Promise.all([
				reportPage.init(self, args),
			// 	generatorEdit.init(self, args),
			// 	generatorExtender.init(self, args)
			])

			// render dan setup halaman
			await render(self)

			// listen keyboard action
			// listenUserKeys(self)	

			// kalau user melakukan reload, konfirm dulu
			// const isFormDirty = true
			// window.onbeforeunload = (evt)=>{ 
			// 	if (isFormDirty) {
			// 		evt.preventDefault();
			// 		return  "Changes you made may not be saved."
			// 	}
			// };

			btnPrint.addEventListener('click', (evt)=>{
				btnPrint_click(self)
			})

			btnLoad.addEventListener('click', (evt)=>{
				btnLoad_click(self)
			})

			btnDownload.addEventListener('click', (evt)=>{
				btnDownload_click(self)
			})

		} catch (err) {
			throw err
		}

	}



	

}


async function render(self) {
	try {
	
		// Crsl.setIconUrl('/generator/generator.png')

		Crsl.addEventListener($fgta5.SectionCarousell.EVT_SECTIONSHOWING, (evt)=>{
			var sectionId = evt.detail.commingSection.Id
			for (let cont of footerButtonsContainer) {
				var currContainerSectionId = cont.getAttribute('data-section')
				if (currContainerSectionId==sectionId) {
					setTimeout(()=>{
						cont.classList.remove('hidden')
						cont.style.animation = 'dropped 0.3s forwards'
						setTimeout(()=>{
							cont.style.animation = 'unset'	
						}, 300)
					}, 500)
				} else {
					cont.classList.add('hidden')
				}
			}
		})


	} catch (err) {
		throw err
	}
}	



async function btnPrint_click(self) {
	console.log('cetak laporan')
	window.print(self)
}

async function btnLoad_click(self) {
	let mask = $fgta5.Modal.createMask()
	
	try {
		btnLoad.disabled = true
		btnPrint.disabled = true
		btnDownload.disabled = true

		mask.setText('Requesting report data')
		const param = reportPage.getParams()
		const res = await loadData(self, param)
		const cache_id = res.info.cache_id
		
		await reportPage.loadReport(self, cache_id, mask)

	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)

	} finally {
		btnLoad.disabled = false
		btnPrint.disabled = false
		btnDownload.disabled = false

		mask.close()
		mask = null
	}
}



async function btnDownload_click(self) {
	console.log('download data')
}





async function loadData(self, param) {
	// siapkan untuk keperluan proses multi thread di server
	return new Promise(async (resolve, reject)=>{
		const jobId = Date.now()
		const clientId = `${Context.notifierId}-${jobId}`
		const notifierSocket = Context.notifierSocket
		const ws = new WebSocket(`${notifierSocket}/?clientId=${clientId}`);
 

		
		// siapkan listener socket
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.status === 'done') {
				ws.close();
				resolve(data);
			} else if (data.status=='error') {
				ws.close();
				reject(new Error(data.info.message))
			} else if (data.status==='timeout') {
				ws.close();
				reject(new Error('generate timeout'));
			}
		};


		// ada error di server
		ws.onerror = (err) => {
			ws.close();
			console.error(err)
			reject(err);
		};		
		


		const apiReport = new $fgta5.ApiEndpoint(`/${Context.moduleName}/generate`)
		try {
			await apiReport.execute({ param, clientId })
			// menampilkan data report akan di handle di ws.onmessage
		} catch (err) {
			reject(err)
		} finally {
			apiReport.dispose()
		}

	})
}

