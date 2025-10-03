import Context from './programgroup-context.mjs'

export async function init(self, args) {
	console.log('initializing programgroupExtender ...')

	// tambahkan extender inisiasi module programgroup


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



export function obj_programgroup_parent_selecting_criteria(self, obj, criteria) {
	// hanya yang parent akan dimunculkan
	criteria.programgroup_isparent = true
	criteria.exclude_self = obj.value
}


export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', async evt=>{ tbl_headerListRowRender(self, evt) })
}

function tbl_headerListRowRender(self, evt) {
	const tr = evt.detail.tr
	const td_level =  tr.querySelector('td[data-name="programgroup_level"]')
	const td_name = tr.querySelector('td[data-name="programgroup_name"]')
	
	const level = Number(td_level.getAttribute('data-value'))
	console.log(`${td_name.innerHTML} ${level}`)
	if (level>1) {
		const paddingLeft = (level-1) * 30
		td_name.style.paddingLeft = `${paddingLeft}px`
	}

}