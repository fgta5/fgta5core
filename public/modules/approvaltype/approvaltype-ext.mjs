import Context from './approvaltype-context.mjs'

const elRoleEditHeadTitle = document.getElementById('approvaltypeRoleEdit-head-title')
const elRoleListHeadTitle = document.getElementById('approvaltypeRoleList-head-title')



export async function init(self, args) {
	console.log('initializing approvaltypeExtender ...')

	// tambahkan extender inisiasi module approvaltype


	/* // contoh menambahkan content dari template extender
	{
		const target = secRec.querySelector('#fRecord-section div[name="column"][exteder]')
		const tpl = document.getElementById('tpl-record-panel')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			target.prepend(clone)
		}
	}
	*/	


	
	/* // contoh menambahkan custom validator
	// pada html, tambahkan validator="cobaFunction:paramValue"
	const frm = self.Modules.coaHeaderEdit.getHeaderForm()
	const obj_coa_normal = frm.Inputs['coaHeaderEdit-obj_coa_normal']
	$validators.addCustomValidator('cobaFunction', (v, param)=>{
	 	console.log(v)
	 	setTimeout(()=>{
	 		obj_coa_normal.setError('ini error')
	 	}, 500)
	})	


	*/


}


// approvaltyperole_order

export function roleList_dataLoad(self, criteria, sort, evt) {
	sort.approvaltyperole_order = 'asc'
}






export function approvaltypeRoleList_openList(self, headerForm) {
	const title = headerForm.Inputs['approvaltypeHeaderEdit-obj_approvaltype_name'].value;
	elRoleEditHeadTitle.innerHTML = title
	elRoleListHeadTitle.innerHTML = title
}

