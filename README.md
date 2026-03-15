# Portfolio Website

Static portfolio site for hosting Aviral Sharma's CV and selected work.

## Contents

- `index.html` - single-page portfolio and CV site
- `styles.css` - layout, visual system, motion, and responsive styling
- `script.js` - reveal-on-scroll interactions

## Included content

- Professional summary and contact links
- Experience timeline based on the latest CV
- Featured projects including:
  - OSIRIS at Etihad Airways
  - Agentic Receptionist Engine from `/home/avsharma/Documents/personal/agent`
  - HTC MLOps and LLMOps platform work
- Skills, education, and profile links

## Preview locally

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Docker (Cloud-ready)

Build:

```bash
docker build -t aviral-portfolio:latest .
```

Run locally:

```bash
docker run --rm -p 8080:80 aviral-portfolio:latest
```

Then open `http://localhost:8080`.

Health check endpoint:

```bash
curl http://localhost:8080/healthz
```

### Push to a registry

Tag and push:

```bash
docker tag aviral-portfolio:latest <registry>/<namespace>/aviral-portfolio:latest
docker push <registry>/<namespace>/aviral-portfolio:latest
```

Examples:

- Docker Hub: `docker.io/<username>/aviral-portfolio:latest`
- Azure Container Registry: `<acr-name>.azurecr.io/aviral-portfolio:latest`

## Hosting

This folder is static and can be hosted directly on:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps

No build step is required.
