const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/approval'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'approval',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		approvalHeaderList: 'approvalHeaderList-section', 
		approvalHeaderEdit: 'approvalHeaderEdit-section', 
	},
	SectionMap: { 
		'approvalHeaderList-section' : 'approvalHeaderList', 
		'approvalHeaderEdit-section' : 'approvalHeaderEdit', 
	}
}
