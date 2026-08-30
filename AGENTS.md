# 🤖 AGENTS.md — Guía y Estándares de Desarrollo para Agentes de AI

Bienvenido a **Reading List Web**. Este documento define las directrices arquitectónicas, estándares de código, herramientas de calidad y flujos de trabajo que todo agente de IA (y desarrollador humano) debe seguir al interactuar con este repositorio.

---

## 1. 🏗️ Tech Stack & Tecnologías Principales

- **Framework**: [React 19](https://react.dev/) (SPA con Vite 8).
- **Bundler**: [Vite 8](https://vite.dev/) impulsado nativamente por [Rolldown](https://rolldown.rs/) & [Oxc](https://oxc.rs/) en Rust.
- **Lenguaje**: [TypeScript 7+](https://www.typescriptlang.org/) (Modo estricto).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`).
- **Estado Global**: [Zustand 5](https://zustand-demo.pmnd.rs/) (`useLibraryStore`, `useUIStore`).
- **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query/latest) (`@tanstack/react-query`).
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (`@biomejs/biome` v2.5+). *Nota: No usamos ESLint ni Prettier.*
- **Git Hooks & CI**: [Husky](https://typicode.github.io/husky/) + `lint-staged` + GitHub Actions CI (PRs hacia `main`).

---

## 2. 📐 Metodología SDD (Software Design Document / Spec-Driven Development)

En este repositorio aplicamos **SDD** para diseñar y construir cambios y funcionalidades de manera estructurada:

1. **Especificación Previa**:
   - Todo cambio arquitectónico o actualización estructural debe documentarse previamente en un archivo SDD dentro de `docs/` (e.g. `docs/SDD-upgrade-dependencies.md`).
2. **Contratos de Tipos Primero (Schema-First)**:
   - Definir interfaces, tipos y modelos de datos en `src/types/` antes de implementar la UI o los stores.
3. **Desacoplamiento de Lógica y Presentación**:
   - Extraer la lógica de consulta y filtrado en custom hooks (`src/hooks/`).
   - Mantener componentes visuales puros y reutilizables en `src/components/`.
4. **Estado Reactivo Centralizado**:
   - Administrar estados compartidos y persistencia en `localStorage` a través de los stores de Zustand en `src/store/`.

---

## 3. 📂 Estructura del Proyecto

```text
reading-list-web/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline CI (Biome CI + Tests + Build en PRs hacia main)
├── .husky/
│   └── pre-commit                 # Git Hook: ejecuta lint-staged antes de cada commit
├── .lintstagedrc.json             # Reglas de lint-staged para ejecutar Biome en archivos modificados
├── docs/                          # Documentación técnica y especificaciones SDD
│   └── SDD-upgrade-dependencies.md
├── public/                        # Assets estáticos y JSON de datos
├── src/
│   ├── assets/                    # Iconos y recursos SVG
│   ├── components/                # Componentes de presentación (BookCard, Filterbox, ReadingList, sidebar)
│   ├── hooks/                     # Custom hooks (useBooksQuery, useFilterbox, useBreakpoints)
│   ├── services/                  # Servicios de datos
│   ├── store/                     # Stores de Zustand (library, ui)
│   ├── types/                     # Definiciones de TypeScript (library, ui)
│   ├── utils/                     # Utilidades y funciones puras
│   ├── App.tsx                    # Componente raíz de la aplicación
│   ├── index.css                  # Estilos globales (Tailwind v4)
│   └── main.tsx                   # Punto de entrada de la aplicación
├── biome.json                     # Configuración de Linter y Formatter de Biome
├── package.json                   # Dependencias fijas y scripts de calidad
├── tsconfig.json                  # Configuración de TypeScript
└── vite.config.ts                 # Configuración de Vite 8 + Tailwind v4
```

---

## 4. 🧭 Reglas y Buenas Prácticas para Agentes

### 4.1 Código y Arquitectura
- **React 19 & TypeScript**: Utilizar tipado moderno sin `React.FC` redundante. Manejar `ref` directamente como prop si aplica.
- **Zustand 5**: Acceder a los estados mediante selectores atómicos (`state => state.property`) para evitar re-renders innecesarios.
- **Persistencia**: Mantener sincronizado el estado de la lista de lectura con `localStorage` sin romper el flujo reactivo.
- **Accesibilidad**: Incluir atributos accesibles en elementos interactivos (`aria-label`, botones semánticos con `type="button"`).

### 4.2 Linter y Formato (Biome)
- No uses comentarios `eslint-disable`.
- Si Biome emite un warning, resuélvelo de acuerdo a las recomendaciones del linter.
- Ejecuta periódicamente `npm run check:fix` para mantener el repositorio limpio y consistente.

### 4.3 Validación Continua
- Antes de dar por finalizada una tarea, valida que el código pase el linter (`npm run check`) y la compilación de producción (`npm run build`).

---

## 5. 🛠️ Scripts y Comandos de Calidad

| Comando | Propósito |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite 8. |
| `npm run check` | Ejecuta análisis estático y verificación de formato con Biome. |
| `npm run check:fix` | Aplica correcciones automáticas y formateo de Biome en todo el proyecto. |
| `npm run lint` | Ejecuta únicamente el linter de Biome. |
| `npm run lint:fix` | Aplica autofix de reglas de linter con Biome. |
| `npm run format` | Formatea todos los archivos soportados con Biome. |
| `npm run ci` | Ejecuta la verificación estricta de Biome en entornos de CI. |
| `npm run build` | Valida tipos de TypeScript (`tsc`) y genera el bundle de producción con Vite 8 / Rolldown. |

---

## 6. 🔄 Flujo de Trabajo con Git y Commits

- **Ramas Semánticas**:
  - `feat/<nombre-feature>` (nuevas capacidades)
  - `fix/<descripcion-bug>` (corrección de errores)
  - `refactor/<modulo>` (reestructuración sin cambios funcionales)
- **Conventional Commits**:
  - `feat(scope): descripción`
  - `fix(scope): descripción`
  - `docs(scope): descripción`
  - `chore(scope): descripción`
- **Pre-commit Hooks**: Husky y lint-staged se encargarán automáticamente de ejecutar Biome antes de cada commit.

---

## 7. 📋 Checklist de Verificación para Agentes de AI

Antes de dar una tarea por completada:

- [ ] ¿Los contratos de tipo en `src/types/` están actualizados y tipados estrictamente?
- [ ] ¿El código pasa la verificación de Biome (`npm run check` o `npm run check:fix`) con 0 errores?
- [ ] ¿El build de producción compila limpiamente (`npm run build`)?
- [ ] ¿Se siguieron las convenciones de Conventional Commits y ramas semánticas?
