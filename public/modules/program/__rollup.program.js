import terser from '@rollup/plugin-terser';

const currentdate = (new Date()).toISOString().split('T')[0]
const banner = `program
*
* build at ${currentdate}
`

// untuk eksekusi npx
// npx rollup -c ./public/modules/program/__rollup-program.js

export default {
	input: "public/modules/program/program.mjs", // File utama yang menjadi entry point
	output: {
		file: `public/modules/program/program.min.mjs`, // Lokasi output file hasil bundle
		format: "esm", // Format modul ECMAScript
		banner: `/*! ${banner}*/`,
		manualChunks: (id) => {
			console.log('Chunking:', id);
			if (id.includes('module.mjs')) return null;
		}
	},
	external: (id) => {
 		return id.includes('module.mjs') || id === '$fgta5';
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

