import Context from './user-context.mjs'
import * as Extender from './user-ext.mjs'

const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.userPropList
const CurrentSection = Crsl.Items[CurrentSectionId]
const CurrentState = {}

const tbl =  new $fgta5.Gridview('userPropList-tbl')

const btn_addrow = document.getElementById('userPropList-btn_addrow') // tidak perlu pakai action, karna action didefine di edit
const btn_delrow = new $fgta5.ActionButton('userPropList-btn_delrow')

let headerForm

export const Section = CurrentSection


export async function init(self, args) {

	// Back
	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		const sectionId =  Context.Sections.userHeaderEdit
		const section = Crsl.Items[sectionId]
		section.show({direction: 1})
	})


	tbl.addEventListener('nextdata', async evt=>{ tbl_nextdata(self, evt) })
	tbl.addEventListener('sorting', async evt=>{ tbl_sorting(self, evt) })

	// tambahkan event lain di extender: rowrender, rowremoving
	// dapatkan parameternya di evt.detail
	const fn_addTableEvents_name = 'propList_addTableEvents'
	const fn_addTableEvents = Extender[fn_addTableEvents_name]
	if (typeof fn_addTableEvents === 'function') {
		fn_addTableEvents(self, tbl)
	}

	if (Module.isMobileDevice()) {
		tbl.addEventListener('cellclick', async evt=>{ tbl_cellclick(self, evt) })
	} else {
		tbl.addEventListener('celldblclick', async evt=>{ tbl_cellclick(self, evt) })
	}


	btn_delrow.addEventListener('click', (evt)=>{ btn_delrow_click(self, evt) })
	
	// Extend list detil
	const fn_name = 'userPropList_init'
	const fn_userPropList_init = Extender[fn_name]
	if (typeof fn_userPropList_init === 'function') {
		fn_userPropList_init(self)
	}

	CurrentState.headerFormLocked = true 
}

export async function openList(self, params) {
	const moduleHeaderEdit = params.moduleHeaderEdit
	
	headerForm = moduleHeaderEdit.getHeaderForm() 
	const pk = headerForm.getPrimaryInput()
	const id = pk.value 


	// apabila mau menambahkan informasi saat detil list dibuka,
	// misalnya menambahkan informasi beberapa data dari formHeader
	// bisa di set pada Extender.userPropList_openList :  bisa menggunakan template untuk di embed ke header pada detil list
	const fn_name = 'userPropList_openList'
	const fn_userPropList_openList = Extender[fn_name]
	if (typeof fn_userPropList_openList === 'function') {
		fn_userPropList_openList(self, headerForm)
	}
	
	const criteria={
		user_id: id
	}
	const sort = tbl.getSort()

	tbl.clear()
	tbl_loadData(self, {criteria, sort})


	if (CurrentState.headerFormLocked) {
 		btn_addrow.setAttribute('disabled', '')
		btn_delrow.disabled = true
	} else {
		btn_addrow.removeAttribute('disabled')
		btn_delrow.disabled = false
	}
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
	tr.remove()
}

export function selectNextRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.nextElementSibling) {
		openRow(self, tr.nextElementSibling)
	}
}

export function selectPreviousRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.previousElementSibling) {
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

export function headerLocked(self) {
	console.log('header locked')
	CurrentState.headerFormLocked = true 
}

export function headerUnlocked(self) {
	console.log('header unlocked')
	CurrentState.headerFormLocked = false
}


function setCurrentRow(self, tr) {
	CurrentState.SelectedRow = tr
}


async function openRow(self, tr) {
	const keyvalue = tr.getAttribute('keyvalue')
	const key = tr.getAttribute('key')

	const userPropEdit = self.Modules.userPropEdit
	userPropEdit.clearForm(self, 'loading...')

	try {
		setCurrentRow(self, tr)
		CurrentState.SelectedRow.keyValue = keyvalue
		CurrentState.SelectedRow.key = key
		await userPropEdit.openSelectedData(self, {key:key, keyvalue:keyvalue})
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)

		setCurrentRow(self, null)
		CurrentSection.show() // kembalikan ke list kalau error saat buka data
	}

	// matikan atau nyalakan button prev/next sesuai kondisi
	setPagingButton(self, userPropEdit)
}


async function listRows(self, criteria, offset, limit, sort) {
	const url = `/${Context.moduleName}/prop-list`
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


async function deleteRows(self, data) {
	const url = `/${Context.moduleName}/prop-delete-rows`
	try {
		
		const result = await Module.apiCall(url, { data }) 
		if (result.deleted) {
			return true
		} else {
			throw new Error(result.message)
		}	
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

async function tbl_sorting(self, evt) {
	tbl.clear()
	const sort = evt.detail.sort
	const criteria = evt.detail.Criteria
	tbl_loadData(self, {criteria, sort})
}

async function tbl_cellclick(self, evt) {
	const tr = evt.detail.tr

	const userPropEdit = self.Modules.userPropEdit
	userPropEdit.Section.show({}, (evt)=>{
		openRow(self, tr)
	})
}


async function tbl_loadData(self, params={}) {
	const { criteria={}, limit=0, offset=0, sort={} } = params
	
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


async function btn_delrow_click(self, evt) {
	// cek dahulu apakah ada data yang dipilih
	const selected = tbl.getSelected()
	if (selected.length==0) {
		return
	}

	// konfirmasi apakah yakin mau dihapus
	var ret = await $fgta5.MessageBox.confirm(`Apakah anda yakin akan menghappus ${selected.length} data yang dipilih?`)
	if (ret!='ok') {
		return
	}

	let mask = $fgta5.Modal.createMask()
	try {
		const deleted = await deleteRows(self, selected)
		if (deleted) {
			tbl.removeSelected()
		}
	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
	
}
