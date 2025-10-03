import terser from '@rollup/plugin-terser';

const currentdate = (new Date()).toISOString().split('T')[0]
const banner = `programgroup
*
* build at ${currentdate}
`

// untuk eksekusi npx
// npx rollup -c ./public/modules/programgroup/__rollup.programgroup.js

export default {
	input: "public/modules/programgroup/programgroup.mjs", // File utama yang menjadi entry point
	output: {
		file: `public/modules/programgroup/programgroup.min.mjs`, // Lokasi output file hasil bundle
		format: "esm", // Format modul ECMAScript
		banner: `/*! ${banner}*/`,
		// manualChunks: (id) => {
		// 	console.log('Chunking:', id);
		// 	if (id.includes('module.mjs')  || id.includes('-ext.mjs') || id.includes('public/libs/webmodule')) return null;
		// }
	},
	external: (id) => {
 		return id.includes('module.mjs') || id === '$fgta5' || id.includes('public/libs/webmodule');
	},
	
	preserveEntrySignatures: 'strict',

    plugins: [
		terser({
			compress: {
				pure_funcs: ['console.log', 'console.warn'] // hanya log dan warn dihilangkan, sedangkan error tidak
				// drop_console: true // hapus console
			}
		})
	]
}

