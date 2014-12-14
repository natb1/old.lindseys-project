exports.get_all_text = function(elements){
  return elements.map(function(element){
    return element.getText()
  });
}
