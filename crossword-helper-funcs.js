function initializeHighlightedSpace() {
    var i = 1;
    while (answers[0][i-1] == 0) {
        i++;
    }
    curx = i;
    cury = 1;
    dir = true; // true is across, false is down
}

function initializeGridPattern() {
    // draw basic lines for grid
    tctx.beginPath();

    for (var i = 1; i < ARR_SIZE; i++) {
        tctx.moveTo(i*BOX_SIZE,0); tctx.lineTo(i*BOX_SIZE,BOARD_SIZE);
        tctx.moveTo(0,i*BOX_SIZE); tctx.lineTo(BOARD_SIZE,i*BOX_SIZE);
    }

    tctx.stroke();
    tctx.closePath();

    // draw black squares based on answers array
    tctx.beginPath();

    for (var i = 0; i < ARR_SIZE; i++) {
        for (var j = 0; j < ARR_SIZE; j++) {
            //console.log(i + " " + j + " " + answers[i][j]);
            if (answers[i][j] == 0) {
                tctx.rect(j*BOX_SIZE,i*BOX_SIZE,BOX_SIZE,BOX_SIZE);
            }
        }
    }

    tctx.fillStyle = "#000000";
    tctx.fill();

    tctx.closePath();
}

function initializeClueNumbers() {
    ctx.font = "10px Arial";
    var ctr = 1;
    for (var i = 0; i < ARR_SIZE; i = i+1) {
      numbers[i] = new Array(ARR_SIZE);
      for (var j = 0; j < ARR_SIZE; j = j+1) {
        if (answers[i][j] == 0) {
          numbers[i][j] = 0;
          continue;
        }
        if (j == 0 || i == 0 || answers[i][j-1] == 0 || answers[i-1][j] == 0) {
          if (i == 0) {
            tctx.fillText(ctr,j*BOX_SIZE + 3, i*BOX_SIZE + 10);
          } else if (j == 0) {
            tctx.fillText(ctr,j*BOX_SIZE + 1, i*BOX_SIZE + 12);
          } else {
            tctx.fillText(ctr,j*BOX_SIZE + 3, i*BOX_SIZE + 12);
          }
          // store this number at correct space
          numbers[i][j] = ctr;

          ctr = ctr + 1;
        } else {
          numbers[i][j] = -1;
        }
      }
    }
}

function initializeBlanksArray() {
    for (var i = BOX_SIZE/2; i < BOARD_SIZE; i = i + BOX_SIZE) {
      for (var j = BOX_SIZE/2; j < BOARD_SIZE; j = j + BOX_SIZE) {
        tobj = tctx.getImageData(i,j,1,1);
        obj = ctx.getImageData(i,j,1,1);
        //console.log(i,j,obj.data);
        if (tobj.data[0] == 0 && tobj.data[1] == 0 && tobj.data[2] == 0 && tobj.data[3] == 255) {
          var tx = Math.ceil(i/BOX_SIZE);
          var ty = Math.ceil(j/BOX_SIZE);
          blanks.push([tx,ty]); 
        } else if (obj.data[0] == 211 && obj.data[1] == 211 && obj.data[2] == 211 && obj.data[3] == 255) {
          var tx = Math.ceil(i/BOX_SIZE);
          var ty = Math.ceil(j/BOX_SIZE);
          highlighted.push([tx,ty]);
        }
      }
    }
}

// 0 = blank space
// 1 = normal
// 2 = fixed (no marks, i.e. revealed)
// 3 = checked but not right (not changed since checked)
// 4 = normal after checked (changed since checked)
// 5 = fixed (with checkmark, i.e. checked and correct)
function initializeFixedBoxes() {
    fixedBoxes = new Array(ARR_SIZE);
    for (var i = 1; i <= ARR_SIZE; i = i+1) {
        fixedBoxes[i-1] = new Array(ARR_SIZE);
        for (var j = 1; j <= ARR_SIZE; j = j+1) {
            if (contains(blanks,[i,j])) {
                fixedBoxes[i-1][j-1] = 0;
            } else {
                fixedBoxes[i-1][j-1] = 1;
            }
        }
    }

    //console.log(fixedBoxes);
}

function initializeInputBoxes() {
    var fontSize = 26;
    var fontWidth = 23;
    var fontHeight = 23;
    var fontOffsetX = 12;
    var fontOffsetY = 16;
    if (ARR_SIZE == 21) {
        fontSize = 18;
        fontWidth = 14;
        fontHeight = 14;
        fontOffsetX = 9;
        fontOffsetY = 15;
    }
    //
    // Define the array of inputBoxes that will allow the user to fill letters
    //    into the squares in the puzzle -- stored as a 2D 15x15 array
    //
    inputBoxes = new Array(ARR_SIZE);
    inputVals = [];

    for (var i = 1; i <= ARR_SIZE; i = i+1) {
      inputBoxes[i-1] = new Array(ARR_SIZE);
      inputVals[i-1] = [];
      for (var j = 1; j <= ARR_SIZE; j = j+1) {
        inputVals[i-1][j-1] = "";
        if (contains(blanks,[i,j])) {
          inputBoxes[i-1][j-1] = 0;
        } else if (contains(highlighted,[i,j])) {
          inputBoxes[i-1][j-1] = new CanvasInput({
            canvas: topcanvas,
            fontSize: fontSize,
            readonly: true,
            x: BOX_SIZE*(i-1) + fontOffsetX,
            y: BOX_SIZE*(j-1) + fontOffsetY,
            fontFamily: myFont,
            fontColor: '#212121',
            fontWeight: 'bold',
            width: fontWidth,
            height: fontHeight,
            padding: 0,
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 0,
            backgroundColor: '#D3D3D3',
            boxShadow: '0px 0px 0px #000',
            innerShadow: '0px 0px 0px rgba(0, 0, 0, 0.5)',
            placeHolder: ''
          });
        } else {
          inputBoxes[i-1][j-1] = new CanvasInput({
            canvas: topcanvas,
            fontSize: fontSize,
            readonly: true,
            x: BOX_SIZE*(i-1) + fontOffsetX,
            y: BOX_SIZE*(j-1) + fontOffsetY,
            fontFamily: myFont,
            fontColor: '#000000',
            fontWeight: 'bold',
            width: fontWidth,
            height: fontHeight,
            padding: 0,
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 0,
            backgroundColor: '#F0F0F0',
            boxShadow: '0px 0px 0px #000',
            innerShadow: '0px 0px 0px rgba(0, 0, 0, 0.5)',
            placeHolder: ''
          });
        }
      }
    }
    //console.log(inputBoxes);
    //console.log(inputVals);
}


