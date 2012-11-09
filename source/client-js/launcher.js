require(["dojo/ready", "kk/models/mainModel", "kk/views/mainView", "kk/controllers/dndController"],
    function(ready, mainModel, mainView, dndController){
        ready(function(){
        	var mainModelO 	= new mainModel();
        	var mainViewO 	= new mainView();
        	new dndController({'mainModel': mainModelO, 'mainView':mainViewO});
        });
    });