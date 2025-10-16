# System Patterns

## System Architecture

The website is a static client-side rendered site built with plain HTML, CSS, and JavaScript. It does not require a backend, though one could be added for features like a contact form.

## Key Technical Decisions

- **Frontend Framework/Library:** Plain HTML, CSS, and JavaScript.
- **Styling:** Custom CSS with a strong emphasis on CSS variables for theming and maintainability.
- **Deployment:** Static hosting (e.g., Netlify, Vercel, GitHub Pages).

## Design Patterns in Use

- **Responsive Design Patterns:** Utilizing CSS media queries, flexible grids, and fluid images to ensure adaptability across devices.
- **Themeable UI:** A theming system based on CSS variables and a `data-theme` attribute on the `<html>` element allows for easy switching between light and dark modes. All colors are defined as semantic variables (e.g., `--color-text-primary`, `--color-background-primary`).
- **JavaScript-based Localization:** A single `translations` object in `script.js` holds all string translations, which are dynamically applied to the page based on user selection.

## Component Relationships

- **Header/Navigation:** Global navigation, company logo, language selector, theme switcher.
- **Hero Section:** Main introductory content, animated logo, call to action.
- **About Section:** Company history, mission, values.
- **Services Section:** Detailed description of offerings.
- **Portfolio Section:** Display of past projects.
- **Testimonials Section:** Client feedback.
- **Contact Section:** Contact form, company address, social media links.
- **Footer:** Copyright, privacy policy, additional links.

## Critical Implementation Paths

- **Responsive Layout Implementation:** Ensuring the design adapts flawlessly to various screen sizes.
- **Portfolio Display:** Efficiently showcasing project details and images.
- **Theming and Localization:** Ensuring all components and text are correctly displayed in all themes and languages.
