sap.ui.controller("view.Main", {

	onInit : function(oEvent){
		this._oSprite = this.getView().byId("idAnimatedSprite");
	},

	onSpritePress : function(oEvent) {
	},
	
	animationStarted : function(oEvent) {
		console.log("animationStarted");
	},
	animationFinished : function(oEvent) {
		console.log("animationFinished");
	},
	
	onPlay : function(){
		this._playAnimation(0, 10);
	},
	
	onStop : function(){
		this._oSprite.stopAnimation();
	},
	
	onRepeat : function(oEvent){
		var bRepeat = oEvent.getParameter('selected');
		this._oSprite.setRepeat(bRepeat);
	},
	
	onPlay1 : function(){
		this._playAnimation(0, 1);
	},
	
	onPlay2 : function(){
		this._playAnimation(1, 1);
	},
	
	onPlay3 : function(){
		this._playAnimation(2, 1);
	},
	
	onPlay4 : function(){
		this._playAnimation(3, 1);
	},
	
	_playAnimation : function(iStartY, iStepY){
		this._oSprite.stopAnimation();
		this._oSprite.setStartY(iStartY);
		this._oSprite.setStepsY(iStepY);
		this._oSprite.startAnimation();
	},
	
	

});