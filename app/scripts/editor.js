function Editor($element){
  this.getEvents($element);
}
actions = {'66': 'teset'}


Editor.prototype = {
  getEvents: function($element){
    this.keyDown = $element.asEventStream('keydown');
    this.click = $element.asEventStream('click');
    this.subscribeEvents();
  },
  subscribeEvents: function(){
    this.keyStateProperty(66).subscribe(function(x, y){ console.log(x, x.valueF()); console.log(x.once)})
  },
  action: function(name) { return actions[name] },
  keyCodeIs: function(keyCode) {
    return function(event) { return event.keyCode == keyCode }
  },
  haveCombinationKey: function(){
    return function(event){ return (event.ctrlKey || event.metaKey) }
  },
  keyDownEvents: function(keyCode) {
    return this.keyDown.filter(this.haveCombinationKey())
                       .filter(this.keyCodeIs(keyCode))
  },
  keyStateProperty: function(keyCode) {
    return this.keyDownEvents(keyCode).map(this.action(keyCode))
  }
}
