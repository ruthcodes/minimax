$(document).ready(function(){

  var human;
  var computer;
  var whosTurn;
  var board = [0,1,2,3,4,5,6,7,8];
  var winningCombo;
  var bestMove;

  var emp = findOpen(board);

  function gameOver(){

    var endBoard = findOpen(board);
    if (win(board,human)){
      $(".title > p").text("You win!");
      whosTurn = "";
      //select tiles at indexes of winning combo, add animate class to them
      $(".tile[data-pos='" + winningCombo[0] +"']").addClass('animated zoomIn');
      $(".tile[data-pos='" + winningCombo[1] +"']").addClass('animated zoomIn');
      $(".tile[data-pos='" + winningCombo[2] +"']").addClass('animated zoomIn');
      setTimeout(function(){$(".tile[data-pos='" + winningCombo[0] +"']").removeClass('animated zoomIn');
                            $(".tile[data-pos='" + winningCombo[1] +"']").removeClass('animated zoomIn');
                            $(".tile[data-pos='" + winningCombo[2] +"']").removeClass('animated zoomIn'); reset() }, 3000);
      return true;
    } else if (win(board,computer)){
      $(".title > p").text("You Lose!");
      whosTurn = "";
      $(".tile[data-pos='" + winningCombo[0] +"']").addClass('animated zoomIn');
      $(".tile[data-pos='" + winningCombo[1] +"']").addClass('animated zoomIn');
      $(".tile[data-pos='" + winningCombo[2] +"']").addClass('animated zoomIn');
      setTimeout(function(){$(".tile[data-pos='" + winningCombo[0] +"']").removeClass('animated zoomIn');
                            $(".tile[data-pos='" + winningCombo[1] +"']").removeClass('animated zoomIn');
                            $(".tile[data-pos='" + winningCombo[2] +"']").removeClass('animated zoomIn'); reset() }, 3000);
      return true;
    } else if (endBoard.length <1){
      $(".title > p").text("It's a tie!");
      whosTurn = "";
      setTimeout(function(){ reset() }, 3000);
      return true;
    }
    return false;
  }

  function reset(){
    $(".title > p").text("Tic Tac Toe");
    board = [0,1,2,3,4,5,6,7,8];
    $(".tile").text("");
    $(".tile").css("background", "black");
    whosTurn;
    human = "";
    computer = "";
    winningCombo = [];
  }

  function compGo(){
    if (whosTurn == "computer"){
      if(!gameOver()){
        play(board,0, -Infinity, Infinity, computer);

        //update board
        board.splice(bestMove, 1, computer);
        
        //wait a second before doing computers turn
        setTimeout(function(){ 
          //find and update tile based on it's position saved as html data attr
          $(".tile[data-pos='" + bestMove +"']").text(computer);
          //change background
          var back = $(".tile[data-pos='" + bestMove +"']").attr('data-background');
          $(".tile[data-pos='" + bestMove +"']").css("background", back);
          //end of players turn
          whosTurn = "human";
          gameOver();
        }, 1000);
      }
    }
  }

  //set background for game tiles on move
  $( ".tile" ).each(function() {

    $(this).on("click", function(event){
          console.log(whosTurn);
      if (!human || human == ""){
        $('#choose').addClass('animated shake');
        setTimeout(function(){ $("#choose").removeClass('animated shake'); }, 1000);

      }

      if (human && whosTurn == "human"){
        //identify chosen tile by data attribute in html
        var tileIndex = $(this).attr('data-pos');
        tileIndex = parseInt(tileIndex);
        //check that move hasn't been done already in another turn
        if (board.includes(tileIndex)){
          //update board array
          board.splice(tileIndex, 1, human);
          //update text on board with move
          $(this).text(human);
          //change background
          var back = $(this).attr('data-background');
          $(this).css("background", back);
          //end of players turn
          whosTurn = "computer";
          gameOver();
          compGo();

        }
      }
    });  
  });

  //set player and computer based on button click
  $('button').on("click",function (event){
    var emp = findOpen(board);
    if (emp.length == 9){
      human = this.value;
      if (human == "O"){
        computer = "X";
        whosTurn = "computer";
        compGo();
      } else {
        whosTurn = "human";
        computer = "O";
      }
    }



  });


  // function returns true if given player has won on given board
  function win(checkBoard, player){
    if(checkBoard[0] == player && checkBoard[1] == player && checkBoard[2] == player){
      winningCombo = [0,1,2];
      return true
    }
    if(checkBoard[0] == player && checkBoard[3] == player && checkBoard[6] == player){
      winningCombo = [0,3,6];
      return true;
    }
    if(checkBoard[6] == player && checkBoard[7] == player && checkBoard[8] == player){
      winningCombo = [6,7,8];
      return true;
    }
    if(checkBoard[2] == player && checkBoard[5] == player && checkBoard[8] == player){
      winningCombo = [2,5,8];
      return true;
    }
    if(checkBoard[3] == player && checkBoard[4] == player && checkBoard[5] == player){
      winningCombo = [3,4,5];
      return true;
    }
    if(checkBoard[6] == player && checkBoard[4] == player && checkBoard[2] == player){
      winningCombo = [6,4,2];
      return true;
    }
    if(checkBoard[1] == player && checkBoard[4] == player && checkBoard[7] == player){
      winningCombo = [1,4,7];
      return true;
    }
    if(checkBoard[0] == player && checkBoard[4] == player && checkBoard[8] == player){
      winningCombo = [0,4,8];
      return true;
    }
    return false;
  }
  //function returns an array of open spaces on given board
  function findOpen(checkBoard){
    var empties = [];
    for (var i=0; i<checkBoard.length; i++){
      if(Number.isInteger(checkBoard[i]))
        empties.push(checkBoard[i]);
    }
    return empties;
  }
  //minimax function for AI using AB pruning
  function play(board, depth, a, b, player){
    var emptiesArr = findOpen(board);

    if(win(board, computer))
      return 10 - depth;
    else if (win(board, human))
      return -10;
    else if (emptiesArr.length < 1)
      return 0;


    depth +=1;
    if (player == computer){
      var score = -Infinity;
      for (var x=0; x<emptiesArr.length; x++){
        var move = board[emptiesArr[x]];
        board[emptiesArr[x]] = player;
        score = Math.max(score, play(board, depth, a, b, human));
        board[emptiesArr[x]] = emptiesArr[x];
        if (score > a){
          a = score;
          if (depth == 1){
            bestMove = move;
          }
        }

        if (b <= a)
          break;
      }

      return score;
    } else {
      var score = Infinity;
      for (var x=0; x<emptiesArr.length; x++){
        var move = board[emptiesArr[x]];
        board[emptiesArr[x]] = player;
        score = Math.min(score, play(board, depth, a, b, computer));
        board[emptiesArr[x]] = emptiesArr[x];

        if (score < b){
          b = score;
          if (depth == 1){
            bestMove = move;
          }
        }

        if (b<= a){
          break;
        }

      }
      return score;
    }

  }




});

