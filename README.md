# Tasty Realities — 3D / AR Restaurant Menu Experience

A web application concept for restaurants that lets guests browse digital menus and inspect dishes in 3D or augmented reality from a browser. The product flow is designed around a QR entry point, menu browsing, a 3D viewer, and restaurant-side menu/model management.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vite.dev/)
[![3D](https://img.shields.io/badge/3D-model--viewer-4B9CD3)](https://modelviewer.dev/)
[![Stars](https://img.shields.io/github/stars/MokuLakshithReddy/tasty-realities?style=flat-square)](https://github.com/MokuLakshithReddy/tasty-realities/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/MokuLakshithReddy/tasty-realities?style=flat-square)](https://github.com/MokuLakshithReddy/tasty-realities/commits/main)

## Product flow

~~~mermaid
flowchart LR
    A["Guest scans restaurant QR"] --> B["Open digital menu"]
    B --> C["Choose a dish"]
    C --> D["Inspect 3D model"]
    D --> E["View model in AR on supported device"]
    E --> F["Make an informed order"]
    G["Restaurant dashboard"] --> H["Manage menu items and 3D models"]
~~~

## Implemented application surfaces

| Route / area | Purpose |
|---|---|
| / | Landing page and product explanation |
| /auth | Authentication screen |
| /dashboard | Restaurant-side dashboard |
| /menu/:slug | Public menu route |
| /viewer | Product / model viewer |

The dashboard includes a model upload path for GLB/GLTF assets through Supabase Storage, with the saved model URL attached to the corresponding menu item. The frontend uses Google model-viewer / Three.js ecosystem packages for 3D viewing.

## Tech stack

- React 18, TypeScript, Vite
- React Router and TanStack Query
- Tailwind CSS, shadcn/ui, Radix UI
- Google model-viewer and Three.js / React Three Fiber ecosystem
- Supabase client and storage integration
- QR code generation utilities

## Run locally

~~~bash
npm install
npm run dev
~~~

Create a production build with:

~~~bash
npm run build
~~~

Configure the Supabase project and required environment values before exercising authentication, menu persistence, or model upload. Do not commit credentials or service-role keys.

## Evidence and limitations

The landing page describes potential business benefits such as higher order value and quick setup. Those are **product claims in the UI copy**, not independently measured outcomes. This repository does not currently publish controlled restaurant conversion data, AR usability results, or performance benchmarks. A working model-viewing experience also depends on valid GLB/GLTF assets and a device/browser with AR support.

## Why it matters

Food is difficult to evaluate from a text-only menu. A well-built 3D/AR preview can help guests understand a dish's presentation before ordering, while giving restaurants a manageable way to maintain visual menu assets.
