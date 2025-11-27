import Context from './reportviewer-context.mjs'
const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')


export async function init(self, args) {
	console.log('initializing report ...')

	const pageTitle = 'Report Page'  // judul halaman
	Context.setTitle(pageTitle);  // set judul di browser

}

export function getParams() {
	return {
		date: 'yyyy-mm-dd'
	}
}


export function getReportObjects() {
	return {
		table: reportTable,
		body: reportBody,
		info: reportInfo,
		rowTemplate: rowTemplate
	}
}

export async function loadReport(self, cache_id, mask) {
	reportInfo.innerHTML = `downloading data ${cache_id} ...`;
	mask.setText(reportInfo.innerHTML)


	// siapkan template row report
	const tpl = document.querySelector('template[name="template-report-row"]')
	if (tpl==null) {
		$fgta5.MessageBox.show('template report tidak ditemukan')
		return;
	}
	
	
	// table untuk menampilkan hasil report

	// kosongkan table
	reportBody.innerHTML = ''



	// ambil total Rows
	const totalRows = 125; // dari query ke cache, dapatkan totalRows



	// render records
	const rowLimit = 10  // maksimal 10 baris sekali fetch
	let rowOffset = 0
	let doFetch = true
	let line = 0
	while (doFetch) {
		// eksekusi api, akan menghasilkan rows
		mask.setText(`rendering row ${rowOffset} to ${rowOffset+rowLimit} of <b>${totalRows}</b>`)


		const rows = []
		for (let row of rows) {
			line++
			renderRow(self, tpl, row)	
		}


		rowOffset = rowOffset + line

		// jika rows sudah tidak berisi data, hentikan loop
		if (rows.length==0) {
			doFetch = false
		}
	}


	// proses selesai

	


}


async function renderRow(self, tpl, row) {

}
