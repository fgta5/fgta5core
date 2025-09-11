const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/directory'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'directory',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		directoryHeaderList: 'directoryHeaderList-section', 
		directoryHeaderEdit: 'directoryHeaderEdit-section', 
	}
}
