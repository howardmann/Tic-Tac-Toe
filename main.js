console.log("C4 game");

// JavaScript logic
var Game = {
  newBoard: function(n) {
    // Creates a new board of n x n filled with marker '.'
    this.board = this.board || Array(n);
    for (var i = 0; i < this.board.length; i++) {
      this.board[i] = Array(n).fill('.');
    }
    // Reset game finish as false and selected player as undefined
    this.finish = false;
    this.lastPlayer = 'undefined';
    console.log("newBoard created: "+n+" by "+n);
  },
  winCount: function(n) {
    this.countWin = n;
    console.log("Game of connect "+n);
  },
  addMark: function(playerChosen,row,col) {
    if (playerChosen === this.lastPlayer) {
      console.log("Not your turn");
    }
    else if (this.board[row][col] === '.') {
      this.board[row][col] = playerChosen;
      this["lastPlayer"] = playerChosen;
      console.log("Player: "+playerChosen+" addMark to row: "+row+", col: "+col);
    } else {
      console.log("Already marked. Try again.");
    }
  },
  checkRows: function(playerChosen) {

    for (var row = 0; row < this.board.length; row++) {
      var count = 0;
      this.winArray = [];
      for (var col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === playerChosen){
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkRow true on row: "+row);
          this["finish"] = true;
          console.log("Start",row);
          console.log("End",col);
          return true;
        }
      }
    }
  },
  checkCols: function(playerChosen) {
    for (var col = 0; col < this.board.length; col++) {
      var count = 0;
      this.winArray = [];
      for (var row = 0; row < this.board.length; row++) {
        if (this.board[row][col] === playerChosen){
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkCol true on col "+col);
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagLR: function(playerChosen) {
    var count = 0;
    var length = this.board.length;
    this.winArray = [];
    var maxLength = length - this.countWin + 1;
    // Run Bottom Half diagonal Top Left to Bottom Right (incl middle)
    for (var rowStart = 0; rowStart < maxLength; rowStart++) {
      for (var row = rowStart, col = 0; row < length && col < length; row++, col++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top Half diagonal Top Left to Bottom Right (excl middle)
    for (var colStart = 1; colStart < maxLength; colStart++) {
      for (var col = colStart, row = 0; col < length && row < length; col++, row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagRL: function(playerChosen) {
    var count = 0;
    var length = this.board.length;
    var maxLength = length - this.countWin + 1;
    this.winArray = [];
    // Run Bottom half diagonal Top Right to Botom Left (incl middle)

    for (var rowStart = 0; rowStart < maxLength; rowStart++) {
      for (var row = rowStart, col = (length-1); row < length && col >= 0; row++, col--) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top half diagonal Top Right to Botom Left (excl middle)
    for (var colStart = (length-2); colStart > (this.countWin - 2); colStart-- ) {
      for (var col = colStart, row = 0; col >= 0 && row <= (length-2); (col-- && row++)) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row,col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  isEmpty: function(){
    var check = true;
    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i].includes('.')){
        return false;
      }
    }
    return check;
  },
  checkAll: function(playerChosen){
    if ( this.checkRows(playerChosen) ) {
      return true;
    }
    if ( this.checkCols(playerChosen) ) {
      return true;
    }
    if ( this.checkDiagLR(playerChosen) ) {
      return true;
    }
    if ( this.checkDiagRL(playerChosen) ) {
      return true;
    }
    if (!this.finish && this.isEmpty()) {
      console.log("Draw game no winner");
      return true;
    }
  }
};

// jQuery..................................................
$(document).ready(function(){

  // Declare global event listeners used more than once
  var $select = $('select'); // Select dropdown form game setup
  var $msg = $('#msg'); // Container to print instructions
  var $cell; // Assign event after buildBoard creates cell
  var $buildButton = $('button').filter('.build-board');
  var $document = $(document);
  var $body = $('body');
  var $players = $('.players');
  var $buttonReset = $('button').filter('.reset');

  // Declare and cache global Game condition variables
  var size; // board dimensions size x size
  var winCount; // length condition to achieve in a row
  var maxScore; // first player to score maxScore wins

  var cacheValues = function() {
    size = parseInt($(".board-size option:selected").val());
    maxScore = parseInt($(".board-round option:selected").val());
    var el = parseInt($(".board-count option:selected").val());
    if (el > size) {
      swal("Length cannot be bigger than board size");
    } else {
      winCount = el;
    }
    console.log("size: "+size+" winCount: "+winCount+" maxScore: "+maxScore);
  };
  $select.change(cacheValues);
  cacheValues();

  // Function to hide set up and show board and title with cached values
  var showBoard = function() {
    $('.game-setup').hide();
    $('.game-play').show();
    $('.title').html("C4 game - Line up "+winCount+" in a row; First to score: "+maxScore);
    $buttonReset.hide();
  };

  // Create function for building a new board

  var buildBoard = function() {
    // Execute game logic based on cached select values
    Game.newBoard(size);
    Game.winCount(winCount);

    var dimension = (100 / size)+'%'; // To set cell width
    var count = 0; // To number cells
    var list = ''; // Use string to store appended values
    // Loop create new board divs and append to div container. Assign row and col attributes for future access
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        count++;
        list += "<div class='cell' row="+"'"+row+"' col='"+col+"'>"+count+"</div>";
      }
    }
    $('.container').html(list);
    // Cache event listener on board after build
    $cell = $('.cell');
    $cell.css({"width": dimension, "height": dimension});
    $cell.on('click',takeMove);
    // showBoard callback;
    showBoard();
    return true;
  };

  $buildButton.on('click',buildBoard);

  // Selecting players
  var player;

  // Function to assign player and update msg div
  var pickPlayer = function(name) {
    player = name;
    console.log(player+" chosen");
    $msg.html(player+" chosen").removeClass().addClass(player);
  };

  // Shortcut keys: for choosing players
  $document.on('keypress', function(event) {
    // Number 1 shortcut
    if (event.keyCode === 49) {
      pickPlayer('player1');
    }
    // Number 2 shortcut
    if (event.keyCode === 50) {
      pickPlayer('player2');
    }
    // Spacebar shortcut
    if (event.keyCode === 32) {
      if (player === 'player1') {
        pickPlayer('player2')
      } else if (player === 'player2') {
        pickPlayer('player1')
      }
    }
  });

  // Cache value of button when player button clicked
  var buttonPlayer = function(){
    var el = $(this).attr('class');
    pickPlayer(el);
  };
  $players.on('click','button',buttonPlayer);


  var printWin = function() {
    var winArray = Game.winArray;
    var length = winArray.length;

    for (var i = 0; i < length; i++) {
      $(".cell[row="+winArray[i][0]+"][col="+winArray[i][1]+"]").addClass('win');
    }
  };

  // Create checkScore and checkFinish callback
  var player1Score = 0; // Start with zero scores
  var player2Score = 0;

  // Check round score and record value
  var checkRound = function() {
    // Player 1 wins round
    if (Game.finish && Game.lastPlayer === 'player1') {
      player1Score++;
      $msg.html('Winner is player1 <br/> Reset Board');
      $body.removeClass().addClass('player1');
      console.log('player1Score:' + player1Score, 'player2Score '+player2Score);
      $cell.off('click');
      printWin();
      $buttonReset.show();
    // Player 2 wins round
    } else if (Game.finish && Game.lastPlayer === 'player2') {
      player2Score++;
      $msg.html('Winner is player2 <br/> Reset Board');
      $body.removeClass().addClass('player2');
      console.log('player1Score:' + player1Score, 'player2Score '+player2Score);
      $cell.off('click');
      printWin();
      $buttonReset.show();
    // Draw round
    } else if (Game.isEmpty() && !Game.finish) {
      $msg.html('Game draw. No points. <br/> Reset Board').removeClass().addClass('msg');
      $cell.off('click');
      $body.removeClass().addClass('msg');
      $buttonReset.show();
    }
    // Append round score
    $('button.player1 span').html(player1Score);
    $('button.player2 span').html(player2Score);

  };

  // Check total round wins
  var checkGame = function () {
    if (player1Score === maxScore || player2Score === maxScore) {
      if (player1Score > player2Score) {
        swal("player1 WINS!", "Click ok to play again!", "success");
      } else if (player1Score < player2Score) {
        swal("player2 WINS!", "Click ok to play again!", "success");
      }
      $('.sweet-alert').on('click','button',function(){
        location.reload();
      });
    }
  };

  // Create callback function when cell is clicked
  var takeMove = function(){

    // Find position of click
    var el = $(this);
    var row = el.attr('row');
    var col = el.attr('col');
    // Check conditions
    if (player === undefined) {
      $msg.html("Please select a player");
    } else if (player === Game.lastPlayer && player !== undefined) {
      $msg.html("Turn taken. Press spacebar to switch players");
    } else {
      Game.addMark(player,row,col);
      Game.checkAll(player);
      el.addClass(player);
      checkRound();
      checkGame();
    }
    return true;
  };

  var resetBoard = function() {
    Game.newBoard(size); // Store the new board in a variable
    $cell.removeClass('player1');
    $cell.removeClass('player2');
    $cell.removeClass('win');
    $cell.on('click',takeMove);

    player = undefined;
    $players.on('click','button',buttonPlayer);

    $body.addClass('reset');
    $msg.html("Board reset. Pick who goes first").removeClass().addClass('.msg');
    $buttonReset.hide();
  };

  $('button.reset').on('click',resetBoard);
  //
  // $document.on('keypress', function(event) {
  //   if (event.keyCode === 114) {
  //     resetBoard();
  //   }
  // });

}); // jQuery document ready function