// when selected words are implemented this should set the word given by
//    the x,y coords (given in 1...15 each) and dir (true for horizontal)
//    as the currently selected word, whatever we want that to mean
//
function setSelected(curx,cury,dir) {
    // stored current square to pass to gray function at end of this function
    var thisX = curx;
    var thisY = cury;
    var thisDir = dir;
    
    // clear prev highlighted text boxes
    for (var i = 0; i < ARR_SIZE; i++) {
        for (var j = 0; j < ARR_SIZE; j++) {
            if (inputBoxes[i][j] != 0) {
                if (contains(highlighted,[i+1,j+1])) {
                    inputBoxes[i][j].backgroundColor('#D3D3D3');
                } else {
                    inputBoxes[i][j].backgroundColor('#F0F0F0');
                }
            }
        }
    }

    // clear prev highlighted rectangle
    mctx.clearRect(0,0,midcanvas.width,midcanvas.height);

    // paint new highlighted area
    if (dir) {
        //console.log("GOING ACROSS");
        var i1 = curx;
        while (!contains(blanks,[i1,cury]) && i1 <= ARR_SIZE) {
          i1++;
        }
        var i2 = curx;
        while (!contains(blanks,[i2,cury]) && i2 >= 1) {
          i2--;
        }
        mctx.beginPath();
        mctx.rect(BOX_SIZE*i2, BOX_SIZE*cury - BOX_SIZE, (i1-i2-1)*BOX_SIZE, BOX_SIZE);
        mctx.fillStyle = 'rgba(230, 218, 0, 1.0)';
        mctx.fill();
        mctx.closePath();

        for (var i = i2; i < i1-1; i++) {
            inputBoxes[i][cury-1].backgroundColor('rgba(230, 218, 0, 1.0)');
        }
    } else {
        //console.log("GOING DOWN");
        var j1 = cury;
        while (!contains(blanks,[curx,j1]) && j1 <= ARR_SIZE) {
            j1++;
        }
        var j2 = cury;
        while (!contains(blanks,[curx,j2]) && j2 >= 1) {
            j2--;
        }
        mctx.beginPath();
        mctx.rect(BOX_SIZE*curx - BOX_SIZE, BOX_SIZE*j2,  BOX_SIZE, (j1-j2-1)*BOX_SIZE);
        mctx.fillStyle = 'rgba(230, 218, 0, 1.0)';
        mctx.fill();
        mctx.closePath();

        for (var j = j2; j < j1-1; j++) {
            inputBoxes[curx-1][j].backgroundColor('rgba(230, 218, 0, 1.0)');
        }
    }
    mctx.beginPath();
    mctx.rect((curx-1)*BOX_SIZE, (cury-1)*BOX_SIZE, BOX_SIZE, BOX_SIZE);
    mctx.fillStyle = 'rgba(180,170,0,1.0)';
    mctx.fill();
    mctx.closePath();

    inputBoxes[curx-1][cury-1].backgroundColor('rgba(180,170,0,0.4)');

    //
    // highlight clue
    //
    
    // clear prev highlighted clue
    pcList[pcIndex].style.cssText = 'background-color: clear;';

    var num = -1;
    if (dir) {
        var i = curx-1;
        while (i >= 0 && numbers[cury-1][i] != 0) {
            i = i-1;
        }
        num = numbers[cury-1][i+1];
    } else {
        var j = cury-1;
        while (j >= 0 && numbers[j][curx-1] != 0) {
            j = j-1;
        }
        num = numbers[j+1][curx-1];
    }

    //console.log("Number: " + num + " Across? " + dir);

    pcList = acrossList;
    pcListInd = 0;
    var clueScroll = acrossClues;
    if (!dir) {
        pcList = downList;
        pcListInd = 1;
        clueScroll = downClues;
    }
    for (var i = 0; i < pcList.length; i = i+1) {
        var obj = pcList[i];
        var n = getClueNum(obj);
        if (n == num) {
            pcIndex = i;
            obj.style.cssText = 'background-color: yellow;';
            var topCoord = pcList[0].offsetTop;
            clueScroll.scrollTop = obj.offsetTop - topCoord;
            break;
        }
    }

    // DEALING WITH LOCAL STORAGE

    localStorage.setItem('curx' + PUZZLE_NUM,JSON.stringify(curx));
    localStorage.setItem('cury' + PUZZLE_NUM,JSON.stringify(cury));
    localStorage.setItem('direction' + PUZZLE_NUM,JSON.stringify(dir));
    localStorage.setItem('inputVals' + PUZZLE_NUM,JSON.stringify(inputVals));
    localStorage.setItem('fixedBoxes' + PUZZLE_NUM,JSON.stringify(fixedBoxes));
    localStorage.setItem('pcListInd' + PUZZLE_NUM,JSON.stringify(pcListInd));
    localStorage.setItem('pcIndex' + PUZZLE_NUM,JSON.stringify(pcIndex));
    var perc = getCompletionPercent();
    localStorage.setItem('percent' + PUZZLE_NUM,perc);

    grayOutDoneClues(thisX, thisY, thisDir);
}

