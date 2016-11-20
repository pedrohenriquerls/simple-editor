function Editor($element){
  $element.focus();
  this.actions = new EditorActions();
  this.setEvents($element);
  this.subscribeEvents();
}

Editor.prototype = {
  setEvents: function($element){
    this.keyDown = $element.asEventStream('keydown');
    this.drop = $element.asEventStream('drop');
  },
  subscribeEvents: function(){
    this.keyStateProperty().assign(this.actions, "insertTextEffect");
    this.dropStateProperty().assign(this.actions, "insertImage")
  },
  getFile: function(){
    return function(event){
      event.preventDefault();
      return event.dataTransfer.files[0];
    }
  },
  haveValidFileType: function(){
    return function(file){ return Utils.isImage(file.type); }
  },
  dropEvents: function(){
    $.event.addProp('dataTransfer');
    return this.drop.map(this.getFile())
                    .filter(this.haveValidFileType());
  },
  dropStateProperty: function(){
    return this.dropEvents().toProperty();
  },
  keyCodeHaveAction: function() {
    var self = this;
    return function(event) { return !_.isUndefined(self.actions.getBy(event.keyCode)); }
  },
  haveCombinationKey: function(){
    return function(event){ return (event.ctrlKey || event.metaKey); }
  },
  keyDownEvents: function() {
    return this.keyDown.filter(this.haveCombinationKey())
                       .filter(this.keyCodeHaveAction());
  },
  keyStateProperty: function() {
    return this.keyDownEvents().toProperty();
  },
}

