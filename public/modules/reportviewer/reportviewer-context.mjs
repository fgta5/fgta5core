const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/reportviewer'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'reportviewer',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: {
		reportviewerMain: 'reportviewerMain-section',
	},
	SectionMap: {
		'reportviewerMain-section' : 'reportviewerMain',
	}
}