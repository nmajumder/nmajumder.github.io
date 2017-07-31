function closePopup() {
	wrapper.style.cssText = "filter: blur(0px);";
	popup.style.cssText = "display: none;";
    noClick = false;
}

// msg = 0 (WIN) | 1 (NOT WIN)
function openPopup(msg) {
	var msgstr = "";
	switch(msg) {
		case 0:
			msgstr = "Congratulations, you've successfully solved the puzzle!";
			break;
		case 1:
			msgstr = "Oops, there are still one or more errors to fix!";
			break;
		default:
			console.log("Error: Invalid msg number passed into openPopup.");

	}
	wrapper.style.cssText = "filter: blur(5px);";
	popupmsg.innerHTML = msgstr;
	popup.style.cssText = "display: inline-block";
    noClick = true;
}


//
// contains:
//  takes in an array of tuples e.g. [[1,2],[3,4],[5,2]]
//  takes in a value that is a tuple e.g. [3,4]
//  returns true if the value is in the array and false if not
//
function contains(arr,val) {
  //console.log(val,blanks);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][0] == val[0] && arr[i][1] == val[1]) {
      return true;
    }
  }
  return false;
}

// direction = 0 (right) | 1 (down) | 2 (left) | 3 (down)
function getNextArrows(xc,yc,direction) {
    switch(direction) {
        case 0:
            // right
        var i = xc+1;
        var j = yc;
        if (i > ARR_SIZE) {
            i = i - ARR_SIZE;
            j = (j % ARR_SIZE) + 1;
        }
        while (contains(blanks,[i,j])) {
            i++;
            if (i > ARR_SIZE) {
                i = i - ARR_SIZE;
                j = (j % ARR_SIZE) + 1;
            }
        }
        return [i,j];
        case 1:
            // down
        var j = yc+1;
        var i = xc;
        if (j > ARR_SIZE) {
            j = j - ARR_SIZE;
            i = (i % ARR_SIZE) + 1;
        }
        while (contains(blanks,[i,j])) {
            j++;
            if (j > ARR_SIZE) {
                j = j - ARR_SIZE;
                i = (i % ARR_SIZE) + 1;
            }
        }
            return [i,j];
        case 2:
            // left
            var i = xc-1;
        var j = yc;
        if (i <= 0) {
            i = i + ARR_SIZE;
            j =  j - 1;
            if (j <= 0) {
                j = j + ARR_SIZE;
            }
        }
        while (contains(blanks,[i,j])) {
            i--;
            if (i <= 0) {
                i = i + ARR_SIZE;
                j = j - 1;
                if (j == 0) {
                    j = 15;
                }
            }
        }
        return [i,j];
        case 3:
            // up
            var j = yc-1;
        var i = xc;
        if (j <= 0) {
            j = j + ARR_SIZE;
            i = i - 1;
            if (i <= 0) {
                i = i + ARR_SIZE;
            }
        }
        while (contains(blanks,[i,j])) {
            j--;
            if (j <= 0) {
                j = j + ARR_SIZE;
                i = i - 1;
                if (i == 0) {
                    i = 15;
                }
            }
        }
        return [i,j];
        default: 
            // if invalid dir number
            console.log("invalid dir: " + direction);
    }
    return [xc,yc];
}

// direction = 0 (right) | 1 (down)
// empty = true (space was prev empty) | false (space had a char in it)
function getNextTyping(xc,yc,direction,empty) {
    switch(direction) {
        case 0:
            if (!empty) {
                if (!contains(blanks,[xc+1,yc]) && xc+1 <= ARR_SIZE) {
                    return [xc+1,yc];
                }
            }
            var i = xc + 1;
            var j = yc;
            while (!contains(blanks,[i,j]) && i <= ARR_SIZE) {
                if (inputVals[i-1][j-1] == "") {
                    return [i,j];
                }
                i++;
            }
            // we got to end of word so find beginning
            i--;
            var end = i;
            while (!contains(blanks,[i,j]) && i > 0) {
                i--;
            }
            i++;
            while (i != end) {
                if (inputVals[i-1][j-1] == "") {
                    return [i,j];
                }
                i++;
            }
            // the word is completed so just return the position we were at
            return [xc,yc];
        case 1:
            if (!empty) {
                if (!contains(blanks,[xc,yc+1]) && yc+1 <= ARR_SIZE) {
                    return [xc,yc+1];
                }
            }
            var i = xc;
            var j = yc + 1;
            while (!contains(blanks,[i,j]) && j <= ARR_SIZE) {
                if (inputVals[i-1][j-1] == "") {
                    return [i,j];
                }
                j++;
            }
            // we got to end of word so find beginning
            j--;
            var end = j;
            while (!contains(blanks,[i,j]) && j > 0) {
                j--;
            }
            j++;
            while (j != end) {
                if (inputVals[i-1][j-1] == "") {
                    return [i,j];
                }
                j++;
            }
            // the word is completed so just return the position we were at
            return [xc,yc];
        default:
            // if invalid dir number
            console.log("invalid dir: " + direction);
    }
}

