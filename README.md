# LUZEN - Catálogo Oficial de Camisetas

Página dedicada exclusivamente a catálogo para **LUZEN**, desarrollada siguiendo el diseño minimalista de la maqueta.

---

## 🎨 Características Implementadas

1. **Header & Identidad**:
   - Logotipo oficial **LUZEN** con isotipo y subrayado característico (`assets/images/luzen_logo_transparent.png`).
   - Acceso rápido a búsqueda y carrito de compras con contador en vivo (`0`).
   - Diseño limpio y minimalista sobre fondo blanco.

2. **Barra de Filtros y Búsqueda**:
   - Botones estilo píldora interactivos con estado activo/inactivo:
     - `Todos` (activo por defecto)
     - `Selecciones`
     - `Clubes Europeos`
     - `Clubes Argentinos`
     - `Retro`
     - `Nuevos`
   - Campo de búsqueda `Buscar remera...` con icono de lupa a la izquierda y filtrado en tiempo real.

3. **Estructura del Catálogo (Sin camisetas aún, listo para el siguiente paso)**:
   - Contenedor en cuadrícula de 4 columnas (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
   - Mensaje de catálogo preparado para recibir las camisetas.
   - Botón interactivo de *Vista previa de maqueta de tarjetas* para previsualizar el diseño de las tarjetas (fondos `#F5F5F7`, botón de favorito ❤️, precio `$ 49.999` y botón de carrito negro).
   - Estructura de datos en `assets/js/app.js` (`const PRODUCTS = []`) lista para cargar la lista de camisetas cuando lo indiques.

4. **Carrito Desplegable (Slide-Over Cart)**:
   - Panel deslizable desde la derecha.
   - Contador de artículos, control de cantidades (+ / -), subtotal y total.
   - Botón de checkout directo a WhatsApp con mensaje automático.

---

## 💻 Cómo ver el catálogo

Podés abrir directamente [`index.html`](file:///C:/Users/luchito/.gemini/antigravity/scratch/goalwear-landing/index.html) en tu navegador o iniciar el servidor local:

```powershell
python server.py
```
*(Se abrirá automáticamente en `http://localhost:3000`)*.
