# BrightMove

A property marketplace where visitors can browse listings and save favourites, while agent users can create and manage properties.

This project is split into a **Django REST Framework (DRF)** backend and a **React** frontend. State is managed with **Redux Toolkit**, unit tests for slice logic are written with **Jest**, and styling is handled by **Tailwind CSS**. The backend uses **SQLite** by default for fast local development.

---

## Features

- 🔎 **Browse properties** with search and filter controls (price, location, bedrooms, etc.)
- ❤️ **Wishlist**: authenticated users can save/unsave properties
- 🧑‍💼 **Agent dashboard**: create, update, publish/unpublish, and delete property listings
- 🔐 **Auth**: register/login/logout, JWT-based session (or DRF session auth in dev)
- 🖼️ **Images**: upload property photos (pluggable storage; local in dev)
- ⚡ **Fast dev**: SQLite for local development, easy to swap for Postgres in prod
- 🧪 **Unit tests** for Redux slices using Jest
- 🎨 **Tailwind CSS** for utility-first styling and rapid UI building

## Tech Stack

**Backend:** Python, Django REST Framework, SQLite

**Frontend:** React, Redux Toolkit, Tailwind CSS, Jest
