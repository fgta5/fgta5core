const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/rolelevel'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'rolelevel',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		rolelevelHeaderList: 'rolelevelHeaderList-section', 
		rolelevelHeaderEdit: 'rolelevelHeaderEdit-section', 
	},
	SectionMap: { 
		'rolelevelHeaderList-section' : 'rolelevelHeaderList', 
		'rolelevelHeaderEdit-section' : 'rolelevelHeaderEdit', 
	}
}
