// the gamer's path
let g_kCodePosition = 0;
let g_kCodeUrl = "./";
const KCODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener("keydown", (e) => {
  enterCodeKey(e.keyCode);
});

// the hacker's path
// Hashimoto
// var str = "";
// str = window.btoa(str);
// str = window.atob(str);
// alert(str);

function initKCode(url, usePad) {
  g_kCodeUrl = url;
  if (usePad) {
    initPad();
  }
}

function enterCodeKey(keyCode) {
  g_kCodePosition = keyCode == KCODE[g_kCodePosition] ? g_kCodePosition + 1 : 0;
  if (g_padEnabled == true) {
    highlightPadInput(keyCode);
  }
  if (g_kCodePosition == KCODE.length) onKCodeEntered();
}

function onKCodeEntered() {
  g_kCodePosition = 0;
  window.location.href = window.atob(g_kCodeUrl);
}

// PAD //////////////////

let g_padEnabled = false;

function initPad() {
  g_padEnabled = true;

  document.getElementById("svgPad").style.display = "block";

  document.getElementById("padArrowUp").addEventListener("click", function () {
    enterCodeKey("38");
  });
  document
    .getElementById("padArrowDown")
    .addEventListener("click", function () {
      enterCodeKey("40");
    });
  document
    .getElementById("padArrowLeft")
    .addEventListener("click", function () {
      enterCodeKey("37");
    });
  document
    .getElementById("padArrowRight")
    .addEventListener("click", function () {
      enterCodeKey("39");
    });
  document.getElementById("padButtonA").addEventListener("click", function () {
    enterCodeKey("65");
  });
  document.getElementById("padButtonB").addEventListener("click", function () {
    enterCodeKey("66");
  });
}

function highlightPadInput(keyCode) {
  if (keyCode == "38") {
    flashPadElement("padArrowUp");
  } else if (keyCode == "40") {
    flashPadElement("padArrowDown");
  } else if (keyCode == "37") {
    flashPadElement("padArrowLeft");
  } else if (keyCode == "39") {
    flashPadElement("padArrowRight");
  } else if (keyCode == "65") {
    flashPadElement("padButtonA");
  } else if (keyCode == "66") {
    flashPadElement("padButtonB");
  }
}

function flashPadElement(name) {
  let element = document.getElementById(name);
  if (!element.classList.contains("svgFillHighlight")) {
    element.classList.add("svgFillHighlight");
    setTimeout(function () {
      element.classList.remove("svgFillHighlight");
    }, 100);
  }
}
