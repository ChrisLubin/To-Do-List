$(document).ready(() => {
  'use strict';

  // Set html height to window height
  $("html").css("height", $(window).height());

  // Variable to keep track of index of task to delete
  let indexToDelete;

  // Appends the tasks in local storage to the task list
  CreateList();

  $("#test").click(() => {
    $("#tasks").animate({
      scrollTop: $("#list").height() - 250
    }, 400);
  });

  // Makes tasks sortable
  $("#list").sortable({
    axis: "y",
    // Saves the new order of the task list in local storage after the order is changed
    update: () => {
      SaveList();
    }
  });

  // Adds input (if not empty) when button to add to list is clicked
  $("#ui button").click(CheckNewItem);

  // Adds input (if not empty) when 'enter' button is pressed while input box is selected
  $("#ui input").on('keypress', e => {
    const key = e.keyCode || e.which;
    if (key == 13) {
      CheckNewItem();
    }
  });

  // Event handler for the edit icon
  $("#tasks").on('click', '.edit', function() {
    const $span = $(this).parent().children();
    let $input;

    // If statement that checks if user is already editing the selected task
    if ($span.attr("class") == "editing") {
      $input = $(this).parent().children().children();
      const editedInput = $input.val().trim();

      if (CheckEditedItem(editedInput) == 1) {
        // Removes the input box and updates the task
        $input.remove();
        $span.html(editedInput);
        $span.removeClass("editing");
        SaveList();
      } else {
        // The user is alerted if the field is left blank
        $input.focus();
        $input.addClass("inputError");
        $input.attr('placeholder', 'A Task Was Not Entered');
        $input.val("");
      }
    } else {
      // Adds an input box so user can edit the task
      const text = $span.html();
      $span.html("<input type='text'></input>");
      $span.addClass("editing");
      $input = $(this).parent().children().children();

      // Transfers the text that was already there to the input box
      $input.val(text);
      $input.focus();
    }
  });

  // Event handler for when the 'enter' button is pressed when user is editing a task
  $("#tasks ul").on('keypress', '.editing', function(e) {
    const key = e.keyCode || e.which;
    if (key == 13) {
      const text = $(this).children().val().trim();
      // If the edited text is acceptible, the task is replaced with the new text
      if (CheckEditedItem(text) == 1) {
        $(this).children().remove();
        $(this).html(text);
        $(this).removeClass("editing");
        SaveList();
      } else {
        $(this).children().addClass("inputError");
        $(this).children().attr("placeholder", "A Task Was Not Entered");
        $(this).children().val("");
      }
    }
  });

  // Shows confirm dialog box when delete icon next to task is clicked
  $("#tasks").on("click", ".delete", function() {
    ToggleConfirmBox();
    indexToDelete = $(this).parent().index();
    // Adds red background on selected task item
    $("#list li:nth-of-type(" + (indexToDelete + 1) + ")").addClass("selectedDelete", 400);
  });

  // Event handler for 'yes' button on delete dialog box
  $("#confirmBox > button:nth-of-type(1)").click(() => {
    // Removes the task that user wants to delete
    $("#list li:nth-of-type(" + (indexToDelete + 1) + ")").fadeOut(400, function() {
      $(this).remove();
      localStorage.clear();
      SaveList();
    });
    ToggleConfirmBox();
  });

  // Event handler for 'no' button on delete dialog box
  $("#confirmBox > button:nth-of-type(2)").click(() => {
    ToggleConfirmBox();
    // Removes red background on task item
    $("#list li:nth-of-type(" + (indexToDelete + 1) + ")").removeClass("selectedDelete", 400);
  });

  // Toggles between showing the confirm delete dialog box and making background clickable
  function ToggleConfirmBox() {
    const overlayDisplay = $("#overlay").css("display");

    if (overlayDisplay == "none") {
      // Toggles between clickable and unblickable background
      $("#overlay").toggle();

      // Toggles between making background dim and showing confirm dialog box
      $("#overlay").animate({
        opacity: ".2"
      }, 400);
      $("#confirmBox").toggle();
      $("#confirmBox").animate({
        opacity: "1"
      }, 400);
    } else {
      $("#overlay").animate({
        opacity: "0"
      }, 400, () => {
        // Toggles between clickable and unblickable background
        $("#overlay").toggle();
      });
      $("#confirmBox").animate({
        opacity: "0"
      }, 400, () => {
        $("#confirmBox").toggle();
      });
    }
  }

  // Returns 1 if user input is valid, returns 0 otherwise
  function CheckEditedItem(text) {
    if (text == 0) {
      return 0;
    } else {
      return 1;
    }
  }

  // Adds the user's input to task list with a fade in effect
  function FadeInTask(input) {
    $("#tasks ul").append("<li> <span>" + input + "</span> <img class='delete' src='./IMG/delete.png' /> <img class='edit' src='./IMG/edit.png' /> </li>");
    // Scrolls to bottom of list to see the latest task
    $("#tasks").animate({
      scrollTop: $("#list").height() - 260
    }, 400);
    $("#tasks ul li:last-child").css("opacity", 0);
    $("#tasks ul li:last-child").animate({
      opacity: "1"
    }, 400);
  }

  // Checks to see if user's input can be added to list then acts accordingly
  function CheckNewItem() {
    const input = $("#ui input").val().trim();

    // The user is alerted if the field is left blank
    if (input == "") {
      $("#ui input").addClass("inputError");
      $("#ui input").attr("placeholder", "A Task Was Not Entered");
      $("#ui input").val("");
    } else {
      // Placeholder is changed back to defualt text, input text is cleared, and User's input is appended to task list
      $("#ui input").removeClass("inputError");
      $("#ui input").attr("placeholder", "Please Enter A Task");
      $("#ui input").val("");
      FadeInTask(input);
      SaveList();
    }
  }

  // Saves the current task list in local storage
  function SaveList() {
    // Loop that goes through current task list and saves to local storage
    for (let i = 1; i <= $("#list li").length; i++) {
      localStorage.setItem(("task" + i), $("#list li:nth-of-type(" + i + ") span").html());
    }
  }

  // Appends the task(s) in local storage to the page
  function CreateList() {
    let i = 1;

    // Creates list if local storage has task items in it
    if (localStorage.length != 0) {
      // Interval that adds a task to the list every 400 milliseconds
      const interval = setInterval(() => {
        FadeInTask(localStorage.getItem("task" + i));

        if (i == localStorage.length) {
          clearInterval(interval);
        }
        i++;
      }, 400);
    }
  }
});