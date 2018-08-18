module.exports = function NoFairyResetWaste(dispatch) {	
    
    const FairyId = 271330;
    const ResetDelay = 5000;
    
    let enabled = false,
    hooks = [],
    gameId,
    onCd = false;
    
    dispatch.hook('S_LOGIN', 10, event => {
        gameId = event.gameId;
        enabled = (event.templateId - 10101) % 100 == 7 ? true : false;
        if (enabled) load();
        else unload();
    })
    
    function load()
    {
        if(!hooks.length)
        {            
            hook('C_START_SKILL', 6, { order: -100 }, (event) => {              
                if (event.skill.id === FairyId) {
                    if (onCd) return false;
                }
            });        
            
            hook('S_CREST_MESSAGE', 2, { order: -100 }, (event) => {              
                if (event.skill === FairyId) {
                    onCd = true;
                    setTimeout(()=>{
                        onCd = false;
                    }, ResetDelay);
                }
            });
        }
    }
	
	function unload() {
		if(hooks.length) {
			for(let h of hooks) dispatch.unhook(h)

			hooks = []
		}
	}
    
	function hook() {
		hooks.push(dispatch.hook(...arguments))
	}
    
}
