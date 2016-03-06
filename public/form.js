  $("#addField").on('click', function(){

  var inputCount = $('.input-field').size()
  var formGroup = $('.form-group')

    $("<div class='input-field col s12'>" +
      "<input name='poll[response]' id='choice"+ inputCount +" type='text' placeholder='Response " + inputCount +" 'class='form-control'>" +
    "</div>"
     ).appendTo(formGroup)
     return false
  })
