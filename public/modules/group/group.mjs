import Context from './group-context.mjs'  
import * as groupHeaderList from './groupHeaderList.mjs' 
import * as groupHeaderEdit from './groupHeaderEdit.mjs' 
import * as groupProgramList from './groupProgramList.mjs' 
import * as groupProgramEdit from './groupProgramEdit.mjs' 
import * as Extender from './group-ext.mjs'

const app = Context.app
const Crsl = Context.Crsl


export default class extends Module {
	constructor() {
		super()
	}

	async main(args={}) {
		
		console.log('initializing module...')
		app.setTitle('Group')
		app.showFooter(true)
		
		args.autoLoadGridData = true

		const self = this

		// module-module yang di load perlu di pack dulu ke dalam variable
		// jangan import lagi module-module ini di dalam mjs tersebut
		// karena akan terjadi cyclic redudancy pada saat di rollup
		self.Modules = { 
			groupHeaderList, 
			groupHeaderEdit, 
			groupProgramList, 
			groupProgramEdit, 
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
				groupHeaderList.init(self, args), 
				groupHeaderEdit.init(self, args), 
				groupProgramList.init(self, args), 
				groupProgramEdit.init(self, args), 
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
	
		// Setup Icon
		Crsl.setIconUrl('')


		// Set listener untuk section carousel
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
		
		Crsl.Items['fRecord-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})

		Crsl.Items['fLogs-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})

		Crsl.Items['fAbout-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})
		

		// Set panel detil saat hover di detil item
		const detilpanel = document.getElementById('panel-detil-selector')
		detilpanel.querySelectorAll('.panel-detil-row a').forEach(link => {
			link.addEventListener('mouseenter', () => {
				link.closest('.panel-detil-row').classList.add('panel-detil-row-highligted');
			});

			link.addEventListener('mouseleave', () => {
				link.closest('.panel-detil-row').classList.remove('panel-detil-row-highligted');
			});


			const sectionTargetName = link.getAttribute('data-target-section')
			const sectionCurrentName = link.getAttribute('data-current-section')
			
			link.addEventListener('click', (evt)=>{
				openDetilSection(self, sectionTargetName, sectionCurrentName)
			})

			// jika ada event-event yang khusus untuk mobile device
			// if (Module.isMobileDevice()) {
			// }
		});

		
		// group-ext.mjs, export function extendPage(self) {} 
		const fn_name = 'extendPage'
		const fn_extendPage = Extender[fn_name]
		if (typeof fn_extendPage === 'function') {
			fn_extendPage(self)
		} else {
			console.warn(`'extendPage' tidak diimplementasikan di extender`)
		}

	} catch (err) {
		throw err
	}
}


function openDetilSection(self, sectionTargetName, sectionCurrentName) {
	const sectionCurrentId = Context.Sections[sectionCurrentName]
	const sectionCurrent =   Crsl.Items[sectionCurrentId]

	const sectionId = Context.Sections[sectionTargetName]
	const section = Crsl.Items[sectionId]

	section.setSectionReturn(sectionCurrent)
	section.show({}, ()=>{
		const moduleTarget = self.Modules[sectionTargetName]
		const moduleHeaderEdit = self.Modules[sectionCurrentName]
		moduleTarget.openList(self, {
			moduleHeaderEdit
		})
	})


}