function applyLocalStorage() {
    if (window.localStorage) {
        //
        // Revert to saved state...
        //

        if (localStorage.getItem("curx" + PUZZLE_NUM) != null && localStorage.getItem("cury" + PUZZLE_NUM) != null
                && localStorage.getItem("direction" + PUZZLE_NUM) != null) {
            curx = JSON.parse(localStorage.getItem("curx" + PUZZLE_NUM));
            cury = JSON.parse(localStorage.getItem("cury" + PUZZLE_NUM));
            dir = JSON.parse(localStorage.getItem("direction" + PUZZLE_NUM));                
        }

        if (localStorage.getItem("pcListInd" + PUZZLE_NUM) != null && localStorage.getItem("pcIndex" + PUZZLE_NUM) != null) {
            pcListInd = JSON.parse(localStorage.getItem("pcListInd" + PUZZLE_NUM));
            pcList = acrossList;
            if (pcListInd == 1) {
                pcList = downList;
            }
            if (localStorage.getItem("pcIndex" + PUZZLE_NUM)) {
                pcIndex = localStorage.getItem("pcIndex" + PUZZLE_NUM);
            }
        }

        if (localStorage.getItem("fixedBoxes" + PUZZLE_NUM) != null && localStorage.getItem("inputVals" + PUZZLE_NUM) != null) {
            fixedBoxes = JSON.parse(localStorage.getItem("fixedBoxes" + PUZZLE_NUM));
            inputVals = JSON.parse(localStorage.getItem("inputVals" + PUZZLE_NUM));
            
            for (var i = 1; i <= ARR_SIZE; i = i+1) {
                for (var j = 1; j <= ARR_SIZE; j = j+1) {
                    if (inputBoxes[i-1][j-1] == 0) {
                        continue;
                    }
                    inputBoxes[i-1][j-1].value(inputVals[i-1][j-1]);
                    if (fixedBoxes[i-1][j-1] == 2) {
                        inputBoxes[i-1][j-1].fontColor("#0044cc");
                    } else if (fixedBoxes[i-1][j-1] == 3) {
                        drawX(i,j);
                    } else if (fixedBoxes[i-1][j-1] == 4) {
                        drawTriangle(i,j);
                    } else if (fixedBoxes[i-1][j-1] == 5) {
                        drawCheckmark(i,j);
                    }
                }
            }
        }
    }
}

function closePopup() {
    wrapper.style.cssText = "filter: blur(0px);";
    popup.style.cssText = "display: none;";
    noClick = false;

    if (closebtn.innerHTML == "Resume"
        || popupmsg.innerHTML == "Oops, there are still one or more errors to fix!"
        || closebtn.innerHTML == "Let's Go") {
        // if game not over...
        timer = setInterval(setTime, 1000);
        idleTimer = setInterval(incrementIdle, 1000);
    }
}


// msg = 0 (WIN) | 1 (NOT WIN) | 2 (PAUSED) | 3 (STARTING)
function openPopup(msg) {
    clearInterval(timer);
    clearInterval(idleTimer);
	var msgstr = "";
	switch(msg) {
		case 0:
            var minstr = Math.floor(totalSeconds/60);
            var secstr = totalSeconds%60;
            var timestr = "";
            if (minstr != 1 && secstr != 1) {
                timestr = minstr + " minutes and " + secstr + " seconds";
            } else if (minstr == 1 && secstr != 1) {
                timestr = minstr + " minute and " + secstr + " seconds";
            } else if (minstr != 1 && secstr == 1) {
                timestr = minstr + " minutes and " + secstr + " second";
            } else {
                timestr = minstr + " minute and " + secstr + " second";
            }
			msgstr = "Congratulations, you've successfully solved the puzzle in " + timestr + "!";
            closebtn.innerHTML = "Close";

            var audio = new Audio('sounds/applause.mp3');
            audio.play();
			break;
		case 1:
			msgstr = "Oops, there are still one or more errors to fix!";
            closebtn.innerHTML = "Close";
			break;
        case 2:
            msgstr = "The game has been paused."
            closebtn.innerHTML = "Resume";
            break;
        case 3:
            msgstr = "Ready to start?"
            closebtn.innerHTML = "Let's Go";
            break;
        case 4:
            msgstr = "Your game has been paused due to inactivity.";
            closebtn.innerHTML = "Resume";
            break;
		default:
			console.log("Error: Invalid msg number passed into openPopup: " + msg);

	}
    if (msg == 0) {
        popupmsg.style.cssText = "font-size: 16pt;";
    } else {
        popupmsg.style.cssText = "font-size: 22pt;";
    }

	wrapper.style.cssText = "filter: blur(5px);";
	popupmsg.innerHTML = msgstr;
	popup.style.cssText = "display: inline-block";
    noClick = true;
}

