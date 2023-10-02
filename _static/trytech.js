// Add functions from selecto and moveable to the objects to make them draggable, moveable etc.
const container = document.querySelector(".container_inner");
const frameMap = new Map();
let targets = [];

const selecto = new Selecto({
  container,
  dragContainer: ".selecto-area",
  selectableTargets: [".red_cube", ".blue_cube", ".triangle"],
  hitRate: 0,
  selectByClick: true,
  selectFromInside: false,
  toggleContinueSelect: ["shift"],
  ratio: 100,
});

const moveable = new Moveable(container, {
    draggable: true,
    resizable: true,
    rotatable: true,
    snappable: true,
    bounds: { left: 0, top: 0, right: 471, bottom: 508 },
}).on("clickGroup", (e) => {
    selecto.clickTarget(e.inputEvent, e.inputTarget);
}).on("dragStart", (e) => {
    const target = e.target;
    let frame = frameMap.get(target);

    if (!frame) {
        frame = {
            translate: [0, 0],
            rotate: 0,
        };
        frameMap.set(target, frame);
    }

    if (target.id) {
        const targetElement = document.getElementById(target.id);
        if (targetElement) {
            const computedStyle = getComputedStyle(targetElement);
            const transformMatrix = computedStyle.transform;
            if (transformMatrix && transformMatrix !== "none") {
                const matrix = new DOMMatrix(transformMatrix);
                frame.translate[0] = matrix.m41;
                frame.translate[1] = matrix.m42;

                // Extract rotation from the matrix and convert it to degrees
                const currentRotation = (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI;
                // Only update the rotation if it has changed
                if (frame.rotate !== currentRotation) {
                    frame.rotate = currentRotation;
                }
            }
        }
    }
    e.set(frame.translate);

}).on("drag", (e) => {
    const target = e.target;
    const frame = frameMap.get(target);

    if (target.id) {
        const targetElement = document.getElementById(target.id);
        if (targetElement) {
            const computedStyle = getComputedStyle(targetElement);
            const transformMatrix = computedStyle.transform;
            if (transformMatrix && transformMatrix !== "none") {
                const matrix = new DOMMatrix(transformMatrix);
                frame.translate[0] = matrix.m41;
                frame.translate[1] = matrix.m42;
            }
        }
    }
    frame.translate = e.beforeTranslate;
}).on("resize", ({ target, width, height, drag }) => {
    let frame = frameMap.get(target);

    if (!frame) {
        frame = {
            translate: [0, 0],
            rotate: 0,
        };
        frameMap.set(target, frame);
    }

    if (target.id) {
        const targetElement = document.getElementById(target.id);
        if (targetElement) {
            const computedStyle = getComputedStyle(targetElement);
            const transformMatrix = computedStyle.transform;
            if (transformMatrix && transformMatrix !== "none") {
                const matrix = new DOMMatrix(transformMatrix);
                frame.translate[0] = matrix.m41;
                frame.translate[1] = matrix.m42;

                // Extract rotation from the matrix and convert it to degrees
                const currentRotation = (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI;
                // Only update the rotation if it has changed
                if (frame.rotate !== currentRotation) {
                    frame.rotate = currentRotation;
                }
            }
        }
    }
    const beforeTranslate = drag.beforeTranslate;
    frame.translate = beforeTranslate;
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
}).on("rotateStart", (e) => {
    const target = e.target;
    let frame = frameMap.get(target);

    if (!frame) {
        frame = {
            translate: [0, 0],
            rotate: 0,
        };
        frameMap.set(target, frame);
    }

    if (target.id) {
        const targetElement = document.getElementById(target.id);
        if (targetElement) {
            const computedStyle = getComputedStyle(targetElement);
            const transformMatrix = computedStyle.transform;
            if (transformMatrix && transformMatrix !== "none") {
                const matrix = new DOMMatrix(transformMatrix);
                frame.translate[0] = matrix.m41;
                frame.translate[1] = matrix.m42;

                // Extract rotation from the matrix and convert it to degrees
                const currentRotation = (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI;
                    console.log(currentRotation, "this is the rotation")
                // Only update the rotation if it has changed
                if (frame.rotate !== currentRotation) {
                    frame.rotate = currentRotation;
                }
            }
        }
    }
    e.set(frame.rotate);
}).on("rotate", (e) => {
    const target = e.target;
    const frame = frameMap.get(target);
    frame.rotate = e.beforeRotate;
}).on("render", ({ target }) => {
    const frame = frameMap.get(target);
    const { translate, rotate } = frame;
    target.style.transform = `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg)`;
});


selecto.on("dragStart", e => {
    const target = e.inputEvent.target;
    if (
        moveable.isMoveableElement(target)
        || targets.some(t => t === target || t.contains(target))
    ) {
        e.stop();
    }
}).on("select", e => {
    targets = e.selected;
    moveable.target = targets;
}).on("selectEnd", e => {
    if (e.isDragStart) {
        e.inputEvent.preventDefault();

    }
});

var inner_container = document.getElementById("container_inner");
var box = document.querySelector(".moveable-control-box");
var clicked = 0;
var clicks = 0;
var elementids= ['triangle', 'red_cube', 'blue_cube']
// Add additional features
var clickedEl;
var rechtsklick = 0;

// This function makes sure that the control box is added when clicking on element
function add_controlbox() {
    const controlbox = document.querySelector(".rCS1w3zcxh");
    if (controlbox) {
        if (controlbox.classList.contains("hidden-control-box")) {
            // If the control box is hidden, remove the hidden-control-box class to show it
            controlbox.classList.remove("hidden-control-box");
            console.log(controlbox, "it contains it")
        } else {
            console.log(controlbox, "it doesnt contains it")
        }
    }
};

// This function initiates the preview view
    function Prev() {
    const whitebox = document.getElementById("id_preview");
    whitebox.style.display ="block";
    remove_controlbox();

};
// If we click somewhere else, the preview view changes back to normal
document.getElementById("id_preview").addEventListener('click', remove_whitebox);

// Function that removes control box
function remove_controlbox() {
  const controlbox = document.querySelector(".rCS1w3zcxh");
  if (controlbox) {
    if (!controlbox.classList.contains("hidden-control-box")) {
      // If the control box is shown, add the hidden-control-box class to hide it
      controlbox.classList.add("hidden-control-box");
            console.log(controlbox, "it doesnt contains it")
    }
  }
};

// This function removes the div that is shown during preview to cover the material box
function remove_whitebox() {
  const whitebox = document.getElementById("id_preview");
  if (whitebox.style.display == "block") {
    whitebox.style.display = "none";
  }
}

// This function checks if there is an error, and if not, submits the illustration
function Submit() {
    checkImage();
    if (document.getElementById('check_error').innerHTML === "") {
        // saveImageData(elementids);
        storeChanges();
        SaveImage();
    };
};


// Here we select all material items and
// (1) add the function that the control box is added to them, when clicked or removed if another item is selected
// (2) add right click menu that we programm in addition to change the layer of the material

const items = document.querySelectorAll("div.red_cube, div.blue_cube, div.triangle");
for (let i = 0; i < items.length; i++) {
  // control box should be added whenever an element is clicked
    items[i].addEventListener("click", add_controlbox);
    // rightclick menu should be removed when an element is clicked
  items[i].addEventListener("click", remove_menu);
  // if the white box that we use for the preview mode is shown, it should be removed upon clicking an element
    items[i].addEventListener("click", remove_whitebox);

    // when not have been clicked: document that something has been clicked once
    items[i].addEventListener("click", function (e) {
        if (clicked == 0) clicked = 1;
      clicks++; // count clicks
    });

  // add the right click menu
  items[i].addEventListener("contextmenu", function (e) {
    if (items[i].classList.contains("rightclick")) items[i].classList.remove("rightclick");
    remove_controlbox();
    clickedEl = e.target;
    e.preventDefault();
    e.target.classList.add("rightclick");

    var rect = e.target.getBoundingClientRect();
    var doc = document.getElementById("container_inner").getBoundingClientRect();
    menu.style.top = `${rect.top - doc.top + 15}px`;
    menu.style.left = `${rect.right - doc.left + 15}px`;
    menu.classList.add("show");
    const outClick = document.getElementById("out-click");
    outClick.style.display = "block";
    rechtsklick++;
  });
};

// This function makes the menu disapear if we click somewhere else
document.getElementById("out-click").addEventListener("click", function () {
  const outClick = document.getElementById("out-click");
  const menu = document.getElementById("menu");
  menu.classList.remove("show");
  outClick.style.display = "none";
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("rightclick");
  //remove error if clicked somehwere else
    remove_error();
});

// Add rightclick menu
document.getElementById("id_infront").addEventListener("click", infront);
document.getElementById("id_inback").addEventListener("click", inback);
document.getElementById("id_background").addEventListener("click", background);
document.getElementById("id_foreground").addEventListener("click", foreground);
document.getElementById("container_inner").addEventListener("click", remove_whitebox);

// Function check if there is an error
function remove_error() {
    if (document.getElementById('check_error').innerHTML !=="") {
        document.getElementById('check_error').innerHTML ==""
  }

};

// Programm rightclick menu
var min_z = 0;
var max_z = 0;

function foreground() {
  const element = clickedEl;
  let z = element.style.zIndex;
  z++;
  element.style.zIndex = z;
  if (z > max_z) max_z = z;
}

function infront() {
  const element = clickedEl;
  max_z++;
  element.style.zIndex = max_z;
}

function inback() {
  const element = clickedEl;
  min_z--;
  element.style.zIndex = min_z;
}

function background() {
  const element = clickedEl;
  let z = element.style.zIndex;
  z--;
  element.style.zIndex = z;
  if (z < min_z) min_z = z;
}

// Function removes right click menu
function remove_menu() {
  const menu = document.getElementById("menu");
  menu.classList.remove("show");
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("margin");
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("rightclick");
}
document.getElementById("container_outer").addEventListener("click", remove_menu);


// Function checks the image and displays error in case it does not show the example
function checkImage() {
    remove_whitebox();
    //Here, we want to check whether the image is rebuilt properly. We check four important issues:
    // Has any object been moved?
    if (clicked===0) {
        document.getElementById('check_error').innerHTML =="You have nothing to submit. Please work on the task"
    }
    // Have all objects been moved?
    if (window.getComputedStyle(document.getElementById('triangle')).getPropertyValue('transform') === "none" ||
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).getPropertyValue('height').split('p')[0]) >= parseFloat(window.getComputedStyle(document.getElementById('red_cube')).getPropertyValue('height').split('p')[0]) ||
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).getPropertyValue('height').split('p')[0]) <= parseFloat(window.getComputedStyle(document.getElementById('triangle')).getPropertyValue('height').split('p')[0]) ||
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).getPropertyValue('width').split('p')[0]) >= parseFloat(window.getComputedStyle(document.getElementById('red_cube')).getPropertyValue('width').split('p')[0]) ||
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).getPropertyValue('width').split('p')[0]) <= parseFloat(window.getComputedStyle(document.getElementById('triangle')).getPropertyValue('width').split('p')[0]) ||

            // Is the brown cube in the background, and the triangle in the foreground?
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).zIndex) <= parseFloat(window.getComputedStyle(document.getElementById('red_cube')).zIndex) ||
            parseFloat(window.getComputedStyle(document.getElementById('blue_cube')).zIndex) >= parseFloat(window.getComputedStyle(document.getElementById('triangle')).zIndex)
        ) {
            document.getElementById('check_error').innerHTML = "Please try to rebuild the illustration from above as good as possible."
        } else {
            // If all these criteria are met, the picture will be submitted:
            document.getElementById('check_error').innerHTML = ""
        }
};

// Function saves image
function SaveImage() {
  const node = document.getElementById("container_inner");
  if (box.parentNode== node) node.removeChild(box);
  domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      var data = img.src;
      var field = document.getElementById("id_imageurl_trytech");
      field.value = data;
      var next_button = document.getElementById("next_page");
      console.log("we click next button")
      next_button.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
};
