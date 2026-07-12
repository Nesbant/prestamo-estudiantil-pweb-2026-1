# SDD / Plan de implementación: backend simple para chat

Este documento define una implementación simple, sólida y defendible para conectar
el chat del frontend con un backend REST. El objetivo es que sirva para un
trabajo universitario: claro, mantenible, sin sobreingeniería y con principios
básicos de desarrollo de software.

## Decisión principal

Implementar el chat con una API REST y persistencia en base de datos. No usar
WebSockets, Redux, Zustand ni arquitectura compleja en esta primera versión.

| Tema | Decisión |
| --- | --- |
| Comunicación | REST sobre HTTP |
| Tiempo real | Fuera de alcance inicial |
| Estado frontend | Estado local en `ChatPage` |
| Persistencia | Backend + base de datos |
| Autenticación | Token Bearer existente |
| Alcance | Conversaciones y mensajes básicos |

## Alcance

### Incluido

- Crear o recuperar una conversación asociada a una publicación.
- Listar conversaciones del usuario autenticado.
- Listar mensajes de una conversación.
- Enviar mensajes.
- Persistir mensajes y conversaciones.
- Validar que solo participantes puedan leer o escribir en una conversación.
- Integrar el frontend mediante un `chatService` simple.
- Mantener estados de carga y error en la UI.

### No incluido por ahora

- WebSockets.
- Notificaciones push.
- Indicador de “escribiendo...”.
- Adjuntos o imágenes en mensajes.
- Reacciones.
- Borrado/edición de mensajes.
- Estados complejos de leído/no leído entre usuarios.
- Panel administrativo.

## Problema actual

El chat del frontend funciona como maqueta local:

- Los datos salen de `src/mocks/chat.js`.
- Los mensajes viven en memoria de React.
- Al refrescar la página se pierden los cambios.
- No hay API de conversaciones ni mensajes.
- Las acciones del chat no afectan el backend.

## Resultado esperado

Al terminar esta implementación:

1. El usuario entra a `/chat` y ve sus conversaciones reales.
2. Desde una publicación puede abrir o crear una conversación.
3. Puede enviar mensajes y estos quedan guardados.
4. Al recargar la página, los mensajes siguen apareciendo.
5. El frontend maneja carga, errores y estados vacíos sin romper la UI.

---

## Modelo de datos

## Conversation

Representa una conversación entre dos usuarios alrededor de una publicación.

```js
{
  id: number,
  postId: number,
  ownerId: number,
  participantId: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reglas de conversación

- `ownerId` es el dueño de la publicación.
- `participantId` es el otro usuario interesado.
- Debe existir una sola conversación para la combinación:

```txt
postId + ownerId + participantId
```

Esto evita conversaciones duplicadas por la misma publicación.

## Message

Representa un mensaje dentro de una conversación.

```js
{
  id: number,
  conversationId: number,
  senderId: number,
  text: string,
  createdAt: Date
}
```

### Reglas de mensajes

- `text` no puede estar vacío.
- `senderId` debe ser un participante de la conversación.
- El backend debe asignar `createdAt`.
- El frontend no debe inventar IDs reales.

---

## API REST propuesta

Base URL esperada:

```txt
/api
```

Todas las rutas requieren autenticación con token Bearer.

### 1. Listar conversaciones

```http
GET /api/conversations
Authorization: Bearer <token>
```

#### Respuesta: listar conversaciones

```js
{
  data: [
    {
      id: 10,
      postId: 5,
      postTitle: "Calculadora Científica Casio fx-991",
      otherUser: {
        id: 2,
        name: "Carlos Mendoza",
        avatar: "https://..."
      },
      lastMessage: "Sí, nos vemos en la cafetería.",
      lastMessageAt: "2026-07-11T15:30:00.000Z",
      unread: 0,
      isMyPost: true
    }
  ]
}
```

### Notas

- `otherUser` es el usuario con quien estoy conversando.
- `isMyPost` ayuda a decidir qué acciones mostrar en el frontend.
- `unread` puede iniciar en `0` si no se implementa lectura real todavía.

### 2. Crear o recuperar conversación

```http
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json
```

#### Body: crear conversación

```js
{
  postId: 5,
  otherUserId: 2
}
```

### Comportamiento

- Si la conversación ya existe, devolverla.
- Si no existe, crearla.
- Si el usuario intenta conversar consigo mismo, devolver error `400`.
- Si la publicación no existe, devolver error `404`.

#### Respuesta: crear conversación

```js
{
  data: {
    id: 10,
    postId: 5,
    postTitle: "Calculadora Científica Casio fx-991",
    otherUser: {
      id: 2,
      name: "Carlos Mendoza",
      avatar: "https://..."
    },
    lastMessage: null,
    lastMessageAt: null,
    unread: 0,
    isMyPost: false
  }
}
```

### 3. Listar mensajes

```http
GET /api/conversations/:conversationId/messages
Authorization: Bearer <token>
```

#### Respuesta: listar mensajes

```js
{
  data: [
    {
      id: 100,
      conversationId: 10,
      senderId: 1,
      text: "Hola, me interesa solicitar el préstamo.",
      createdAt: "2026-07-11T15:31:00.000Z"
    }
  ]
}
```

### 4. Enviar mensaje

```http
POST /api/conversations/:conversationId/messages
Authorization: Bearer <token>
Content-Type: application/json
```

#### Body: enviar mensaje

```js
{
  text: "Hola, ¿sigue disponible?"
}
```

#### Respuesta: enviar mensaje

```js
{
  data: {
    id: 101,
    conversationId: 10,
    senderId: 1,
    text: "Hola, ¿sigue disponible?",
    createdAt: "2026-07-11T15:32:00.000Z"
  }
}
```

---

## Validaciones de backend

## Conversaciones

- El usuario autenticado debe participar en la conversación.
- No se debe permitir crear conversación duplicada para la misma publicación y usuarios.
- No se debe permitir crear conversación con uno mismo.
- La publicación debe existir.

## Mensajes

- El texto debe tener contenido después de `trim()`.
- El texto debe tener un límite razonable, por ejemplo 500 caracteres.
- Solo participantes de la conversación pueden leer o enviar mensajes.

## Errores esperados

| Caso | Código |
| --- | --- |
| Sin token | 401 |
| Usuario no participa | 403 |
| Conversación inexistente | 404 |
| Texto vacío | 400 |
| Publicación inexistente | 404 |

---

## Integración frontend

## Archivos nuevos sugeridos

```txt
src/services/apiClient.js
src/features/chat/chatService.js
```

## `apiClient.js`

Debe centralizar el patrón que hoy está en `userService.js`:

```js
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem("campuslend_access_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message || "Ocurrió un error al procesar la solicitud.",
    );
  }

  return payload;
}
```

Luego `userService.js` y `chatService.js` deberían usar este cliente.

## `chatService.js`

```js
import { apiRequest } from "../../services/apiClient";

