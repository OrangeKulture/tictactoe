$(document).ready(function() {
  const winCombos = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9]
  ];

  let playerArray = [];
  let compArray = [];
  let board = [];
  const compStr = "Computer's";
  const plyStr = "Player's";
  let player = "X";
  let comp = "O";
  let playerTurn = false;
  let compTurn = true;
  let counter = 0;
  let labelCompText = 0;
  let labelPlayerText = 0;
  let labelDrawText = 0;
  let checkGo = true;

  // Show the modal so that player can select X or O
  $("#modalSelect").modal("show");

  // Random select first turn, either computer or player
  function selectOrder() {
    let turn = Math.floor(1 + Math.random() * 33);
    if (turn % 2 === 0) {
      $(".showTurn").text(plyStr + " Turn");
      playerTurn = true;
    } else {
      $(".showTurn").text(compStr + " Turn");
      setTimeout(function() {
        compTurn = true;
        compGo();
      }, 500);
    }
  }

  // Player selection
  $("#modalSelect a").on("click", function() {
    if (this.id === "x") {
      player = "X";
      comp = "O";
    } else {
      player = "O";
      comp = "X";
    }

    // Shows board and all the text feedback for the user
    $("#playerIcon").text(player);
    $("#compIcon").text(comp);
    $("#modalSelect").modal("hide");
    $(".icon").css("visibility", "visible");
    $(".board").css("visibility", "visible");
    $(".scoreBoard").css("visibility", "visible");
    $(".reset").css("visibility", "visible");
    $(".labelComp").text(labelCompText);
    $(".labelPlayer").text(labelPlayerText);
    $(".labelDraw").text(labelDrawText);
    selectOrder();
  });

  // Random select any box on the board
  function rand() {
    return Math.floor(1 + Math.random() * 9);
  }

  // Function to filter winCombos and determine which box should be clicked
  function kickAss(arr, test) {
    function filterArr(val) {
      return test.indexOf(val) < 0;
    }
    return arr.filter(filterArr);
  }

  // Run the algorithm for a defense move
  function defense() {
    for (let i = 0; i < 8; i++) {
      let resp = kickAss(winCombos[i], playerArray);
      if (resp.length === 1) {
        return resp[0];
      }
    }
  }

  // run the algorithm for an offense move
  function offense(arr) {
    for (let i = 0; i < 8; i++) {
      let resp = kickAss(winCombos[i], arr);
      if (resp.length === 1) {
        return resp[0];
      }
    }
  }

  // Draws the selection on the board
  function makeGame(user, id, arrNm, arrStr) {
    $(`#${id}`).text(user);
    $(`#${id}`).addClass(`clicked ${user}`);
    arrNm.push(id);
    let check = checkScore(user);
    if (check) {
      if (user === comp) {
        win("Computer");
      } else {
        win("Player");
      }
    }
    counter++;
    if (counter == 9 && !check) {
      draw();
    }
    $(".showTurn").text(`${arrStr} turn`);
  }

  // resets board after each game
  function resetGame() {
    compTurn = false;
    playerTurn = false;
    playerArray = [];
    compArray = [];
    board = [];
    counter = 0;
    $(".showTurn").text("");
    $(".box").text("").removeClass("clicked");
    $(".box").text("").removeClass("X");
    $(".box").text("").removeClass("O");
    selectOrder();
  }

  // Handles the win notifications and user feedback
  function win(text) {
    $("#modalWin h2").text(text + " won!!");
    $("#modalWin").modal("show");
    setTimeout(function() {
      $("#modalWin").modal("hide");
      if (text === "Computer") {
        labelCompText++;
        $(".labelComp").text(labelCompText);
        resetGame();
      } else {
        labelPlayerText++;
        $(".labelPlayer").text(labelPlayerText);
        resetGame();
      }
    }, 1000);
  }

  // Handles when the game ends in a draw
  function draw() {
    $("#modalWin h2").text("It's a draw");
    $("#modalWin").modal("show");
    labelDrawText++;
    console.log(labelDrawText);
    setTimeout(function() {
      $("#modalWin").modal("hide");
      $(".labelDraw").text(labelDrawText);
      resetGame();
    }, 1000);
  }

  // Checks score and displays feedback to the user
  function checkScore(user) {
    if (
      $("#1").hasClass(user) &&
      $("#2").hasClass(user) &&
      $("#3").hasClass(user)
    ) {
      return true;
    } else if (
      $("#1").hasClass(user) &&
      $("#5").hasClass(user) &&
      $("#9").hasClass(user)
    ) {
      return true;
    } else if (
      $("#1").hasClass(user) &&
      $("#4").hasClass(user) &&
      $("#7").hasClass(user)
    ) {
      return true;
    } else if (
      $("#2").hasClass(user) &&
      $("#5").hasClass(user) &&
      $("#8").hasClass(user)
    ) {
      return true;
    } else if (
      $("#3").hasClass(user) &&
      $("#5").hasClass(user) &&
      $("#7").hasClass(user)
    ) {
      return true;
    } else if (
      $("#3").hasClass(user) &&
      $("#6").hasClass(user) &&
      $("#9").hasClass(user)
    ) {
      return true;
    } else if (
      $("#4").hasClass(user) &&
      $("#5").hasClass(user) &&
      $("#6").hasClass(user)
    ) {
      return true;
    } else if (
      $("#7").hasClass(user) &&
      $("#8").hasClass(user) &&
      $("#9").hasClass(user)
    ) {
      return true;
    } else return false;
  }

  // Main function for the Computer turns
  function compGo() {
    setTimeout(function() {
      if (compTurn) {
        // first turn
        if (compArray.length == 0 && playerArray.length == 0) {
          let turn = 5;
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        } else if (compArray.length == 0 && playerArray.length == 1) {
          let turn = $("#5").hasClass("clicked") ? 3 : 5;
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        }
      }
      // second turn
      if (compTurn) {
        if (compArray.length == 1 && playerArray.length == 1) {
          if (compArray[0] == 5) {
            let turn = playerArray[0] == 1 ? 3 : 1;
            makeGame(comp, turn, compArray, plyStr);
            compTurn = false;
            playerTurn = true;
          }
        } else if (compArray.length == 1 && playerArray.length == 2) {
          let turn = defense();
          while($(`#${turn}`).hasClass('clicked') || turn === undefined){
            turn = rand();
          }
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        }
      }
      // third turn
      if (compTurn) {
        if (compArray.length == 2 && playerArray.length == 2) {
          let turn = defense();
          if (turn == undefined || $(`#${turn}`).hasClass("clicked")) {
            turn = offense(compArray);
            if ($(`#${turn}`).hasClass("clicked")) {
              turn = 7;
            }
          }
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        } else if (compArray.length == 2 && playerArray.length == 3) {
          let turn = rand();
          while ($(`#${turn}`).hasClass("clicked")) {
            turn = rand();
          }
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        }
      }
      // fourth turn
      if (compTurn) {
        if (compArray.length == 3 && playerArray.length == 3) {
          let final = compArray.sort().slice(1);
          let final2 = compArray.sort();
          final2.pop();
          final2 = final2.join("");
          final = final.join("");
          for (let i = 0; i < 8; i++) {
            if (winCombos[i].join("").includes(final)) {
              turn = winCombos[i][0];
            } else if (winCombos[i].join("").includes(final2)) {
              turn = winCombos[i][2];
            }
          }

          if ($(`#${turn}`).hasClass("clicked") || turn === undefined) {
            turn = rand();
            while ($(`#${turn}`).hasClass("clicked")) {
              turn = rand();
            }
          }

          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        } else if (compArray.length == 3 && playerArray.length == 4) {
          let turn = rand();
          while ($(`#${turn}`).hasClass("clicked")) {
            turn = rand();
          }
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        }
      }

      //fifth turn
      if (compTurn) {
        if (
          (compArray.length == 4 && playerArray.length == 4) ||
          (compArray.length == 4 && playerArray.length == 5)
        ) {
          let turn = rand();
          while ($(`#${turn}`).hasClass("clicked")) {
            turn = rand();
          }
          makeGame(comp, turn, compArray, plyStr);
          compTurn = false;
          playerTurn = true;
        }
      }
    }, 1000);
  } // end compGo

  // Handles player selection
  $(".box").on("click", function() {
    if (playerTurn) {
      if (!$("#" + this.id).hasClass("clicked")) {
        makeGame(player, Number(this.id), playerArray, compStr);
        playerTurn = false;
        let check = checkScore(player);
        if (check) {
          console.log("WIN!");
        } else {
          if (counter < 9) {
            compTurn = true;
            compGo();
          }
        }
      }
    }
  });

  // resets the game completely
  $(".reset").on("click", function() {
    window.location.reload(true);
  });
});
