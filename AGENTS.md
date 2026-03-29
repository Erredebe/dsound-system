# AGENTS

## Contexto del proyecto

`DSOUND SYSTEM` es un grupo ficticio creado para esta web. No representa una banda real ni un proyecto musical convencional: su identidad gira alrededor de canciones generadas con IA.

## Concepto creativo

- El proyecto convierte situaciones internas de un equipo de empresa en canciones.
- El foco tematico esta en un equipo de `Design System`.
- Las letras, referencias y mensajes pueden girar alrededor de disenos, tickets, bugs, releases, producto, stakeholders, desarrollo, coordinacion y caos corporativo.
- El tono general debe entenderse como parodia o ficcion comica del dia a dia de un equipo digital.

## Tono y estilo

- Siempre en modo comedia.
- El humor puede ser ironico, absurdo, satirico o costumbrista.
- La web debe presentar el proyecto como si fuera una banda con identidad propia, pero dejando claro en el contexto interno del proyecto que es una propuesta ficticia.
- El universo visual y verbal puede mezclar `dub`, `reggae`, `sound system`, cultura de bajos y estetica callejera con problemas tipicos de oficina o producto digital.

## Guia para contenido futuro

- Los textos deben sonar a grupo musical real, no a demo tecnica.
- Las canciones pueden usar lenguaje de empresa, pero transformado en algo divertido, exagerado y musical.
- Evitar tono corporativo serio o explicaciones excesivamente tecnicas en el contenido visible de la web.
- Cuando se escriban letras, descripciones o titulares, priorizar personalidad, ritmo y humor.

## Flujo cuando el usuario pasa una cancion de Suno

- Si el usuario comparte un link de Suno y dice algo como `haz como con el resto`, hay que anadir la cancion en `data.json` dentro de `music.songs`.
- Hay que sacar el `title` y el `embedUrl` reales de Suno. El `embedUrl` debe guardarse con formato `https://suno.com/embed/<id>`.
- La cancion debe colocarse al final usando un `order` mayor que el de las demas canciones, salvo que el usuario pida otra posicion.
- Si la letra viene en el mensaje del usuario, hay que guardarla en `lyrics` con saltos de linea escapados y formato consistente con el resto del JSON.
- Si la letra no esta disponible, se deja `lyrics` vacio en lugar de inventarla.
- No hay que reescribir ni "mejorar" la letra automaticamente. Solo normalizar lo necesario para que el JSON sea valido y consistente.
- Despues del cambio, conviene confirmar en la respuesta que se ha anadido la cancion, indicar el archivo tocado y mencionar si la letra se ha incluido o se ha dejado vacia.

## Despliegue y pruebas

- Cada push a la rama `main` despliega automaticamente la web en `https://dsound-system.netlify.app/`.
- Una vez desplegado, las comprobaciones funcionales y visuales se pueden hacer directamente sobre esa URL usando el MCP de Playwright.