export const getConversations = () => apiRequest("/conversations");

export const createConversation = ({ postId, otherUserId }) =>
  apiRequest("/conversations", {
    method: "POST",
    body: JSON.stringify({ postId, otherUserId }),
  });

export const getMessages = (conversationId) =>
  apiRequest(`/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId, text) =>
  apiRequest(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
```

---

## Cambios en `ChatPage`

## Estado recomendado

```js
const [conversations, setConversations] = useState([]);
const [activeConversationId, setActiveConversationId] = useState(null);
const [messagesByConversation, setMessagesByConversation] = useState({});
const [newMessage, setNewMessage] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```

## Datos derivados con `useMemo`

```js
const filteredConversations = useMemo(() => {
  const value = searchTerm.trim().toLowerCase();
  if (!value) return conversations;

  return conversations.filter((conversation) =>
    conversation.otherUser.name.toLowerCase().includes(value) ||
    conversation.postTitle.toLowerCase().includes(value),
  );
}, [conversations, searchTerm]);
```

```js
const activeConversation = useMemo(
  () => conversations.find((item) => item.id === activeConversationId),
  [conversations, activeConversationId],
);
```

## Handlers con `useCallback`

Usar `useCallback` solo en handlers que se pasan a componentes memoizados:

- `handleSelectConversation`
- `handleSendMessage`
- `handleBackToList`
- `handleSearchChange`, si se mantiene como prop

No hace falta memoizar todo.

---

## Flujo desde `PostDetails`

En vez de enviar un contacto completo inventado, enviar datos mínimos:

```js
navigate("/chat", {
  state: {
    postId: post.id,
    otherUserId: post.authorId,
  },
});
```

Luego `ChatPage` debe:

1. cargar conversaciones;
2. detectar `location.state.postId` y `otherUserId`;
3. llamar a `createConversation({ postId, otherUserId })`;
4. activar esa conversación;
5. limpiar `location.state` con `replace`.

---

## Principios de desarrollo aplicados

## Separación de responsabilidades

| Capa | Responsabilidad |
| --- | --- |
| Componentes chat | Renderizar UI |
| `ChatPage` | Coordinar estado de pantalla |
| `chatService` | Hablar con backend |
| `apiClient` | Token, URL base y errores HTTP |
| Backend controller | Validar request/response |
| Backend service | Reglas de negocio |
| Base de datos | Persistencia |

## Simplicidad

- No agregar WebSocket hasta que el profesor o el alcance lo exijan.
- No agregar estado global si solo `/chat` usa estos datos.
- No duplicar lógica de API en cada servicio.
- No guardar en estado valores que se pueden derivar con `useMemo`.

## Control de renders

- Mantener `messagesByConversation` separado de `conversations`.
- Actualizar solo la conversación afectada al enviar mensaje.
- Evitar recrear arrays fallback dentro del render:

```js
const EMPTY_MESSAGES = [];
```

- Usar `React.memo` en componentes puros como:
  - `ChatSidebar`
  - `ChatHeader`
  - `ChatListaMensajes`
  - `ChatMensaje`
  - `ChatInput`

---

## Plan de commits sugerido

## Commit 1

```txt
feat(api): centralizar cliente http autenticado
```

Incluye:

- `src/services/apiClient.js`
- refactor mínimo de `userService.js`
- verificación de login/perfil

## Commit 2

```txt
feat(chat): agregar servicio REST de conversaciones
```

Incluye:

- `src/features/chat/chatService.js`
- funciones para conversaciones y mensajes
- sin tocar todavía toda la UI

## Commit 3

```txt
feat(chat): cargar conversaciones desde backend
```

Incluye:

- `ChatPage` carga conversaciones reales
- loading/error/empty state
- conserva UI actual

## Commit 4

```txt
feat(chat): persistir envío de mensajes
```

Incluye:

- carga de mensajes por conversación
- envío con `POST`
- actualización local optimista simple o actualización después de respuesta

Recomendación: para evitar errores, empezar sin optimismo. Primero guardar en
backend y luego actualizar UI con la respuesta.

## Commit 5

```txt
fix(post): abrir conversación real desde publicación
```

Incluye:

- navegación desde `PostDetails` con `postId` y `otherUserId`
- `ChatPage` crea o recupera conversación

---

## Tareas de implementación

## Backend

- [ ] Crear modelo/tabla `conversations`.
- [ ] Crear modelo/tabla `messages`.
- [ ] Agregar índice único para evitar conversaciones duplicadas.
- [ ] Implementar `GET /api/conversations`.
- [ ] Implementar `POST /api/conversations`.
- [ ] Implementar `GET /api/conversations/:id/messages`.
- [ ] Implementar `POST /api/conversations/:id/messages`.
- [ ] Validar permisos por usuario autenticado.
- [ ] Validar texto de mensajes.

## Frontend

- [ ] Crear `src/services/apiClient.js`.
- [ ] Refactorizar `userService.js` para usar `apiClient`.
- [ ] Crear `src/features/chat/chatService.js`.
- [ ] Reemplazar mocks por carga inicial desde API.
- [ ] Agregar loading/error states.
- [ ] Cargar mensajes al seleccionar conversación.
- [ ] Enviar mensajes con backend.
- [ ] Actualizar `PostDetails` para abrir conversación real.
- [ ] Mantener fallback visual cuando no hay conversaciones.

## Verificación

- [ ] Login sigue funcionando.
- [ ] Perfil sigue cargando usuario actual.
- [ ] `/chat` muestra conversaciones reales.
- [ ] Se puede abrir conversación desde una publicación.
- [ ] Se puede enviar mensaje.
- [ ] Al refrescar, el mensaje permanece.
- [ ] Un usuario no participante no puede leer conversación ajena.
- [ ] `npm run build` pasa.
- [ ] `npm run lint` pasa o se documentan errores preexistentes.

---

## Criterios de aceptación

La implementación se considera lista cuando:

1. El chat ya no depende de `src/mocks/chat.js` para datos principales.
2. Las conversaciones se cargan desde backend.
3. Los mensajes se guardan en backend.
4. El usuario solo ve conversaciones donde participa.
5. El frontend muestra loading, error y empty states.
6. El build pasa.
7. El flujo desde publicación hasta chat funciona.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Backend no tiene estructura clara | Implementar módulos simples: routes/controller/service/model |
| Duplicación de conversaciones | Índice único por conversación |
| Usuario accede a chat ajeno | Validar participantes en cada endpoint |
| UI se vuelve lenta | Estado local acotado y memoización puntual |
| Mucho cambio por commit | Seguir commits por unidad funcional |
| Se rompe auth | Refactorizar `apiClient` primero y verificar login/perfil |

---

## Recomendación final

Para este proyecto, el camino correcto es:

```txt
REST + base de datos + estado local en ChatPage
```

No conviene implementar tiempo real todavía. Primero hay que lograr persistencia,
autorización y flujo estable. Una vez que eso funcione, si sobra tiempo, se
puede agregar polling simple cada cierto intervalo. WebSocket debería quedar
como mejora futura, no como requisito inicial.
