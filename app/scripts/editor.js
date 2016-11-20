var Utils = {
  decode: function(keyCode){
    return String.fromCharCode(keyCode).toLowerCase();
  },
  isImage: function(type){
    return /image\/(jpe?g|png|gif|bmp)$/i.test(type);
  }

}

function EditorActions(){}

EditorActions.prototype = {
  insertTextEffect: function(event){
    var action = this.getBy(event.keyCode);
    event.preventDefault();
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
  insertHtml: function(html){
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        document.execCommand('insertHTML',false,html);
      }
    }
  },
  insertImage: function(file){
    var self = this,
        reader = new FileReader();
    reader.onload = function (event) {
      /*** The string interpolation wont be used to avoid the issue 448 on uglifyjs
        * Issue: https://github.com/mishoo/UglifyJS2/issues/448 ***/
      self.insertHtml('<img src="'+event.target.result+'">')
    }
    reader.readAsDataURL(file);
  }
}

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

