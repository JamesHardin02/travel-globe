const submitButtn = document.getElementById("mc-embedded-subscribe");
const backToSite = document.getElementById("back-to-site");
const alertField = document.getElementById("alert-feild");

submitButtn.onclick(function () {
  alertField.style.display = block;
});

function myFunction() {
  document.getElementById("alert-feild").style.display = block;
}

function myFunction(element, color) {
  element.style.color = color;
}
