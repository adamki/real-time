$("#addField").on('click', function(){
var inputCount = $('.input-field').size()
var textGroup = ('#text-input')
  $("<div class='input-field col s12'>" +
    "<input name='poll[responses][]' id='choice"+ inputCount +" type='text' placeholder='Response " + inputCount +" 'class='form-control'>" +
  "</div>"
   ).appendTo(textGroup)
   return false
})
