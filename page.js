(function(){
    /*
        The object of Tic Tac Toe is to get three in a row.
        You play on a three by three game board.
        The first player is known as X and the second is O.
        Players alternate placing Xs and Os on the game board until either oppent has three in a row or all nine squares are filled.
        X always goes first, and in the event that no one has three in a row, the stalemate is called a cat game.
    */
    TicTacToe = function(board){
        TicTacToeCell = function(x, y, cell){
            var _elem = cell;
            var _x = x;
            var _y = y;
            var _value;

            return {
                x:_x,
                y:_y,
                element:_elem,
                empty:function(){ return !_value },
                value:function(val){
                    if (val && val.length === 1) {
                        _value = val;
                        _elem.className += " " + val;
                    }

                    return _value
                }
            }
        };


        var Players = {X: "X", O: "O"};
        var _board = board;
        var _boardData = [];
        var _cellsRemaining = 0;
        var _currentPlayer = Players.X;
        var _boardLocked = true;

        var _start = function(){
            _messageUser("");
            _drawBoard();
        };

        var _drawBoard = function(){
            _board.innerHTML = "";
            _board.className = "";
            _cellsRemaining = 0;
            getById("currentplayer").className = ""
            for (var i = 0; i < 3; i++) {
                var row = document.createElement("div");
                row.className = "row";
                row.id = i;
                _boardData[i] = new Array(3);
                for (var j = 0; j < 3; j++) {
                    var cell = document.createElement("div");
                    cell.className = "cell";
                    cell.innerHTML = "<span class=\"X\">X</span>" +
                                     "<span class=\"O\">O</span>";
                    cell.onclick = function(x, y){
                        if ( !_boardLocked ) {
                            _setValueOnCell(_boardData[x][y], _currentPlayer)
                        }
                    }.bind(cell, i, j);

                    _boardData[i][j] = new TicTacToeCell(i, j, cell);

                    row.appendChild(cell);
                    _cellsRemaining++;
                }

                _board.appendChild(row);
            }

            _boardLocked = false;
        };

        var _toggleTurn = function(){
            _currentPlayer = (_currentPlayer === Players.X ? Players.O : Players.X);
            getById("turn").className = "cell " + _currentPlayer
        };

        var getValue = function(x, y) {
            var value;
            if (x >= 0 && x < _boardData.length &&
                    y >= 0 && y < _boardData[x].length) {
                value = _boardData[x][y].value()
            }

            return value
        };

        var cellsWithSameValue = function(cell, getNextCell) {
            var cells = [cell];
            var value = cell.value();
            var location = {x:cell.x, y: cell.y};
            var nextCell = getNextCell(location);
            while(value && getValue(nextCell.x, nextCell.y) == value) {
                cells.push(_boardData[nextCell.x][nextCell.y]);
                nextCell = getNextCell(nextCell)
            }

            return cells
        };

        var _directionFunctions = [
            function up(loc){ return {x:loc.x-1, y: loc.y} },
            function topright(loc){ return {x:loc.x-1, y: loc.y+1} },
            function right(loc){ return {x:loc.x, y: loc.y+1} },
            function bottomright(loc){ return {x:loc.x+1, y: loc.y+1} },
            function down(loc){ return {x:loc.x+1, y: loc.y} },
            function bottomleft(loc){ return {x:loc.x+1, y: loc.y-1} },
            function left(loc){ return {x:loc.x, y: loc.y-1} },
            function topleft(loc){ return {x:loc.x-1, y: loc.y-1} }
        ];
        var _isWinningMove = function(cell){
            for (var i = 0; i < _boardData.length; i++) {
                for (var j = 0; j < _boardData[i].length; j++) {
                    var cells = [];
                    var d = 0;
                    var x = _boardData[i][j];
                    while(cells.length < 3 && d < _directionFunctions.length) {
                        cells = cellsWithSameValue(x, _directionFunctions[d++]);
                    }

                    if ( cells.length === 3 ) {
                        for(var c = 0; c < cells.length; c++) {
                            cells[c].element.className += " partofrow"
                        }

                        return true
                    }
                }
            }

            return false
        };

        var _lockCurrentGame = function(){
            _boardLocked = true;
            _board.className += "locked";
            getById("currentplayer").className = "hidden"
        };

        var _messageUser = function(msg) {
            getById("message").innerText = msg
        };

        var _setValueOnCell = function(cell, value) {
            if (cell.empty()) {
                cell.value(value);
                _cellsRemaining--;
                if (_isWinningMove(cell)) {
                    _lockCurrentGame();
                    _messageUser(_currentPlayer + " WINS!!!")
                } else if (_cellsRemaining === 0) {
                    _lockCurrentGame();
                    _messageUser("Cat game")
                } else {
                    _toggleTurn()
                }
            }
        };

        return {
            start:function(){ return _start() },
            turn:function(){ return _currentPlayer },
            place:function(cell, value){ return _setValueOnCell(cell, value) }
        }
    };


    /*
        The UI (this page)
    */
    var _controls = {};
    var getById = function(id){
        if (!_controls[id]) {
            _controls[id] = document.getElementById(id)
        }
        return _controls[id]
    };

    var attachEvents = function(){
        var board = null;
        getById("start").addEventListener("click", function(e){
            board = new TicTacToe(getById("board"));
            board.start();
        });

        if ( !board ) {
            getById("start").click()
        }
    };

    window.onload = function(e){
        attachEvents()
    }
})();