import Context from './user-context.mjs'
import * as Extender from './user-ext.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


const CurrentState = {}
const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.userFavouriteEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source

const TitleWhenNew = 'New User'
const TitleWhenView = 'View User'
const TitleWhenEdit = 'Edit User'
const EditModeText = 'Edit'
const LockModeText = 'Lock'



const btn_edit = new $fgta5.ActionButton('userFavouriteEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('userFavouriteEdit-btn_save')
const btn_new = new $fgta5.ActionButton('userFavouriteEdit-btn_new', 'userFavourite-addrow')
const btn_del = new $fgta5.ActionButton('userFavouriteEdit-btn_delete', 'userFavourite-delrow')
const btn_reset = new $fgta5.ActionButton('userFavouriteEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('userFavouriteEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('userFavouriteEdit-btn_next')

const btn_recordstatus = document.getElementById('userFavourite-btn_recordstatus')
const btn_logs = document.getElementById('userFavourite-btn_logs')

const frm = new $fgta5.Form('userFavouriteEdit-frm');
const obj_userfavouriteprogram_id = frm.Inputs['userFavouriteEdit-obj_userfavouriteprogram_id']
const obj_program_id = frm.Inputs['userFavouriteEdit-obj_program_id']
const obj_user_id = frm.Inputs['userFavouriteEdit-obj_user_id']	
const obj_createby = document.getElementById('fRecord-section-createby')
const obj_createdate = document.getElementById('fRecord-section-createdate')
const obj_modifyby = document.getElementById('fRecord-section-modifyby')
const obj_modifydate = document.getElementById('fRecord-section-modifydate')

export const Section = CurrentSection


export async function init(self, args) {

	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		backToList(self, evt)
	})

	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });
	frm.render()

	btn_edit.addEventListener('click', (evt)=>{ btn_edit_click(self, evt) })
	btn_save.addEventListener('click', (evt)=>{ btn_save_click(self, evt)  })
	btn_new.addEventListener('click', (evt)=>{ btn_new_click(self, evt) })
	btn_del.addEventListener('click', (evt)=>{ btn_del_click(self, evt) })
	btn_reset.addEventListener('click', (evt)=>{ btn_reset_click(self, evt)})
	btn_prev.addEventListener('click', (evt)=>{ btn_prev_click(self, evt)})
	btn_next.addEventListener('click', (evt)=>{ btn_next_click(self, evt)})
	

	btn_recordstatus.addEventListener('click', evt=>{ btn_recordstatus_click(self, evt) })	
	btn_logs.addEventListener('click', evt=>{ btn_logs_click(self, evt) })	

	CurrentState.headerFormLocked = true 
	CurrentState.editDisabled = false


	
	// Combobox: obj_program_id
	obj_program_id.addEventListener('selecting', async (evt)=>{
		const fn_selecting_name = 'obj_program_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_obj_program_id_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_program_id_selecting(self, obj_program_id, frm, evt)
			fn_obj_program_id_selecting(self, obj_program_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = `${Context.appsUrls.core.url}/program/header-list`
			const criteria = {
				searchtext: searchtext,
			}

			const fn_selecting_criteria_name = 'obj_program_id_selecting_criteria'
			const fn_obj_program_id_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_obj_program_id_selecting_criteria(self, obj_program_id, criteria)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(url, {
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.program_id, row.program_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
		
}


export async function openSelectedData(self, params) {
	console.log('openSelectedData')

	let mask = $fgta5.Modal.createMask()
	try {
		const id = params.keyvalue
		const data = await openData(self, id)

		

		CurrentState.currentOpenedId = id
		
		
		// jika posisi header dalam keadaan unlock (bisa edit, perlu cek kondisi data, untuk menentukan bisa diedit atau tidak)
		if (!CurrentState.headerFormLocked) {
			const fn_iseditdisabled_name = 'userFavouriteEdit_isEditDisabled'
			const fn_iseditdisabled = Extender[fn_iseditdisabled_name]
			if (typeof fn_iseditdisabled === 'function') {
				const editDisabled = fn_iseditdisabled(self, data)
				CurrentState.editDisabled = editDisabled
			}
		}

		// disable primary key
		setPrimaryKeyState(self, {disabled:true})

		frm.setData(data)
		frm.acceptChanges()
		frm.lock()

		const fn_formopened_name = 'userFavouriteEdit_formOpened'
		const fn_formopened = Extender[fn_formopened_name]
		if (typeof fn_formopened === 'function') {
			fn_formopened(self, frm, CurrentState)
		}
	} catch (err) {
		CurrentState.currentOpenedId = null
		throw err
	} finally {
		mask.close()
		mask = null
	}
}

export function getForm(self) {
	return frm
}

export function clearForm(self, text) {
	frm.clear(text)
}

export function headerLocked(self) {
	CurrentState.headerFormLocked = true
	CurrentState.editDisabled = true
	btn_new.disabled = true
}

export function headerUnlocked(self) {
	CurrentState.headerFormLocked = false
	CurrentState.editDisabled = false
	btn_new.disabled = false
}

export function disableNextButton(self, disabled=true) {
	btn_next.disabled = disabled
}

export function disablePrevButton(self, disabled=true) {
	btn_prev.disabled = disabled
}

export function keyboardAction(self, actionName) {
	if (actionName=='save') {
		frm.acceptInput()
		btn_save.click()
	} else if (actionName=='new') {
		frm.acceptInput()
		btn_new.click()
	} else if (actionName=='escape') {
		frm.acceptInput()
		if (frm.isLocked() || frm.isNew()) {
			backToList(self)
		} else {
			btn_edit.click() // untuk lock data
		}
	} else if (actionName=='togleEdit') {
		frm.acceptInput()
		btn_edit.click()
	} else if (actionName=='right') {
		btn_next.click()
	} else if (actionName=='left') {
		btn_prev.click()
	}
}


async function newData(self, datainit) {
	try {
		frm.newData(datainit)
		frm.acceptChanges()
		frm.setAsNewData()
	} catch (err) {
		throw err
	}
}


async function openData(self, id) {
	const url = `/${Context.moduleName}/favourite-open`
	try {
		const result = await Module.apiCall(url, { id }) 
		return result 
	} catch (err) {
		throw err	
	} 	
}

async function createData(self, data, formData) {
	const url = `/${Context.moduleName}/favourite-create`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 	
}

async function updateData(self, data, formData) {
	const url = `/${Context.moduleName}/favourite-update`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 
}

async function deleteData(self, id) {
	const url = `/${Context.moduleName}/favourite-delete`
	try {
		const result = await Module.apiCall(url, { id, source: Source }) 
		return result 
	} catch (err) {
		throw err	
	} 
}


async function backToList(self, evt) {
	// cek apakah ada perubahan data
	let goback = false
	if (frm.isChanged()) {
		// ada perubahan data, konfirmasi apakah mau lanjut back
		var ret = await $fgta5.MessageBox.confirm(Module.BACK_CONFIRM)
		if (ret=='ok') {
			// user melanjutkan back, walaupun data berubah
			// reset dahulu data form
			frm.reset()
			goback = true
		}
	} else {
		goback = true
	}

	if (goback) {
		frm.lock()
		const listId =  Context.Sections.userFavouriteList
		const listSection = Crsl.Items[listId]
		listSection.show({direction: 1})
	}
}


async function  frm_locked(self, evt) {
	console.log('frm_locked')

	CurrentSection.Title = TitleWhenView

	btn_edit.setText(EditModeText)

	//  todo: cek dulu apakah boleh add/remove rows 

	btn_edit.disabled = false
	btn_save.disabled = true
	btn_new.disabled = false
	btn_del.disabled = true
	btn_reset.disabled = true
	btn_prev.disabled = false
	btn_next.disabled = false


	// Extender untuk event locked
	const fn_name = 'userFavouriteEdit_formLocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}	

	// jika heder form dalam kondisi lock,
	// tetap tidak bisa hapus
	if (CurrentState.editDisabled) {
		btn_edit.disabled = true
		btn_new.disabled = true
	} 

}

async function  frm_unlocked(self, evt) {
	console.log('frm_unlocked')

	if (frm.isNew()) {
		CurrentSection.Title = TitleWhenNew

	} else {
		CurrentSection.Title = TitleWhenEdit
	}

	btn_edit.setText(LockModeText)

	btn_edit.disabled = false
	btn_save.disabled = false
	btn_new.disabled = true
	btn_del.disabled = false
	btn_reset.disabled = false
	btn_prev.disabled = true
	btn_next.disabled = true

	// Extender untuk event Unlocked
	const fn_name = 'userFavouriteEdit_formUnlocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm)
	}
}

async function setPrimaryKeyState(self, opt) {
	const obj_pk = frm.getPrimaryInput()
	obj_pk.disabled = opt.disabled===true
	if (opt.placeholder!==undefined) {
		obj_pk.placeholder = opt.placeholder
	}
	if (opt.value!==undefined) {
		obj_pk.value = opt.value
	}
}



async function btn_edit_click(self, evt) {
	console.log('btn_edit_click')

	if (frm.isLocked()) {
		// user mau inlock
		frm.lock(false)
	} else {
		if (frm.isChanged() || frm.isNew()) {
			await $fgta5.MessageBox.warning(Module.EDIT_WARNING)
			return
		}
		frm.lock(true)
	}
}


async function btn_new_click(self, evt) {
	console.log('new')
	const sourceSection = evt.target.getAttribute('data-sectionsource') 

	const userFavouriteList = self.Modules.userFavouriteList
	const listsecid = userFavouriteList.Section.Id
	const fromListSection = sourceSection===listsecid

	if (fromListSection) {
		console.log('tambahkan row baru')
		CurrentSection.setSectionReturn(userFavouriteList.Section)
		await CurrentSection.show()
	} else {
		// klik new dari form
		let cancel_new = false
		if (frm.isChanged()) {
			const ret = await $fgta5.MessageBox.confirm(Module.NEWDATA_CONFIRM)
			if (ret=='cancel') {
				cancel_new = true
			}
		}
		if (cancel_new) {
			return
		}
	}

	if (frm.AutoID) {
		setPrimaryKeyState(self, {disabled:true, placeholder:'[AutoID]'})
	} else {
		setPrimaryKeyState(self, {disabled:false, placeholder:'ID'})
	}
	
	
	try {
	
		// ambil id header
		const userHeaderEdit = self.Modules.userHeaderEdit
		const frmHeader = userHeaderEdit.getHeaderForm()
		const header_pk = frmHeader.getPrimaryInput()
		const user_id = header_pk.value

		// inisiasi data baru
		let datainit = {
			user_id,}


		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, 
		// dapat dibuat di Extender.newData
		const fn_newdata_name = 'userFavouriteEdit_newData'
		const fn_newdata = Extender[fn_newdata_name]
		if (typeof fn_newdata === 'function') {
			await fn_newdata(self, datainit, frm)
		}

		// buat data baru
		await newData(self, datainit)

		// buka lock, agar user bisa edit
		frm.lock(false)

		// matikan tombol edit dan del saat kondisi form adalah data baru 
		btn_edit.disabled = true
		btn_del.disabled = true
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
		if (fromListSection) {
			// jika saat tombol baru dipilih saat di list, tampilan kembalikan ke list
			self.Modules.userFavouriteList.Section.show()
		}
	}
}


async function btn_save_click(self, evt) {
	console.log('btn_save_click')

	// Extender Autofill
	const fn_autofill_name = 'userFavouriteEdit_autofill'
	const fn_autofill = Extender[fn_autofill_name]
	if (typeof fn_autofill === 'function') {
		await fn_autofill(self, frm)
	}

	// cek apakah data valid
	const valid = frm.validate()
	if (!valid) {
		const message = frm.getLastError()
		console.warn(message)
		$fgta5.MessageBox.warning(message)
		return
	}


	// abaikan jika bukan data baru dan tidak ada perubahan
	let dataToSave
	const isNewData = frm.isNew()
	if (!isNewData) {
		// cek dulu apakah ada perubahaan
		if (!frm.isChanged()) {
			// skip save jika tidak ada perubahan data
			console.log('tidak ada perubahan data, skip save')
			return
		} 
		
		// ambil hanya data yang berubah
		dataToSave = frm.getDataChanged()

	} else {

		// untuk posisi data baru, ambil semua data
		dataToSave = frm.getData()		
	}

	
	// bila ada file, upload filenya
	let formData = null
	const files = frm.getFiles()
	if (files!=null) {
		formData = new FormData();
		for (let name in files) {
			const file = files[name]
			formData.append(name, file)
		}
	}


	// Extender Saving
	const fn_datasaving_name = 'userFavouriteEdit_dataSaving'
	const fn_datasaving = Extender[fn_datasaving_name]
	if (typeof fn_datasaving === 'function') {
		await fn_datasaving(self, dataToSave, frm)
	}



	let mask = $fgta5.Modal.createMask()
	try {
		let result

		if (isNewData) {
			result = await createData(self, dataToSave, formData)
		} else {
 			result = await updateData(self, dataToSave, formData)
		}

		console.log('result', result)
		const obj_pk = frm.getPrimaryInput()
		const pk = obj_pk.getBindingData()
		const idValue = result[pk]

		console.log(`get data id ${idValue}`)
		const data = await openData(self, idValue)
		console.log('data', data)

		

		CurrentState.currentOpenedId = idValue

		if (frm.AutoID) {
			console.log('update field ID di form')
			obj_pk.value = idValue
		} else {
			// jika bukan autoID, kunci field PK menjadi disabled
			setPrimaryKeyState(self, {disabled:true})

		}

		// update form
		frm.setData(data)	


		// Extender Saving
		const fn_datasaved_name = 'userFavouriteEdit_dataSaved'
		const fn_datasaved = Extender[fn_datasaved_name]
		if (typeof fn_datasaved === 'function') {
			await fn_datasaved(self, data, frm)
		}


		// persist perubahan di form
		frm.acceptChanges()


		if (isNewData) {
			// saat new data, posisi button toggle edit akan disabled
			// setelah berhasil save, nyalakan button edit (untuk lock)
			btn_edit.disabled = false

			// buat baris baru di grid
			console.log('tamabah baris baru di grid')
			self.Modules.userFavouriteList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.userFavouriteList.updateCurrentRow(self, data)
		}

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}

async function btn_del_click(self, evt) {
	console.log('btn_del_click')

	// jika data masih dalam kondisi baru (belum di save, 
	// perintah delete harus dibatalkan, 
	// karena belum ada data di database)
	const isNewData = frm.isNew()
	if (isNewData) {
		console.log('posisi data baru, skip delete')
		return
	}

	const obj_pk = frm.getPrimaryInput()
	const idValue = obj_pk.value

	// konfirmasi untuk delete data
	const resp = await $fgta5.MessageBox.confirm(Module.DELETE_CONFIRM + `id: ${idValue}`)
	if (resp!='ok') {
		return
	}

	console.log('delete data')
	let mask = $fgta5.Modal.createMask()
	try {
		const result = await deleteData(self, idValue)
		
		// hapus current row yang dipilih di list
		self.Modules.userFavouriteList.removeCurrentRow(self)
		
		// kembali ke list
		self.Modules.userFavouriteList.Section.show()


		// lock kembali form
		frm.lock()

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}

async function btn_reset_click(self, evt) {
	console.log('btn_reset_click')

	const isNewData = frm.isNew()
	if (isNewData) {
		// untuk data baru, di reset berarti sama seperti membuat data baru
		console.log('reset: buat data baru')
		newData(self)
	} else {
		if (frm.isChanged()) {
			// ada perubahan data, tampilkan konfirmasi perubahan data
			var resp = await $fgta5.MessageBox.confirm(Module.RESET_CONFIRM)
			if (resp!='ok') {
				// user klik tombil cancel
				console.log('cancel reset')
				return
			}
			console.log('reset form')
			frm.reset()
		} else {
			console.log('tidak ada perubahan data, reset data tidak dieksekusi')
		}
	}
}


async function btn_prev_click(self, evt) {
	console.log('btn_prev_click')
	self.Modules.userFavouriteList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.userFavouriteList.selectNextRow(self)
}



async function btn_recordstatus_click(self, evt) {
	console.log('btn_recordstatus_click')
	const params = {
		Context,
		sectionReturn: CurrentSection
	}
	
	pageHelper.openSection(self, 'fRecord-section', params, async ()=>{

		let mask = $fgta5.Modal.createMask()
		try {
			// ambil data
			const pk = frm.getPrimaryInput()
			const id = pk.value
			const data = await openData(self, id)

			obj_createby.innerHTML = data._createby
			obj_createdate.innerHTML = data._createdate
			obj_modifyby.innerHTML = data._modifyby
			obj_modifydate.innerHTML = data._modifydate


			// jika mau menambah beberapa informasi mengenai record,
			// misalnya commit by, postby, dll
			// melalui extender userFavouriteEdit_addRecordInfo
			const fn_addrecordinfo_name = 'userFavouriteEdit_addRecordInfo'
			const fn_addrecordinfo = Extender[fn_addrecordinfo_name]
			if (typeof fn_addrecordinfo === 'function') {
				await fn_addrecordinfo(self,  data)
			}

		} catch (err) {
			console.error(err)
			$fgta5.MessageBox.error(err.message)
		} finally {
			mask.close()
			mask = null
		}
	})

}

async function btn_logs_click(self, evt) {
	const params = {
		Context,
		sectionReturn: CurrentSection
	}

	pageHelper.openSection(self, 'fLogs-section', params, async ()=>{
		// get log data
		const pk = frm.getPrimaryInput()
		const id = pk.value


		let mask = $fgta5.Modal.createMask()
		try {

			const url = `${Context.appsUrls.core.url}/logs/list`
			const criteria = {
				module: Context.moduleName,
				table: 'core.userfavouriteprogram',
				id: id
			}

			const result = await Module.apiCall(url, {  
				criteria
			}) 

			const sc = document.getElementById('fLogs-section')
			const tbody = sc.querySelector('tbody')
			pageHelper.renderLog(tbody, result.data)
		} catch (err) {
			console.error(err)
			$fgta5.MessageBox.error(err.message)
		} finally {
			mask.close()
			mask = null
		}

	})
}