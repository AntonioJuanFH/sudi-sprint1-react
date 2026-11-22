// Arma el sitio del menú del curso en menu-dist/: copia menu/ y compila el sistema en menu-dist/sistema/.
// El archivo descargas/sudi-codigo-fuente.zip se genera aparte con:
//   git archive --format=zip -o menu-dist/descargas/sudi-codigo-fuente.zip HEAD -- . ":!menu/actividades"
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

rmSync("menu-dist", { recursive: true, force: true });
cpSync("menu", "menu-dist", { recursive: true });
execSync("npx vite build --base=./ --outDir menu-dist/sistema", { stdio: "inherit" });
mkdirSync("menu-dist/descargas", { recursive: true });
console.log("Menú listo en menu-dist/");
