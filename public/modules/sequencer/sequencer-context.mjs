const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/sequencer'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'sequencer',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		sequencerHeaderList: 'sequencerHeaderList-section', 
		sequencerHeaderEdit: 'sequencerHeaderEdit-section', 
	}
}