// only goes into this function if the space selected while the delete
//      button is hit is currently empty (other case dealt with in onkeyup)
// direction = 0 (right) | 1 (down)
function getNextDelete(xc,yc,direction) {
    switch(direction) {
        case 0:
            if (contains(blanks,[xc-1,yc]) || xc == 1) {
                return [xc,yc];
            }
            if (fixedBoxes[xc-1][yc-1] == 2 || fixedBoxes[xc-1][yc-1] == 5) {
                return [xc-1,yc];
            }
            if (inputVals[xc-2][yc-1] != "" && fixedBoxes[xc-2][yc-1] != 2 && fixedBoxes[xc-2][yc-1] != 5) {
                inputVals[xc-2][yc-1] = "";
                inputBoxes[xc-2][yc-1].value("");
            }
            return [xc-1,yc];
        case 1:
            if (contains(blanks,[xc,yc-1]) || yc == 1) {
                return [xc,yc];
            }
            if (fixedBoxes[xc-1][yc-1] == 2 || fixedBoxes[xc-1][yc-1] == 5) {
                return [xc,yc-1];
            }
            if (inputVals[xc-1][yc-2] != "" && fixedBoxes[xc-1][yc-2] != 2 && fixedBoxes[xc-1][yc-2] != 5) {
                inputVals[xc-1][yc-2] = "";
                inputBoxes[xc-1][yc-2].value("");
            }
            return [xc,yc-1];
        default:
            // if invalid dir number
            console.log("invalid dir: " + direction);
    }
}


// given the box being input to, returns whether the puzzle will be
//  entirely filled in after this box
function lastLtr(curx,cury) {
    var lastLetter = false;
    if (inputBoxes[curx-1][cury-1].value() == "") {
        lastLetter = true;
        for (var i = 1; i <= ARR_SIZE; i++) {
            for (var j = 1; j <= ARR_SIZE; j++) {
                if (contains(blanks,[i,j]) || (curx == i && cury == j)) {
                    continue;
                } else {
                    if (inputBoxes[i-1][j-1].value() == "") {
                        lastLetter = false;
                        break;
                    }
                }
            }
            if (!lastLetter) {
                break;
            }
        }
    }
    return lastLetter;
}


//
// CODE TO CALL TO DELAY
//      delay(function(){
//          [all code to do delayed here]
//      }, 1000 );  <---- this will delay 1 second
//
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();


document.onkeyup = function(evt) {
    evt = evt || window.event;
    key = evt.keyCode;
    if (key == 91 || key == 93 || key == 224 || key == 16 || key == 17 || key == 18 || key == 27) {
        extraKeyDown = false;
        return;
    }
}

