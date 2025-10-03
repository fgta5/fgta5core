const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/user'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'user',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		userHeaderList: 'userHeaderList-section', 
		userHeaderEdit: 'userHeaderEdit-section', 
		userLoginList: 'userLoginList-section', 
		userLoginEdit: 'userLoginEdit-section', 
		userPropList: 'userPropList-section', 
		userPropEdit: 'userPropEdit-section', 
		userGroupList: 'userGroupList-section', 
		userGroupEdit: 'userGroupEdit-section', 
	}
}
