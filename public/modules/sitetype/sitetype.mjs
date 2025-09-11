import Context from './sitetype-context.mjs'  
import * as sitetypeHeaderList from './sitetypeHeaderList.mjs' 
import * as sitetypeHeaderEdit from './sitetypeHeaderEdit.mjs' 
import * as Extender from './sitetype-ext.mjs'

const app = Context.app
const Crsl = Context.Crsl


export default class extends Module {
	constructor() {
		super()
	}

	async main(args={}) {
		
		console.log('initializing module...')
		app.setTitle('Site Type')
		app.showFooter(true)
		
		args.autoLoadGridData = true

		const self = this

		// module-module yang di load perlu di pack dulu ke dalam variable
		// jangan import lagi module-module ini di dalam mjs tersebut
		// karena akan terjadi cyclic redudancy pada saat di rollup
		self.Modules = { 
			sitetypeHeaderList, 
			sitetypeHeaderEdit, 
		}

		try {

			// inisiasi sisi server
			try {
				const result = await Module.apiCall(`/${Context.moduleName}/init`, { })
				Context.notifierId = result.notifierId
				Context.notifierSocket = result.notifierSocket
				Context.userId = result.userId
				Context.userFullname = result.userFullname
				Context.sid = result.sid
				Context.appsUrls = result.appsUrls
			} catch (err) {
				throw err
			} 

			await Promise.all([ 
				sitetypeHeaderList.init(self, args), 
				sitetypeHeaderEdit.init(self, args), 
				Extender.init(self, args)
			])

			// render dan setup halaman
			await render(self)

		} catch (err) {
			throw err
		}
	}

}

async function render(self) {
	try {
		const footerButtonsContainer =  document.getElementsByClassName('footer-buttons-container')
		Module.renderFooterButtons(footerButtonsContainer)
	
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

		// sitetype-ext.mjs, export function extendPage(self) {} 
		if (typeof Extender.extendPage === 'function') {
			Extender.extendPage(self)
		} else {
			console.warn(`'extendPage' tidak diimplementasikan di extender`)
		}

	} catch (err) {
		throw err
	}
}