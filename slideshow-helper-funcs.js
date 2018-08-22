// Open the Modal
function openModal(object) {
	inSlideShow = true;
	document.getElementById('myModal').style.display = "block";
	var imgSrc = object.getElementsByTagName('img')[0].src;
	if (imgs.includes(imgSrc)) {
		var ind = imgs.indexOf(imgSrc);
		//console.log("Found img " + imgSrc + " as element " + ind + " in imgs array");
		slideIndex = ind;
		var caption = object.getElementsByTagName('p')[0].innerHTML;
		//console.log("Caption: " + caption);
		pageNumber = ind + 1;
		document.getElementById('numbertext').innerHTML = pageNumber + ' / ' + imgs.length;
		document.getElementById('modal-img').src = imgSrc;
		document.getElementById('caption').innerHTML = caption;
		document.getElementById("modal-slide").style.display = "block";
	} else {
		console.log("Error: IMG " + imgSrc + " NOT FOUND!")
	}
}

// Close the Modal
function closeModal() {
	inSlideShow = false;
	document.getElementById('myModal').style.display = "none";
}

var slideIndex = 0;
showSlides(slideIndex);
var inSlideShow = false;

// Next/previous controls
function slideRight() {
	slideIndex = slideIndex + 1;
	if (slideIndex >= imgs.length) {
		slideIndex = 0;
	}
	displaySlide(slideIndex);
}

function slideLeft() {
	slideIndex = slideIndex - 1;
	if (slideIndex < 0) {
		slideIndex = imgs.length - 1;
	}
	displaySlide(slideIndex);
}

function displaySlide(ind) {
	var divs = document.getElementsByClassName('hover-shadow');
	var caption = divs[ind].getElementsByTagName('p')[0].innerHTML;
	var imgSrc = divs[ind].getElementsByTagName('img')[0].src;
	document.getElementById('modal-img').src = imgSrc;
	document.getElementById('caption').innerHTML = caption;
	var pageNumber = ind + 1;
	document.getElementById('numbertext').innerHTML = pageNumber + ' / ' + imgs.length;
}

function checkKey(e) {
	if (!inSlideShow && document.getElementById('myModal').style.display == "none") {
		return;
	}

    e = e || window.event;
    //console.log("key press detected: " + e);

    if (e.keyCode == '38') {
        // up arrow
        return;
    }
    else if (e.keyCode == '40') {
        // down arrow
        return;
    }
    else if (e.keyCode == '37') {
       // left arrow
       slideLeft();
    }
    else if (e.keyCode == '39') {
       // right arrow
       slideRight();
    }

}

function initializeImgArray() {
	imgObjs = document.getElementById('gallery').getElementsByTagName('img');
	imgs = [];
	for (var i = 0; i < imgObjs.length; i++) {
		imgs.push(imgObjs[i].src);
		console.log(imgs[i]);
	}
}