# Demo Vuetify amb WebSockets

Aquest projecte és una demostració d'integració entre Vue 3, Vuetify i WebSockets, implementat amb una arquitectura moderna i contenitzat amb Docker.

## 🚀 Característiques Principals

- Frontend modern amb Vue 3 i Vuetify
- Comunicació en temps real mitjançant WebSockets
- Arquitectura modular i escalable
- Contenització completa amb Docker
- Sistema de cerca en temps real integrat amb l'API d'OMDB

## 🏗️ Estructura del Projecte

El projecte està dividit en dues parts principals:

### Frontend
- Desenvolupat amb Vue 3 i Vuetify
- Ubicat a la carpeta `/frontend`
- Integra serveis modulars a `/src/services`:
  - `websocketManager.js`: Gestiona la connexió WebSocket i els esdeveniments en temps real
  - `fetchManager.js`: Gestiona les peticions a l'API externa (OMDB)

### Backend
- Servidor WebSocket simple i eficient
- Ubicat a la carpeta `/backend`

## 📦 Contenització

El projecte utilitza Docker per a una configuració consistent i fàcil desplegament:

```yaml
services:
  frontend:
    # Port: 3000
    # Hot-reloading activat
    # Configuració de WebSocket inclosa

  backend:
    # Port: 8080
    # Volums configurats per desenvolupament
```

## 🔧 Configuració i Execució

1. Clona el repositori
2. Executa amb Docker Compose:
```bash
docker-compose up
```

Els serveis estaran disponibles a:
- Frontend: http://localhost:3000
- Backend WebSocket: ws://localhost:8080

## 💡 Característiques Destacades

### Sistema de Comunicació en Temps Real
El projecte implementa un sistema robust de comunicació en temps real mitjançant el `websocketManager`, que proporciona:
- Gestió automàtica de connexions
- Sistema d'esdeveniments en temps real
- Límit configurable d'esdeveniments
- Gestió d'errors i reconnexió

### Integració amb APIs Externes
El `fetchManager` proporciona una capa d'abstracció per a les comunicacions HTTP:
- Integració amb l'API d'OMDB
- Gestió centralitzada de peticions
- Fàcilment extensible per a altres APIs

## 🛠️ Tecnologies Utilitzades

- Vue 3
- Vuetify
- WebSocket
- Docker
- Node.js (backend)

## 📝 Llicència

MIT
