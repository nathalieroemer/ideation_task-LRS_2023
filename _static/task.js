// Add functions from selecto and moveable to the objects to make them draggable, moveable etc.
const container = document.querySelector(".container_inner");
const frameMap = new Map();
let targets = [];

const selecto = new Selecto({
  container,
  dragContainer: ".selecto-area",
    selectableTargets: [".bluecircle", ".greencircle", ".yellowcircle", ".redcircle", ".brownstick", ".blackstick", ".quartercircle", ".blackcircle", ".bow"],
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

// We define the elements ids that we use in the material box
var elementids = [
    'yelc1', 'yelc2', 'yelc3', 'redc1', 'redc2', 'redc3', 'grec1', 'grec2', 'grec3',
    'bluc1', 'bluc2', 'bluc3', 'bros1', 'bros2', 'bros3', 'bros4', 'blas1', 'blas2',
    'blas3', 'blas4', 'bbow1', 'bbow2', 'bbow3', 'bbow4', 'bbow5', 'bbow6', 'blac1', 'blac2'
]

var clickedEl;
var rechtsklick = 0;

// Function adds control box on click on element
function add_controlbox() {
    const controlbox = document.querySelector(".rCS1w3zcxh");
    if (controlbox) {
        if (controlbox.classList.contains("hidden-control-box")) {
            // If the control box is hidden, remove the hidden-control-box class to show it
            controlbox.classList.remove("hidden-control-box");
            console.log(controlbox, "it contains it")
        } else {
        }
    }
};

// Function makes material box disappear
    function Prev() {
    const whitebox = document.getElementById("id_preview");
    whitebox.style.display ="block";
//    if (box.parentNode == inner_container) inner_container.removeChild(box);
    remove_controlbox();

};
// Add event listener to preview button
document.getElementById("id_preview").addEventListener('click', remove_whitebox);

// Function removes control box (e.g. before saving illustration or on right click needed)
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

// Function removes white box that we use to cover material for preview
function remove_whitebox() {
  const whitebox = document.getElementById("id_preview");
  if (whitebox.style.display == "block") {
    whitebox.style.display = "none";
  }
}

// Function submits illustration and word if there is no error
function Submit() {
    validateword();
        console.log("validated?", validated)
    if (document.getElementById('check_error').innerHTML === "" && validated ===1) {
        storeChanges();
        submit = 1
        SaveImage();
        localStorage.clear();
        };
   // };
};


// Here we select all material items and
// (1) add the function that the control box is added to them, when clicked or removed if another item is selected
// (2) add right click menu that we programm in addition to change the layer of the material
const items = document.querySelectorAll("div.bluecircle, div.greencircle, div.yellowcircle, div.redcircle, div.brownstick, div.blackstick, div.quartercircle, div.blackcircle, div.bow");
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
      clicks++; // if we want to count clicks, save it as forminput on the front page
        // If you want to forbid empty pictures, set this condition and adjust submit function equivalently:
       // if (document.getElementById('check_error').innerHTML == "You have nothing to submit.") {
         //   document.getElementById('check_error').innerHTML = ""
        // }
    });

  // Add the right click menu
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

// Function makes menu dissapear if we click somewhere else than on an element and also removes errors
document.getElementById("out-click").addEventListener("click", function () {
  const outClick = document.getElementById("out-click");
  const menu = document.getElementById("menu");
  menu.classList.remove("show");
  outClick.style.display = "none";
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("rightclick");
  // remove error if clicked somehwere else
    remove_error();
});

// Add rightclick menu
document.getElementById("id_infront").addEventListener("click", infront);
document.getElementById("id_inback").addEventListener("click", inback);
document.getElementById("id_background").addEventListener("click", background);
document.getElementById("id_foreground").addEventListener("click", foreground);
document.getElementById("container_inner").addEventListener("click", remove_whitebox);

// Function removes errors
function remove_error() {
    if (document.getElementById('check_error').innerHTML !=="") {
        document.getElementById('check_error').innerHTML ==""
  }

};

//  Programm rightclick menu
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

// Function removes rightclick menu
function remove_menu() {
  const menu = document.getElementById("menu");
  menu.classList.remove("show");
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("margin");
  if (typeof clickedEl !== "undefined") clickedEl.classList.remove("rightclick");
}
document.getElementById("container_outer").addEventListener("click", remove_menu);

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
      var field = document.getElementById("id_imageurl");
      field.value = data;
      var next_button = document.getElementById("next_page");
      if (submit === 1 ) {
                console.log("we click next button")
      next_button.click();
      }
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
};


