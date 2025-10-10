import Context from './program-context.mjs'

export async function init(self, args) {
	console.log('initializing programExtender ...')

	// tambahkan extender inisiasi module program
}


export function obj_programgroup_id_populating(self, obj_programgroup_id, frm, evt) {
	const { tr, data } = evt.detail

	const td = tr.querySelector('td')
	const programgroup_level = data.programgroup_level

	td.style.paddingLeft = `${programgroup_level*15}px`

}