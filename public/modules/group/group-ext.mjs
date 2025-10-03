import Context from './group-context.mjs'

export async function init(self, args) {
	console.log('initializing groupExtender ...')

	// tambahkan extender inisiasi module group


	/* // contoh menambahkan content dari template extender
	{
		const target = secRec.querySelector('#fRecord-section div[name="column"][exteder]')
		const tpl = document.querySelector('template[name="record-panel"]')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			target.prepend(clone)
		}
	}
	*/	
}




export function groupHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj_group_name = frm.Inputs['groupHeaderEdit-obj_group_name']
	obj_group_name.disabled = true
}

export async function groupHeaderEdit_newData(self, datainit, frm) {
	const obj_group_name = frm.Inputs['groupHeaderEdit-obj_group_name']
	obj_group_name.disabled = false
}

export async function groupHeaderEdit_dataSaved(self, data, frm) {
	const obj_group_name = frm.Inputs['groupHeaderEdit-obj_group_name']
	obj_group_name.disabled = true
}