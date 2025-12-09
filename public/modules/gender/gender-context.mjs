const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/gender'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'gender',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		genderHeaderList: 'genderHeaderList-section', 
		genderHeaderEdit: 'genderHeaderEdit-section', 
	},
	SectionMap: { 
		'genderHeaderList-section' : 'genderHeaderList', 
		'genderHeaderEdit-section' : 'genderHeaderEdit', 
	}
}
