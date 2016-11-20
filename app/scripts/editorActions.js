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
