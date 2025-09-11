import Context from './sitetype-context.mjs'
import * as Extender from './sitetype-ext.mjs'


const CurrentState = {}
const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.sitetypeHeaderEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source


const TitleWhenNew = 'New Site Type'
const TitleWhenView = 'View Site Type'
const TitleWhenEdit = 'Edit Site Type'
const EditModeText = 'Edit'
const LockModeText = 'Lock'

const btn_edit = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_save')
const btn_new = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_new', 'sitetypeHeader-new')
const btn_del = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_delete')
const btn_reset = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('sitetypeHeaderEdit-btn_next')

const frm = new $fgta5.Form('sitetypeHeaderEdit-frm');
const obj_sitetype_id = frm.Inputs['sitetypeHeaderEdit-obj_sitetype_id']
const obj_sitetype_name = frm.Inputs['sitetypeHeaderEdit-obj_sitetype_name']
const obj_sitetype_descr = frm.Inputs['sitetypeHeaderEdit-obj_sitetype_descr']	


export const Section = CurrentSection

export async function init(self, args) {
	console.log('initializing sitetypeHeaderEdit ...')
	

	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		backToList(self, evt)
	})

	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });
	frm.render()

	btn_edit.addEventListener('click', (evt)=>{ btn_edit_click(self, evt) })
	btn_save.addEventListener('click', (evt)=>{ btn_save_click(self, evt)  })
	btn_new.addEventListener('click', (evt)=>{ btn_new_click(self, evt)})
	btn_del.addEventListener('click', (evt)=>{ btn_del_click(self, evt)})
	btn_reset.addEventListener('click', (evt)=>{ btn_reset_click(self, evt)})
	btn_prev.addEventListener('click', (evt)=>{ btn_prev_click(self, evt)})
	btn_next.addEventListener('click', (evt)=>{ btn_next_click(self, evt)})


	// addEventListener
		
	
}



export async function render(self) {
	console.log('sitetypeHeaderEdit render')
}


export async function openSelectedData(self, params) {
	console.log('openSelectedData')

	let mask = $fgta5.Modal.createMask()
	try {
		const id = params.keyvalue
		const data = await openData(self, id)

		// disable primary key
		setPrimaryKeyState(self, {disabled:true})

		frm.setData(data)
		frm.acceptChanges()
		frm.lock()
	} catch (err) {
		throw err
	} finally {
		mask.close()
		mask = null
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
	CurrentState.currentOpenedId = id

	const url = `/${Context.moduleName}/header-open`
	try {
		const result = await Module.apiCall(url, { id }) 
		return result 
	} catch (err) {
		CurrentState.currentOpenedId = null
		throw err	
	} 	
}

async function createData(self, data) {
	const url = `/${Context.moduleName}/header-create`
	try {
		const result = await Module.apiCall(url, { data, source: Source }) 
		return result 
	} catch (err) {
		throw err	
	} 	
}


async function updateData(self, data) {
	const url = `/${Context.moduleName}/header-update`
	try {
		const result = await Module.apiCall(url, { data, source: Source }) 
		return result 
	} catch (err) {
		throw err	
	} 
}


async function deleteData(self, id) {
	const url = `/${Context.moduleName}/header-delete`
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
		evt.detail.fn_ShowNextSection()
	}
}

async function  frm_locked(self, evt) {
	console.log('frm_locked')

	CurrentSection.Title = TitleWhenView

	btn_edit.setText(EditModeText)

	btn_edit.disabled = false
	btn_save.disabled = true
	btn_new.disabled = false
	btn_del.disabled = true
	btn_reset.disabled = true
	btn_prev.disabled = false
	btn_next.disabled = false

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
	console.log('btn_new_click')
	const sourceSection = evt.target.getAttribute('data-sectionsource') 

	const sitetypeHeaderList = self.Modules.sitetypeHeaderList
	const listsecid = sitetypeHeaderList.Section.Id
	const fromListSection = sourceSection===listsecid
	if (fromListSection) {
		// klik new dari list (tidak perlu cek ada perubahan data)
		// tampilkan dulu form
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

		let datainit = {}
		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, dapat dibuat di Extender.newData
		if (typeof Extender.newData === 'function') {
			datainit = await Extender.newData(self)
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
			self.Modules.sitetypeHeaderList.Section.show()
		}
	}
}

async function btn_save_click(self, evt) {
	console.log('btn_save_click')

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

	try {
		let result

		if (isNewData) {
			result = await createData(self, dataToSave)
		} else {
 			result = await updateData(self, dataToSave)
		}

		console.log('result', result)
		const obj_pk = frm.getPrimaryInput()
		const pk = obj_pk.getBindingData()
		const idValue = result[pk]

		console.log(`get data id ${idValue}`)
		const data = await openData(self, idValue)
		console.log('data', data)

		if (frm.AutoID) {
			console.log('update field ID di form')
			obj_pk.value = idValue
		} else {
			// jika bukan autoID, kunci field PK menjadi disabled
			setPrimaryKeyState(self, {disabled:true})

		}

		// update form
		frm.setData(data)	


		// persist perubahan di form
		frm.acceptChanges()


		if (isNewData) {
			// saat new data, posisi button toggle edit akan disabled
			// setelah berhasil save, nyalakan button edit (untuk lock)
			btn_edit.disabled = false

			// buat baris baru di grid
			console.log('tamabah baris baru di grid')
			self.Modules.sitetypeHeaderList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.sitetypeHeaderList.updateCurrentRow(self, data)
		}

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
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
	try {
		const result = await deleteData(self, idValue)
		
		// hapus current row yang dipilih di list
		self.Modules.sitetypeHeaderList.removeCurrentRow(self)
		
		// kembali ke list
		self.Modules.sitetypeHeaderList.Section.show()


		// lock kembali form
		frm.lock()

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
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
	self.Modules.sitetypeHeaderList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.sitetypeHeaderList.selectNextRow(self)
}