document.onkeydown = function(evt) {
    if (noClick) {
        return;
    }

    evt = evt || window.event;
    key = evt.keyCode;
    if (key == 91 || key == 93 || key == 224 || key == 16 || key == 17 || key == 18 || key == 27) {
        extraKeyDown = true;
        return;
    }

    if (extraKeyDown) {
        return;
    }

    if (key == 37) {
        // left
        evt.preventDefault();
        if (dir) {
            var [nx,ny] = getNextArrows(curx,cury,2);
            curx = nx;
            cury = ny;
        } else {
            dir = !dir;
        }
        //console.log(curx,cury,dir);
        setSelected(curx,cury,dir);
        return;
    } else if (key == 38) {
        // up
        evt.preventDefault();
        if (dir) {
            dir = !dir;
        } else {
            var [nx,ny] = getNextArrows(curx,cury,3);
            curx = nx;
            cury = ny;
        }
        //console.log(curx,cury,dir);
        setSelected(curx,cury,dir);
        return;
    } else if (key == 39) {
        // right
        evt.preventDefault();
        if (dir) {
            var [nx,ny] = getNextArrows(curx,cury,0);
            curx = nx;
            cury = ny;
        } else {
            dir = !dir;
        }
        //console.log(curx,cury,dir);
        setSelected(curx,cury,dir);
        return;
    } else if (key == 40) {
        // down
        evt.preventDefault();
        if (dir) {
            dir = !dir;
        } else {
            var [nx,ny] = getNextArrows(curx,cury,1);
            curx = nx;
            cury = ny;
        }
        //console.log(curx,cury,dir);
        setSelected(curx,cury,dir);
        return;
    }

    if (fixedBoxes[curx-1][cury-1] == 2 || fixedBoxes[curx-1][cury-1] == 5) {
        var d = 0;
        if (!dir) {
            d = 1;
        }
        if (key == 8) {
            var [nx,ny] = getNextDelete(curx,cury,d);
            curx = nx;
            cury = ny;
        } else {
            var [nx,ny] = getNextTyping(curx,cury,d);
            curx = nx;
            cury = ny;
        }

        setSelected(curx,cury,dir);
        return;
    }

    if (key != 8 && (key < 65 || (key > 90 && key < 97) || key > 122)) {
        return;
    }

    if (fixedBoxes[curx-1][cury-1] == 3) {
        fixedBoxes[curx-1][cury-1] = 4;
        drawTriangle(curx,cury);  
    }

    if (key == 8) {
        // delete
        if (inputBoxes[curx-1][cury-1].value() == "") {
            var d = 0;
            if (!dir) {
                d = 1;
            }
            var [nx,ny] = getNextDelete(curx,cury,d);
            curx = nx;
            cury = ny;
            setSelected(curx,cury,dir);
        } else {
            inputBoxes[curx-1][cury-1].value("");
            inputVals[curx-1][cury-1] = "";
            setSelected(curx,cury,dir);
        }
        return;
    }

    // make uppercase
    if (key >= 97 && key <= 122) {
        key = key - 32;
    }

    if (key >= 65 && key <= 90) {
        // check if finishing puzzle
        var lastLetter = lastLtr(curx,cury);

        // check if previously empty space
        var prevEmpty = false;
        if (inputVals[curx-1][cury-1] == "") {
            prevEmpty = true;
        }

        var str = String.fromCharCode(key);
        inputBoxes[curx-1][cury-1].value(str);
        inputVals[curx-1][cury-1] = str;
        if (dir) {
            var [nx,ny] = getNextTyping(curx,cury,0,prevEmpty);
            curx = nx;
            cury = ny;
        } else {
            var [nx,ny] = getNextTyping(curx,cury,1,prevEmpty);
            curx = nx;
            cury = ny;
        }
    
        setSelected(curx,cury,dir);

        if (lastLetter) {
            if (playerWins()) {
                delay(function() {
                    // CALL WINNING FUNCTION HERE
                    openPopup(0);
                }, 10);
            } else {
                delay(function() {
                    openPopup(1);
                }, 10);
            }
        }

    } else {
        return;
    }

    //console.log("key code pressed: " + key);
};

function playerWins() {
  for (var i = 0; i < ARR_SIZE; i = i+1) {
    for (var j = 0; j < ARR_SIZE; j = j+1) {
      if (inputBoxes[j][i] == 0) {
        continue;
      } else if (answers[i][j] != inputBoxes[j][i].value()) {
        return false;
      }
    }
  }
  return true;
}

function getClueNum(obj) {
    var txt = obj.innerHTML;
    var pos1 = txt.indexOf(">");
    var pos1 = pos1 + 1; // first digit of number
    var pos2 = txt.indexOf(".");
    var pos2 = pos2 - 1; // last digit of number
    var numstr = txt.substr(pos1,pos2);
    var num = parseInt(numstr);
    return num;
}

// d = 0 (across) | 1 (down)
function clueClicked(obj,d) {

    var num = getClueNum(obj);

    for (var i = 0; i < ARR_SIZE; i = i+1) {
        for (var j = 0; j < ARR_SIZE; j = j+1) {
            if (numbers[i][j] == num) {
                curx = j+1;
                cury = i+1;
            }
        }
    }

    switch(d) {
        case 0:
            // across
            dir = true;
            break;
        case 1:
            // down
            dir = false;
            break;
        default:
            console.log("Error: invalid direction " + d);
    }
    setSelected(curx,cury,dir);
}

