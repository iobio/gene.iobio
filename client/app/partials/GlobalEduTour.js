global.onTour1Check = function(checkbox) {
  var answer   = { "jimmy": true, "bobby": false, "sarah": true};
  var name     = checkbox[0].id;
  var checked  = checkbox[0].checked
  var answerLabel = $('#' + name + "-answer");
  // If the correct answer is "true"
  if (answer[name] == true) {
    if (answer[name] == checked) {
      answerLabel.css("visibility", "visible");
    } else {
      answerLabel.css("visibility", "hidden");
    }
  } else {
    if (answer[name] == checked) {
      answerLabel.css("visibility", "hidden");
    } else {
      answerLabel.css("visibility", "visible");
    }

  }
  if ($('#jimmy')[0].checked == answer['jimmy']
    && $('#bobby')[0].checked == answer['bobby']
    && $('#sarah')[0].checked == answer['sarah']) {
    //me.eduTour1Steps['#children-buttons'].correct = true;
    $('#pageguide-next-button').removeClass("disabled");
  } else {
    //me.eduTour1Steps['#children-buttons'].correct = false;
    $('#pageguide-next-button').addClass("disabled");
  }
}
global.onTour2Check = function(checkbox) {
  var answer   = { "john": 'lower', "diego": 'lowest', "anna": 'normal'};
  var checkboxId       = checkbox[0].id;
  var tokens  = checkboxId.split("-");
  var name    = tokens[0];
  var dosage  = tokens[1];
  var checked          = checkbox[0].checked
  var answerLabel      = $('#' + checkboxId + "-answer");
  var allAnswerLabels  = $('.' + name + "-answer");
  var allCheckboxes    = $('.' + name + "-checkbox");

  allCheckboxes.each(function(i,val) {
    if ($(this)[0].id == checkboxId) {

    } else {
      $(this)[0].checked = false;
    }
  })

  // Show if the answer is correct or incorrect
  allAnswerLabels.addClass("hide");
  if (checked) {
    answerLabel.removeClass("hide");
  } else {
    answerLabel.addClass("hide");
  }

  var correctCount = 0;
  for (var key in answer) {
    var dosage = answer[key];
    var selector = "#" + key + "-" + dosage;
    if ($(selector)[0].checked) {
      correctCount++;
    }
  }

  var stepSelector = '#child-buttons-tour2';
  if (correctCount == 3) {
    //me.eduTour2Steps[stepSelector].correct = true;
    $('#pageguide-next-button').removeClass("disabled");
  } else {
    //me.eduTour2Steps[stepSelector].correct = false;
    $('#pageguide-next-button').addClass("disabled");
  }
}
