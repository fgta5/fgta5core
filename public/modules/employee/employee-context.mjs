const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/employee'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'employee',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		employeeHeaderList: 'employeeHeaderList-section', 
		employeeHeaderEdit: 'employeeHeaderEdit-section', 
	}
}
