(function () {
  var boton = document.getElementById("abrir-menu");
  var panel = document.getElementById("menu-curso");
  var cerrar = document.getElementById("cerrar-menu");
  if (!boton || !panel || !cerrar) return;

  function abrir() {
    panel.setAttribute("data-abierto", "true");
    panel.removeAttribute("inert");
    boton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-abierto");
    var primero = panel.querySelector("nav a");
    if (primero) primero.focus();
  }

  function ocultar(devolverFoco) {
    panel.setAttribute("data-abierto", "false");
    panel.setAttribute("inert", "");
    boton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-abierto");
    if (devolverFoco) boton.focus();
  }

  boton.addEventListener("click", abrir);
  cerrar.addEventListener("click", function () { ocultar(true); });
  panel.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function () { ocultar(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.getAttribute("data-abierto") === "true") ocultar(true);
  });
})();
