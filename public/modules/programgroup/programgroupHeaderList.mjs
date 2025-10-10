import Context from './programgroup-context.mjs'
import * as Extender from './programgroup-ext.mjs'


const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.programgroupHeaderList
const CurrentSection = Crsl.Items[CurrentSectionId]
const CurrentState = {}

const tbl =  new $fgta5.Gridview('programgroupHeaderList-tbl')
const pnl_search = document.getElementById('programgroupHeaderList-pnl_search')
const btn_gridload = new $fgta5.ActionButton('programgroupHeaderList-btn_gridload') 

export const Section = CurrentSection
export const SearchParams = {}

export async function init(self, args) {
	console.log('initializing programgroupHeaderList ...')

	// add event listener
	tbl.addEventListener('nextdata', async evt=>{ tbl_nextdata(self, evt) })
	tbl.addEventListener('sorting', async evt=>{ tbl_sorting(self, evt) })


	// tambahkan event lain di extender: rowrender, rowremoving
	// dapatkan parameternya di evt.detail
	const fn_addTableEvents_name = 'headerList_addTableEvents'
	const fn_addTableEvents = Extender[fn_addTableEvents_name]
	if (typeof fn_addTableEvents === 'function') {
		fn_addTableEvents(self, tbl)
	}

	if (Module.isMobileDevice()) {
		tbl.addEventListener('cellclick', async evt=>{ tbl_cellclick(self, evt) })
	} else {
		tbl.addEventListener('celldblclick', async evt=>{ tbl_cellclick(self, evt) })
	}

	btn_gridload.addEventListener('click', async evt=>{ btn_gridload_click(self, evt) })
	

	try {
		// extract custom search panel from template
		const tplSearchPanel = document.querySelector('template[name="custom-search-panel"]')
		if (tplSearchPanel!=null) {
			const clone = tplSearchPanel.content.cloneNode(true); // salin isi template
			pnl_search.prepend(clone)
		}
		
		// setup search panel
		const cmps = pnl_search.querySelectorAll('[fgta5-component][binding]')
		for (var cmp of cmps) {
			var id = cmp.getAttribute('id')
			var componentname = cmp.getAttribute('fgta5-component')
			var binding = cmp.getAttribute('binding')
			SearchParams[binding] =  new $fgta5[componentname](id)
		}

		// programgroupHeaderList-ext.mjs, export function initSearchParams(self, SearchParams) {} 
		const fn_initSearchParams_name = 'headerList_initSearchParams'
		const fn_initSearchParams = Extender[fn_initSearchParams_name]
		if (typeof fn_initSearchParams === 'function') {
			fn_initSearchParams(self, SearchParams)
		} else {
			console.warn(`'initSearchParams' tidak diimplementasikan di extender`)
		}
		
	} catch (err) {
		throw err
	} finally {
		// load data
		if (args.autoLoadGridData===true) {
			loadData(self)
		}
	}


}

export async function loadData(self) {
	await tbl.clear()
	tbl_loadData(self)
}


export function getGrid(self) {
	return tbl
}

export function getCurrentRow(self) {
	return CurrentState.SelectedRow
}

export function addNewRow(self, data) {
	const tr = tbl.addRow(data)
	setCurrentRow(self, tr)
}

export function updateCurrentRow(self, data) {
	const tr = CurrentState.SelectedRow

	try {
		tbl.updateRow(tr, data)
	} catch (err) {
		throw err
	}
}

export function removeCurrentRow(self) {
	const tr = CurrentState.SelectedRow
	tbl.removeRow(tr)
}

export function selectNextRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.nextElementSibling) {
		tbl.CurrentRow = tr.nextElementSibling
		openRow(self, tr.nextElementSibling)
	}
}

export function selectPreviousRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.previousElementSibling) {
		tbl.CurrentRow = tr.previousElementSibling
		openRow(self, tr.previousElementSibling)
	}
}


export function setPagingButton(self,  editModule) {
	const tr = CurrentState.SelectedRow
	
	if (tr.previousElementSibling) {
		editModule.disablePrevButton(self, false)
	} else {
		editModule.disablePrevButton(self, true)
	}

	if (tr.nextElementSibling) {
		editModule.disableNextButton(self, false)
	} else {
		editModule.disableNextButton(self, true)
	}

}

export function keyboardAction(self, actionName) {
	if (actionName=='up') {
		tbl.previousRecord()
	} else if (actionName=='down') {
		tbl.nextRecord()
	} else if (actionName=='enter') {
		const programgroupHeaderEdit = self.Modules.programgroupHeaderEdit
		programgroupHeaderEdit.Section.show({}, (evt)=>{
			openRow(self, tbl.CurrentRow)
		})		
	}
}


function setCurrentRow(self, tr) {
	CurrentState.SelectedRow = tr
}

async function openRow(self, tr) {
	const keyvalue = tr.getAttribute('keyvalue')
	const key = tr.getAttribute('key')

	const programgroupHeaderEdit = self.Modules.programgroupHeaderEdit
	programgroupHeaderEdit.clearForm(self, 'loading...')

	try {
		setCurrentRow(self, tr)
		CurrentState.SelectedRow.keyValue = keyvalue
		CurrentState.SelectedRow.key = key
		await programgroupHeaderEdit.openSelectedData(self, {key:key, keyvalue:keyvalue})
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)

		setCurrentRow(self, null)
		CurrentSection.show() // kembalikan ke list kalau error saat buka data
	}


	// matikan atau nyalakan button prev/next sesuai kondisi
	setPagingButton(self, programgroupHeaderEdit)
}

async function listRows(self, criteria, offset,limit, sort) {
	const url = `/${Context.moduleName}/header-list`
	try {
		const columns = []
		const result = await Module.apiCall(url, {  
			columns,
			criteria,
			offset,
			limit,
			sort
		}) 
		return result 
	} catch (err) {
		throw err	
	} 
}

async function tbl_nextdata(self, evt) {
	const criteria = evt.detail.criteria
	const limit = evt.detail.limit
	const offset = evt.detail.nextoffset
	const sort = evt.detail.sort

	await tbl_loadData(self, {criteria, limit, offset, sort})
	tbl.scrollToFooter()
}

function tbl_sorting(self, evt) {
	tbl.clear()
	const sort = evt.detail.sort
	const criteria = evt.detail.Criteria
	tbl_loadData(self, {criteria, sort})
}

function tbl_cellclick(self, evt) {
	const tr = evt.detail.tr

	const programgroupHeaderEdit = self.Modules.programgroupHeaderEdit
	programgroupHeaderEdit.Section.show({}, (evt)=>{
		openRow(self, tr)
	})

	
}

async function tbl_loadData(self, params={}) {
	console.log('loading programgroupHeader data')
	console.log(params)

	const { criteria={}, limit=0, offset=0, sort={} } = params

	// isi criteria
	for (var key in SearchParams) {
		var cmp = SearchParams[key]
		var valid = cmp.validate()
		if (!valid) {
			console.error('ada yang belum diisi')
			return false
		}
		criteria[key] = SearchParams[key].value
	}


	// cek sorting
	if (sort===undefined) {
		sort = tbl.getSort()
	}

	
	let mask = $fgta5.Modal.createMask()
	try {
		const result = await listRows(self, criteria, offset,limit, sort)

		if (offset===0) {
			tbl.clear()
		}
		tbl.addRows(result.data)
		tbl.setNext(result.nextoffset, result.limit)
	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
	
}

function btn_gridload_click(self, evt) {
	setCurrentRow(self, null)
	loadData(self)
}