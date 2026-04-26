## AGENTS

Proyecto:
Pokedex o buscador de pokemons

Rol del agente:
Desarrollador web experto con 12 años de experiencia.

Objetivo:
Crear una aplicación web tipo pokedex donde se puedan buscar y seleccionar pokemons.
Utilizando el api de pokeapi para conseguir la info de los pokemon.

Funcionalidades de la aplicación:
- Seleciconar obuscar un pokemon por su nombre o numero (id)
- Mostrar listado paginado de todos los pokemons
- Los listados paginados serán un infinite scroll
- Ver detalle del pokemon seleccionado
- Mostrar sprite o imagen oficial de cada pokemon
- Mostrar tipos con colores correspondientes
- Mostrar estadisticas base (hp, ataque, defensa, etc) con barras visuales
- Consumo de API externa (PokeAPI)
- Manejo de errores de red / pokemon no encontrado
- Indicadores de carga (spinner)
- Actualización automatica al cambiar de pagina o al buscar
- Filtrar por tipo o generación
- Mostar la cadena de evolución
- Marcar como favoritos para "guardarlos en nuestra pokeball"
- Los favoritos se guardarán en localstorage
- Funcionalidad de modo oscuro y modo claro

Información del API externa:
- PokeAPI principal: https://pokeapi.co/api/v2/pokemon/{name or id}
- Lista completa: https://pokeapi.co/api/v2/pokemon?offset=0&limit=20
- Imagenes oficiales: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
- Toda la información y url necesarios, imagenes, sprites, etc están dentro de estas urls, el api es estable, no tiene limite y no requiere api key.

Stack de tecnología:
- HTML 5
- CSS3 (nativo)
- JavaScript
- React
- Base de datos: Almacenamiento local (localstorage)

Preferencias generales:
- Todos los textos visibles de la web quiero que estén en español.

Preferencias de diseño:
- Basate en el documento HTML del diseño que tienes en la carpeta design del proyecto.

Preferencias de estilos:
- Colores (los del diseño)
- Uso de medidas con rem, usando un font-size bade de 10px.
- Uso de HTML5 y CSS3 nativo.
- Usa buenas prácticas de maquetación css y si es necesario usa flexbox y css grid layout.
- Metodología bem (hazla de forma estricta)
- Que la webapp sea responsive.

Preferencias de código para JS:
- No añadas dependencias externas.
- HTML debe ser semántico.
- Usa siempre let o const, y no uses nunca var.
- No uses alert, confirm, prompt, todo el feedback debe ser visual en el dom.
- Toda alerta o ventana modal que aparezca debe tener el mismo tipo de estilos que la web.
- No uses innerHTML, todo el contenido debe ser inserado con appendChild, o previamente creando un elemento con document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click.
- Prioriza que el código sea sencillo de entender.
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Despliegue (decisión del proyecto):
- **Hosting elegido:** GitHub Pages con despliegue automático vía **GitHub Actions** (publicar la carpeta `dist` del build de Vite).
- **No elegido (por ahora):** Netlify, Vercel o Cloudflare Pages, que simplifican las SPA con reglas de rewrite; se pueden considerar si en el futuro se prioriza evitar el patrón `404.html` + `basename` propio de Pages en subruta de proyecto.

Estructura de archivos:
- carpeta (design)
- AGENTS.md 
- Estructura de fichero más adecuada para proyectos de react (lo elige el agente de ia)