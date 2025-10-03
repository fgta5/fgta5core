import Context from './role-context.mjs'

export async function init(self, args) {
	console.log('initializing roleExtender ...')

	// tambahkan extender inisiasi module role


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


export function roleHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj_role_name = frm.Inputs['roleHeaderEdit-obj_role_name']
	obj_role_name.disabled = true
}

export async function roleHeaderEdit_newData(self, datainit, frm) {
	const obj_role_name = frm.Inputs['roleHeaderEdit-obj_role_name']
	obj_role_name.disabled = false
}

export async function roleHeaderEdit_dataSaved(self, data, frm) {
	const obj_role_name = frm.Inputs['roleHeaderEdit-obj_role_name']
	obj_role_name.disabled = true
}

