const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/sitetype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'sitetype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		sitetypeHeaderList: 'sitetypeHeaderList-section', 
		sitetypeHeaderEdit: 'sitetypeHeaderEdit-section', 
	}
}