function openResetPopup() {
    clearInterval(timer);
    clearInterval(idleTimer);

    wrapper.style.cssText = "filter: blur(5px);";
    resetpopup.style.cssText = "display: inline-block";
    noClick = true;
}

function cancelResetPopup() {
    wrapper.style.cssText = "filter: blur(0px);";
    resetpopup.style.cssText = "display: none;";
    noClick = false;
    timer = setInterval(setTime, 1000);
    idleTimer = setInterval(incrementIdle, 1000);
}

function continueResetPopup() {
    wrapper.style.cssText = "filter: blur(0px);";
    resetpopup.style.cssText = "display: none;";
    noClick = false;

    idleSeconds = 0;
    totalSeconds = 0;
    secondsLabel.innerHTML = pad(totalSeconds%60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));

    // clear local storage for this puzzle
    resetLocalstorage();

    timer = setInterval(setTime, 1000);
    idleTimer = setInterval(incrementIdle, 1000);
    openPopup(3);
}

function resetLocalstorage() {
    gameover = false;
    localStorage.setItem('gameover' + PUZZLE_NUM,JSON.stringify(gameover));
    localStorage.setItem('time' + PUZZLE_NUM, JSON.stringify(totalSeconds));
    initializeInputBoxes();
    initializeFixedBoxes();
    clearDrawing();
    initializeHighlightedSpace();
    setSelected(curx,cury,dir);
}


