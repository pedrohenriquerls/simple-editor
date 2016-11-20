var Utils = {
  decode: function(keyCode){
    return String.fromCharCode(keyCode).toLowerCase();
  },
  isImage: function(type){
    return /image\/(jpe?g|png|gif|bmp)$/i.test(type);
  }
}
