var Utils = {
  decode: function(keyCode){
    return String.fromCharCode(keyCode).toLowerCase();
  }
}


function EditorActions(){}

EditorActions.prototype = {
  executeByEvent: function(event){
    var action = this.getBy(event.valueF());
    document.execCommand(action, false, null);
  },

  getBy: function(keyCode){
    switch (Utils.decode(keyCode)) {
      case 'b':
        return "bold";
      case 'i':
        return "italic";
      case 'u':
        return "underline";
    }
  },
}

function Editor($element){
  this.actions = new EditorActions();
  this.getEvents($element);
  this.subscribeEvents();
}

Editor.prototype = {
  getEvents: function($element){
    this.keyDown = $element.asEventStream('keydown');
  },
  subscribeEvents: function(){
    var self = this;
    this.keyStateProperty().subscribe(function(event){
      self.actions.executeByEvent(event);
    })
  },
  keyCodeHaveAction: function() {
    var self = this;
    return function(event) { return !_.isUndefined(self.actions.getBy(event.keyCode)) }
  },
  haveCombinationKey: function(){
    return function(event){ return (event.ctrlKey || event.metaKey) }
  },
  keyDownEvents: function() {
    return this.keyDown.filter(this.haveCombinationKey())
                       .filter(this.keyCodeHaveAction())
  },
  keyStateProperty: function() {
    return this.keyDownEvents().map(function(event) { return event.keyCode })
  }
}

