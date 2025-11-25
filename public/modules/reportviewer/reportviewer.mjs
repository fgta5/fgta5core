import Context from './reportviewer-context.mjs'
import * as reportPage from './reportPage.mjs' 

const app = Context.app
const Crsl = Context.Crsl


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
				
				app.setTitle(result.title)

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



		// and event
		const btnPrint = document.getElementById('btnPrint')
		btnPrint.addEventListener('click', (evt)=>{
			btnPrint_click()
		})

	} catch (err) {
		throw err
	}
}	



async function btnPrint_click() {
	console.log('cetak laporan')
	window.print()
}