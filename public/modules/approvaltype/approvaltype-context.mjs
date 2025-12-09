const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/approvaltype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'approvaltype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		approvaltypeHeaderList: 'approvaltypeHeaderList-section', 
		approvaltypeHeaderEdit: 'approvaltypeHeaderEdit-section', 
		approvaltypeRoleList: 'approvaltypeRoleList-section', 
		approvaltypeRoleEdit: 'approvaltypeRoleEdit-section', 
	},
	SectionMap: { 
		'approvaltypeHeaderList-section' : 'approvaltypeHeaderList', 
		'approvaltypeHeaderEdit-section' : 'approvaltypeHeaderEdit', 
		'approvaltypeRoleList-section' : 'approvaltypeRoleList', 
		'approvaltypeRoleEdit-section' : 'approvaltypeRoleEdit', 
	}
}