function clearCorner(xcoord,ycoord) {
    tctx.clearRect(xcoord*40 - 15, (ycoord-1)*40 + 1, 14, 14);
}

function drawX(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    tctx.beginPath();
    tctx.moveTo(xcoord*40 - 3, (ycoord-1)*40 + 3); tctx.lineTo(xcoord*40 - 13, (ycoord-1)*40 + 13);
    tctx.moveTo(xcoord*40 - 13, (ycoord-1)*40 + 3); tctx.lineTo(xcoord*40 - 3, (ycoord-1)*40 + 13);
    tctx.strokeStyle = "#CC0000";
    tctx.lineWidth = 2;
    tctx.stroke();
    tctx.closePath();
}

function drawCheckmark(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    tctx.beginPath();
    tctx.moveTo(xcoord*40 - 13, (ycoord-1)*40 + 7);
    tctx.lineTo(xcoord*40 - 10, (ycoord-1)*40 + 10);
    tctx.lineTo(xcoord*40 - 3, (ycoord-1)*40 + 3);
    tctx.strokeStyle = "#00802b";
    tctx.lineWidth = 3;
    tctx.stroke();
    tctx.closePath();
}

function drawTriangle(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    tctx.beginPath();
    tctx.moveTo(xcoord*40-13, (ycoord-1)*40 + 3);
    tctx.lineTo(xcoord*40-3, (ycoord-1)*40 + 13);
    tctx.lineTo(xcoord*40-3, (ycoord-1)*40 + 3);
    tctx.lineTo(xcoord*40-13, (ycoord-1)*40 + 3);

    tctx.fillStyle = "#FF0000";
    tctx.fill();

    tctx.closePath();

    tctx.beginPath();
    tctx.moveTo(xcoord*40-11, (ycoord-1)*40 + 4);
    tctx.lineTo(xcoord*40-4, (ycoord-1)*40 + 11);
    tctx.lineTo(xcoord*40-4, (ycoord-1)*40 + 4);
    tctx.lineTo(xcoord*40-11, (ycoord-1)*40 + 4);

    tctx.fillStyle = "#000000";
    tctx.fill();

    tctx.closePath();
}

//
//  type = 0 (check) | 1 (reveal)
//
function helpBox(type,x,y) {
    if (type == 0) { // if check box 
        if (fixedBoxes[x-1][y-1] == 2 || fixedBoxes[x-1][y-1] == 5) {
            return;
        }
        if (inputBoxes[x-1][y-1].value() == answers[y-1][x-1]) {
            fixedBoxes[x-1][y-1] = 5;
            drawCheckmark(x,y);
        } else {
            fixedBoxes[x-1][y-1] = 3;
            drawX(x,y);
        }
    } else { // if reveal box
        clearCorner(x,y);

        var lastLetter = lastLtr(x,y);

        inputBoxes[x-1][y-1].value(answers[y-1][x-1]);
        inputVals[x-1][y-1] = answers[y-1][x-1];
        inputBoxes[x-1][y-1].fontColor("#0044cc");
        fixedBoxes[x-1][y-1] = 2;

        if (lastLetter) {
            if (playerWins()) {
                delay(function() {
                    // CALL WINNING FUNCTION HERE
                    openPopup(0);
                }, 10);
            } else {
                delay(function() {
                    openPopup(1);
                }, 10);
            }
        }
    }
}

function getCompletionPercent() {
    var tot = 0;
    var comp = 0;
    for (var i = 0; i < ARR_SIZE; i++) {
        for (var j = 0; j < ARR_SIZE; j++) {
            if (contains(blanks,[i+1,j+1])) {
                continue;
            } else {
                tot++;
                if (inputVals[i][j] != "") {
                    comp++;
                }
            }
        }
    }
    if (tot == 0) {
        console.log("Error: couldn't count completed percent of squares");
        return -1;
    } else {
        var perc = comp / tot;
        perc = perc * 100; // get it in percent
        perc = perc.toFixed(1);
        return perc;
    }
}


function crossBack() {
    // SAVE STATE OF PUZZLE AND GO BACK
    document.location.href = "crossword.html";
}