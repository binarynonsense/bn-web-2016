// the gamer's path
let g_kCodePosition = 0;
let g_kCodeUrl = "./"
const KCODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
  g_kCodePosition = (e.keyCode == KCODE[g_kCodePosition]) ? g_kCodePosition + 1 : 0;
  if (g_kCodePosition == KCODE.length) onKCodeEntered();
});

// the hacker's path
// Hashimoto
// var str = "";
// str = window.btoa(str);
// str = window.atob(str);
// alert(str);

function initKCode(url){
    g_kCodeUrl = url;
}
  
function onKCodeEntered() {
    g_kCodePosition = 0;
    window.location.href = window.atob(g_kCodeUrl);
}