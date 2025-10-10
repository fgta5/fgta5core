const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/role'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'role',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		roleHeaderList: 'roleHeaderList-section', 
		roleHeaderEdit: 'roleHeaderEdit-section', 
	},
	SectionMap: { 
		'roleHeaderList-section' : 'roleHeaderList', 
		'roleHeaderEdit-section' : 'roleHeaderEdit', 
	}
}
