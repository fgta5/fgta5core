const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/approvalsigntype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'approvalsigntype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		approvalsigntypeHeaderList: 'approvalsigntypeHeaderList-section', 
		approvalsigntypeHeaderEdit: 'approvalsigntypeHeaderEdit-section', 
	},
	SectionMap: { 
		'approvalsigntypeHeaderList-section' : 'approvalsigntypeHeaderList', 
		'approvalsigntypeHeaderEdit-section' : 'approvalsigntypeHeaderEdit', 
	}
}