function pad(val) {
    var valString = val + "";
    if(valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
}

function pauseGame() {
    if (gameover) {
        return;
    }
    openPopup(2);
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
                    j = ARR_SIZE;
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
                    i = ARR_SIZE;
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
            if (gameover) {
                return [xc-1,yc];
            }
            if (fixedBoxes[xc-2][yc-1] != 2 && fixedBoxes[xc-2][yc-1] != 5) {
                inputVals[xc-2][yc-1] = "";
                inputBoxes[xc-2][yc-1].value("");
            }
            return [xc-1,yc];
        case 1:
            if (contains(blanks,[xc,yc-1]) || yc == 1) {
                return [xc,yc];
            }
            if (gameover) {
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

// used for just the enter key
// if enter is pressed, should go to next word in direction specified in first open space
// if backward == true, should go to previous word
function getNextEnter(xc,yc,direction,backward) {
    switch(direction) {
        case 0:
            // ACROSS
            switch(backward) {
                case true:
                    // find beginning of this word
                    var i = xc;
                    var j = yc;
                    while (!contains(blanks,[i,j])) {
                        i--;
                        if (i <= 0) {
                            j--;
                            i = ARR_SIZE;
                            if (j <= 0) {
                                j = ARR_SIZE;
                            }
                            break;
                        }
                    }

                    var puzzleFull = false;
                    // now we are on a black square or end of a row
                    // so move back until empty square
                    while (contains(blanks,[i,j]) || inputVals[i-1][j-1] != "") {
                        i--;
                        if (i <= 0) {
                            j--;
                            i = ARR_SIZE;
                            if (j <= 0) {
                                j = ARR_SIZE;
                            }
                        }
                        // test for infinite loop
                        if (i == xc && j == yc) {
                            // back to original space so break
                            puzzleFull = true;
                            break;
                        }
                    }

                    // now we are on a blank square or original location
                    // so find beginning of this word
                    while (!contains(blanks,[i,j])) {
                        if (inputVals[i-1][j-1] == "") {
                            puzzleFull = false;
                        }
                        i--;
                        if (i == 0) {
                            // then we are at the beginning of a line so stop
                            break;
                        }
                    }
                    // we went one too far so readjust
                    i++;

                    if (puzzleFull) {
                        // find beginning of prev word
                        i--;
                        if (i <= 0) {
                            j--;
                            i = ARR_SIZE;
                            if (j <= 0) {
                                j = ARR_SIZE;
                            }
                        }
                        while (contains(blanks,[i,j])) {
                            i--;
                            if (i <= 0) {
                                j--;
                                i = ARR_SIZE;
                                if (j <= 0) {
                                    j = ARR_SIZE;
                                }
                            }
                        }

                        // now we are on the last letter of a word
                        while (!contains(blanks,[i,j])) {
                            i--;
                            if (i == 0) {
                                break;
                            }
                        }
                        // readjust to be at beginning of the word
                        i++;

                        return [i,j];
                        
                    }

                    // so now we know puzzle isn't full, so our current word has an empty space
                    // find first empty space in our word
                    while (inputVals[i-1][j-1] != "") {
                        i++;
                        if (i > ARR_SIZE) {
                            // this should be impossible given our previous checks
                            console.log("Went too far somehow, i: " + i + ", j: " + j);
                            console.log("Reverting to space we were on...");
                            return [xc,yc];
                        }
                    }

                    return [i,j];

                case false:
                    // find end of this word
                    var i = xc;
                    var j = yc;
                    while (!contains(blanks,[i,j])) {
                        i++;
                        if (i > ARR_SIZE) {
                            j++;
                            i = 1;
                            if (j > ARR_SIZE) {
                                j = 1;
                            }
                            break;
                        }
                    }

                    // now we are on a black square or beginning of a row
                    // so go until empty square
                    while (contains(blanks,[i,j]) || inputVals[i-1][j-1] != "") {
                        i++;
                        if (i > ARR_SIZE) {
                            j++;
                            i = 1;
                            if (j > ARR_SIZE) {
                                j = 1;
                            }
                        }
                        // test for infinite loop
                        if (i == xc && j == yc) {
                            // back to original space so return next word
                            while (!contains(blanks,[i,j])) {
                                i++;
                                if (i > ARR_SIZE) {
                                    j++;
                                    i = 1;
                                    if (j > ARR_SIZE) {
                                        j = 1;
                                    }
                                    break;
                                }
                            }
                            while (contains(blanks,[i,j])) {
                                i++;
                                if (i > ARR_SIZE) {
                                    j++;
                                    i = 1;
                                    if (j > ARR_SIZE) {
                                        j = 1;
                                    }
                                }
                            }
                            return [i,j];
                        }
                    }
                    // now we are on a square that is not black, and is blank
                    return [i,j];

                default:
                    // if invalid backward boolean val
                    console.log("invalid boolean val for backward: " + backward);
            }
        case 1:
            // DOWN
            switch(backward) {
                case true:
                    // find beginning of this word
                    var i = xc;
                    var j = yc;
                    while (!contains(blanks,[i,j]) && j > 0) {
                        j--;
                    }
                    // now we are on a black or at j = 0 (above grid)
                    j++;
                    // now we are at first square in current word
                    // store this spot for check for full puzzle
                    var initX = i;
                    var initY = j;
                    // need to go left until hit beginning of another word
                    var ifirst = 1;
                    var jfirst = 1;
                    while (true) {
                        i--;
                        if (i <= 0) {
                            j--;
                            i = ARR_SIZE;
                            if (j <= 0) {
                                j = ARR_SIZE;
                            }
                        }

                        if (!contains(blanks,[i,j]) && (contains(blanks,[i,j-1]) || j == 1)) {
                            // save this location in case full puzzle
                            if (ifirst == 1 && jfirst == 1) {
                                ifirst = i;
                                jfirst = j;
                            }
                            // then we are on first of a word so check to see if there is a spot open
                            var i1 = i;
                            var j1 = j;
                            var foundBlank = false;
                            while (!contains(blanks,[i1,j1]) && j1 != ARR_SIZE) {
                                if (inputVals[i1-1][j1-1] == "") {
                                    foundBlank = true;
                                    break;
                                }
                                j1++;
                            }
                            if (foundBlank) {
                                return [i1,j1];
                            }
                            // else this word is full so move to next one
                        }

                        // check for full puzzle
                        if (i == initX && j == initY) {
                            //console.log("Reverting to the default return value of [" + ifirst + "," + jfirst + "] because i=" + i + ", initX=" + initX + "; j=" + j + ", initY=" + initY);
                            // go to next word if puzzle is full
                            return [ifirst,jfirst];
                        }
                    }
                case false:
                    // find beginning of this word
                    var i = xc;
                    var j = yc;
                    while (!contains(blanks,[i,j]) && j > 0) {
                        j--;
                    }
                    // now we are on a black or at j = 0 (above grid)
                    j++;
                    // now we are at first square in current word
                    // store this spot for check for full puzzle
                    var initX = i;
                    var initY = j;
                    // need to go right until hit beginning of another word
                    var ifirst = 1;
                    var jfirst = 1;
                    while (true) {
                        i++;
                        if (i > ARR_SIZE) {
                            j++;
                            i = 1;
                            if (j > ARR_SIZE) {
                                j = 1;
                            }
                        }
                        //console.log("Trying space " + i + "," + j + "...");

                        if (!contains(blanks,[i,j]) && (contains(blanks,[i,j-1]) || j == 1)) {
                            //console.log("Found down word at " + i + "," + j);
                            // save this location in case full puzzle
                            if (ifirst == 1 && jfirst == 1) {
                                ifirst = i;
                                jfirst = j;
                            }
                            // then we are on first of a word so check to see if there is a spot open
                            var i1 = i;
                            var j1 = j;
                            var foundBlank = false;
                            while (!contains(blanks,[i1,j1]) && j1 <= ARR_SIZE) {
                                //console.log("Looking for a blank space at " + i1 + "," + j1);
                                if (inputVals[i1-1][j1-1] == "") {
                                    //console.log("Found blank space at " + i1 + "," + j1);
                                    foundBlank = true;
                                    break;
                                }
                                j1++;
                            }
                            if (foundBlank) {
                                return [i1,j1];
                            }
                            // else this word is full so move to next one
                        } 
                        /*else {
                            console.log("Space at " + i + " " + j + " is not beginning of a down word.");
                        }*/

                        // check for full puzzle
                        if (i == initX && j == initY) {
                            //console.log("Reverting to the default return value of [" + ifirst + "," + jfirst + "] because i=" + i + ", initX=" + initX + "; j=" + j + ", initY=" + initY);
                            // go to next word if puzzle is full
                            return [ifirst,jfirst];
                        }
                    }

                default:
                    // if invalid backward boolean val
                    console.log("invalid boolean val for backward: " + backward);
            }
            
        default:
            // if invalid dir number
            console.log("invalid dir: " + direction);
    }
}


// given the box being input to, returns whether the puzzle will be
//  entirely filled in after this box
function lastLtr(curx,cury) {
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


document.onmousemove = function() {
    console.log("Mouse moved, resetting idle timer.");
    idleSeconds = 0;
}

document.onclick = function() {
    console.log("Mouse clicked, resetting idle timer.");
    idleSeconds = 0;
}

document.onkeyup = function(evt) {
    evt = evt || window.event;
    key = evt.keyCode;
    if (key == 91 || key == 93 || key == 224 || key == 17 || key == 18 || key == 27) {
        extraKeyDown = false;
        return;
    }
    if (key == 16) {
        shiftKeyDown = false;
        return;
    }
}

document.onkeydown = function(evt) {
    console.log("Key pressed, resetting idle timer.");
    console.log("noclick: " + noClick);
    console.log("gameover: " + gameover);
    console.log(fixedBoxes);
    idleSeconds = 0;

    if (noClick) {
        return;
    }
    //console.log(evt.keyCode);

    evt = evt || window.event;
    key = evt.keyCode;

    // check for special keys that might be used to perform a keyboard shortcut -- don't allow typing if so
    if (key == 91 || key == 93 || key == 224 || key == 17 || key == 18 || key == 27) {
        extraKeyDown = true;
        return;
    }

    // prevent going back a page in some browsers on delete press
    if (key == 8) {
        evt.preventDefault();
    }

    // check for shift key (used for shift + enter to go back a word)
    if (key == 16) {
        shiftKeyDown = true;
        return;
    }

    if (extraKeyDown) {
        return;
    }

    // check the 4 arrow keys for moving about the grid
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

    // enter key or tab key should move to next word in current direction
    // if shift also down should move to prev word in current direction
    if (key == 13 || key == 9) {
        evt.preventDefault();
        var d = (dir) ? 0 : 1;
        var [nx,ny] = getNextEnter(curx,cury,d,shiftKeyDown);
        curx = nx;
        cury = ny;

        setSelected(curx,cury,dir);
        return;
    }


    // if no typing allowed either in this box or anywhere, go back a space with delete,
    //  and forward a space with any other key
    if (fixedBoxes[curx-1][cury-1] == 2 || fixedBoxes[curx-1][cury-1] == 5 || gameover) {
        console.log("Not allowed to type here");
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
                    gameover = true;
                    openPopup(0);
                }, 10);
            } else if (prevEmpty) {
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


/***********************************************************************************
*** GRABBED FROM https://www.kirupa.com/html5/detect_whether_font_is_installed.htm
***********************************************************************************/
//
// Call this function and pass in the name of the font you want to check for availability.
//
function doesFontExist(fontName) {
    // creating our in-memory Canvas element where the magic happens
    var fontCanvas = document.createElement("canvas");
    var fontContext = fontCanvas.getContext("2d");
     
    // the text whose final pixel size I want to measure
    var text = "abcdefghijklmnopqrstuvwxyz0123456789";
     
    // specifying the baseline font
    fontContext.font = "72px monospace";
     
    // checking the size of the baseline text
    var baselineSize = fontContext.measureText(text).width;
     
    // specifying the font whose existence we want to check
    fontContext.font = "72px '" + fontName + "', monospace";
     
    // checking the size of the font we want to check
    var newSize = fontContext.measureText(text).width;
     
    // removing the Canvas element we created
    fontCanvas = null;
     
    //
    // If the size of the two text instances is the same, the font does not exist because it is being rendered
    // using the default sans-serif font
    //
    if (newSize == baselineSize) {
        return false;
    } else {
        return true;
    }
}

/***********************************************************************************
******************************* USAGE FOR ABOVE FUNCTION ***************************
***********************************************************************************/

// check to see what fonts are available
var fontChoice1 = 'Lucida Console';
var fontChoice2 = 'Consolas';
var fontChoice3 = 'Courier New'; // web safe: should be available on all browsers
var myFont = fontChoice3;
if (doesFontExist(fontChoice1)) {
    console.log(fontChoice1 + " is available!");
    myFont = fontChoice1;
} else if (doesFontExist(fontChoice2)) {
    console.log(fontChoice1 + " is not available, but " + fontChoice2 + " is.");
    myFont = fontChoice2;
} // else will default to fontChoice3
else {
    console.log("Neither " + fontChoice1 + " nor " + fontChoice2 + " is available, defaulting to " + fontChoice3);
}

/***********************************************************************************/


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

// given the space, tells what number word it is
// xc in [0,ARR_SIZE-1], yc in [0,ARR_SIZE-1]
// across == true if across, false if down
function getNumberBySpace(xc,yc,across) {
    if (numbers[yc][xc] == 0) {
        console.log("Error: Cannot get number for a black space at " + xc + "," + yc);
        return -1;
    }
    var i = xc;
    var j = yc;
    if (across) {
        while (!contains(blanks,[i+1,j+1]) && i >= 0) {
            i--;
        }
        return numbers[j][i+1];
    } else {
        while (!contains(blanks,[i+1,j+1]) && j >= 0) {
            j--;
        }
        return numbers[j+1][i];
    }
    
}

// adjusts the word of the spot given to be gray/not gray
// xc in [1,ARR_SIZE], yc in [1,ARR_SIZE]
// across == true if across, false if down
function adjustGrayClues(xc,yc,across) {
    var dir = 0;
    if (!across) {
        dir = 1;
    }
    var num = getNumberBySpace(xc-1,yc-1,across);
    var obj = getClueObjByNumber(num);
    if (wordIsFull(xc-1,yc-1,dir)) {
        obj.style.cssText = 'color: #909090;';
    } else {
        obj.style.cssText = 'color: #404040;';
    }
}

// given a spot in the grid and direction
// return true if the word is full and false if there is an empty space
// cx in [0,ARR_SIZE-1], cy in [0,ARR_SIZE-1]
// dir == 0 if across, dir == 1 if down
function wordIsFull(cx,cy,dir) {
    if (inputVals[cx][cy] == "") {
        return false;
    }
    switch(dir) {
        case 0:
            var i = cx;
            var j = cy;
            while (!contains(blanks,[i+1,j+1]) && i >= 0) {
                if (inputVals[i][j] == "") {
                    return false;
                }
                i--;
            }
            i = cx;
            while (!contains(blanks,[i+1,j+1]) && i < ARR_SIZE) {
                if (inputVals[i][j] == "") {
                    return false;
                }
                i++;
            }
            return true;
        case 1:
            var i = cx;
            var j = cy;
            while (!contains(blanks,[i+1,j+1]) && j >= 0) {
                if (inputVals[i][j] == "") {
                    return false;
                }
                j--;
            }
            j = cy;
            while (!contains(blanks,[i+1,j+1]) && j < ARR_SIZE) {
                if (inputVals[i][j] == "") {
                    return false;
                }
                j++;
            }
            return true;
        default:
            console.log("Error: invalid direction " + dir);
    }
}

// return the object for the clue (in the clue list)
// params: num == the number of the clue on the board
//         across == true for across, across == false for down
function getClueObjByNumber(num,across) {
    var clueList = acrossList;
    var dir = "across";
    if (!across) {
        clueList = downList;
        dir = "down";
    }
    for (var i = 0; i < clueList.length; i++) {
        var n = getClueNum(clueList[i]);
        if (n == num) {
            return clueList[i];
        }
    }
    console.log("Error: No " + dir + " clue with the number " + num + " exists.");
    return null;
}

// grays out all done clues (for on page load)
// numbers array (indexed 0 -> ARR_SIZE-1) has 0 for blanks, -1 for non-word starters
// params: curx, cury, dir (same as are stored as global vars for each crossword)
function grayOutDoneClues(curx,cury,dir) {
    // get current word so can keep it yellow
    // parameter dir is true for across / false for down
    // we redefine dir below to be 0 or 1
    var curNum = getNumberBySpace(curx-1,cury-1,dir);
    var curDir = dir;
    //console.log("Current word is number: " + curNum + " going across? " + curDir);

    // across
    var clueList = acrossList;
    var dir = 0;
    var across = true;
    for (var j = 0; j < ARR_SIZE; j++) {
        for (var i = 0; i  < ARR_SIZE; i++) {
            if (numbers[j][i] != 0 && numbers[j][i] != -1) {
                var b = false;
                if (i == 0) {
                    b = true;
                } else if (numbers[j][i-1] == 0) {
                    b = true;
                }
                if (b) {
                    if (wordIsFull(i,j,dir)) {
                        //console.log("Attempting to gray out clue at " + numbers[j][i] + " going across");
                        // gray out the corresponding clue
                        var obj = getClueObjByNumber(numbers[j][i],across);

                        if (curDir && curNum == numbers[j][i]) {
                            obj.style.cssText = 'color: #909090; background-color: yellow;';
                        } else {
                            obj.style.cssText = 'color: #909090;';
                        }
                    }
                }
            }
        }
    }

    // down
    var clueList = downList;
    var dir = 1;
    var across = false;
    for (var i = 0; i < ARR_SIZE; i++) {
        for (var j = 0; j < ARR_SIZE; j++) {
            if (numbers[j][i] != 0 && numbers[j][i] != -1) {
                var b = false;
                if (j == 0) {
                    b = true;
                } else if (numbers[j-1][i] == 0) {
                    b = true;
                }
                if (b) {
                    if (wordIsFull(i,j,dir)) {
                        //console.log("Attempting to gray out clue at " + numbers[j][i] + " going down");
                        // gray out the corresponding clue
                        var obj = getClueObjByNumber(numbers[j][i],across);
                        if (!curDir && curNum == numbers[j][i]) {
                            obj.style.cssText = 'color: #909090; background-color: yellow;';
                        } else {
                            obj.style.cssText = 'color: #909090;';
                        }
                    }
                }
            }
        }
    }
}

function clearCorner(xcoord,ycoord) {
    var size = 14;
    var offset = 15;
    if (ARR_SIZE == 21) {
        size = 9;
        offset = 10;
    }
    tctx.clearRect(xcoord*BOX_SIZE - offset, (ycoord-1)*BOX_SIZE + 1, size, size);
}

function drawX(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    var size1 = 3
    var size2 = 13;
    var strokeSize = 2;
    if (ARR_SIZE == 21) {
        //size1 = 2;
        size2 = 8;
        strokeSize = 1;
    }

    tctx.beginPath();
    tctx.moveTo(xcoord*BOX_SIZE - size1, (ycoord-1)*BOX_SIZE + size1); tctx.lineTo(xcoord*BOX_SIZE - size2, (ycoord-1)*BOX_SIZE + size2);
    tctx.moveTo(xcoord*BOX_SIZE - size2, (ycoord-1)*BOX_SIZE + size1); tctx.lineTo(xcoord*BOX_SIZE - size1, (ycoord-1)*BOX_SIZE + size2);
    tctx.strokeStyle = "#CC0000";
    tctx.lineWidth = strokeSize;
    tctx.stroke();
    tctx.closePath();
}

function drawCheckmark(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    var size1 = 3;
    var size2 = 7;
    var size3 = 10;
    var size4 = 13;
    var strokeSize = 3;
    if (ARR_SIZE == 21) {
        size1 = 2;
        size2 = 4;
        size3 = 7;
        size4 = 8;
        strokeSize = 1;
    }
    
    tctx.beginPath();
    tctx.moveTo(xcoord*BOX_SIZE - size4, (ycoord-1)*BOX_SIZE + size2);
    tctx.lineTo(xcoord*BOX_SIZE - size3, (ycoord-1)*BOX_SIZE + size3);
    tctx.lineTo(xcoord*BOX_SIZE - size1, (ycoord-1)*BOX_SIZE + size1);
    tctx.strokeStyle = "#00802b";
    tctx.lineWidth = strokeSize;
    tctx.stroke();
    tctx.closePath();
}

function drawTriangle(xcoord,ycoord) {
    clearCorner(xcoord,ycoord);

    var size1 = 3;
    var size2 = 13;
    if (ARR_SIZE == 21) {
        size1 = 2;
        size2 = 9;
    }

    tctx.beginPath();
    tctx.moveTo(xcoord*BOX_SIZE-size2, (ycoord-1)*BOX_SIZE + size1);
    tctx.lineTo(xcoord*BOX_SIZE-size1, (ycoord-1)*BOX_SIZE + size2);
    tctx.lineTo(xcoord*BOX_SIZE-size1, (ycoord-1)*BOX_SIZE + size1);
    tctx.lineTo(xcoord*BOX_SIZE-size2, (ycoord-1)*BOX_SIZE + size1);

    tctx.fillStyle = "#FF0000";
    tctx.fill();

    tctx.closePath();

    var size1 = 4;
    var size2 = 11;
    if (ARR_SIZE == 21) {
        size1 = 3;
        size2 = 7;
    }

    tctx.beginPath();
    tctx.moveTo(xcoord*BOX_SIZE-size2, (ycoord-1)*BOX_SIZE + size1);
    tctx.lineTo(xcoord*BOX_SIZE-size1, (ycoord-1)*BOX_SIZE + size2);
    tctx.lineTo(xcoord*BOX_SIZE-size1, (ycoord-1)*BOX_SIZE + size1);
    tctx.lineTo(xcoord*BOX_SIZE-size2, (ycoord-1)*BOX_SIZE + size1);

    tctx.fillStyle = "#000000";
    tctx.fill();

    tctx.closePath();
}

function clearDrawing() {
    for (var x = 1; x <= ARR_SIZE; x++) {
        for (var y = 1; y <= ARR_SIZE; y++) {
            if (!contains(blanks,[x,y])) {
                clearCorner(x,y);
            }
        }
    }
}

//
//  type = 0 (check) | 1 (reveal)
//
function helpBox(type,x,y) {
    if (type == 0) { // if check box 
        if (inputVals[x-1][y-1] == "") {
            return;
        }
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

//
//  type = 0 (check) | 1 (reveal)
//  quant = 0 (square) | 1 (word) | 2 (puzzle)
//
function help(type,quant) {
    if (gameover || noClick) {
        return;
    }
    switch(quant) {
        case 0:
            helpBox(type,curx,cury);
            break;
        case 1:
            if (dir) {
                var i1 = curx, i2 = curx + 1;
                while (!contains(blanks,[i1,cury]) && i1 > 0) {
                    helpBox(type,i1,cury);
                    i1--;
                }
                while (!contains(blanks,[i2,cury]) && i2 <= ARR_SIZE) {
                    helpBox(type,i2,cury);
                    i2++;
                }

            } else {
                var j1 = cury, j2 = cury + 1;
                while (!contains(blanks,[curx,j1]) && j1 > 0) {
                    helpBox(type,curx,j1);
                    j1--;
                }
                while (!contains(blanks,[curx,j2]) && j2 <= ARR_SIZE) {
                    helpBox(type,curx,j2);
                    j2++;
                }
            }
            break;
        case 2:
            for (var i = 0; i < ARR_SIZE; i++) {
                for (var j = 0; j < ARR_SIZE; j++) {
                    if (inputBoxes[i][j] == 0) {
                        continue;
                    } else {
                        helpBox(type,i+1,j+1);
                    }
                }
            }
            break;
        default:
            console.log("Error: Invalid input as variable 'quant'");
    }
    
    if (playerWins()) {
        delay(function() {
            openPopup(0);
        }, 10);
    }
    localStorage.setItem('fixedBoxes' + PUZZLE_NUM,JSON.stringify(fixedBoxes));
    localStorage.setItem('inputVals' + PUZZLE_NUM,JSON.stringify(inputVals));
    var perc = getCompletionPercent();
    localStorage.setItem('percent' + PUZZLE_NUM,perc);
}

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
  gameover = true;
  localStorage.setItem('gameover' + PUZZLE_NUM,JSON.stringify(gameover));
  return true;
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

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds%60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
    localStorage.setItem('time' + PUZZLE_NUM,JSON.stringify(totalSeconds));
}

function incrementIdle() {
    ++idleSeconds;
    //console.log("Idle timer now at " + idleSeconds);
    if (idleSeconds >= 60) {
        idleSeconds = 0;
        openPopup(4);
    }
}

function crossClear() {
    openResetPopup();
}

function crossBack() {
    // SAVE STATE OF PUZZLE AND GO BACK
    document.location.href = "crossword.html";
}

