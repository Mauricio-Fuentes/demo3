# DEMO3 - NestJS + DDD

Proyecto NestJS organizado según la arquitectura **DDD (Domain-Driven Design)** con implementación completa de la entidad User.

## Estructura principal

- `src/main.ts`: punto de entrada de la aplicación NestJS.
- `src/app.module.ts`: módulo raíz (compone los módulos de cada bounded context).
- `src/domain`: núcleo del dominio (entidades, value objects, servicios de dominio, interfaces de repositorios).
- `src/application`: casos de uso / application services.
- `src/infrastructure`: implementaciones técnicas (ORM, adapters, etc.).
- `src/interfaces`: capa de presentación / API (controladores, DTOs hacia fuera).
- `src/shared`: utilidades y tipos compartidos.

## Implementación: Entidad User

El proyecto incluye una implementación completa de la entidad `User` siguiendo DDD:

### Capa Domain
- **Entidad**: `src/domain/users/entities/user.entity.ts`
  - Atributos: `id`, `name`, `email`, `password`, `status`, `dateRegister`, `dateModify`
  - Métodos: `create()`, `rehydrate()`, `updateName()`, `updateStatus()`, `toPrimitives()`
- **Repositorio (interfaz)**: `src/domain/users/repositories/user.repository.ts`

### Capa Application
- **Caso de uso**: `src/application/users/use-cases/create-user.usecase.ts`
- **DTOs**: `src/application/users/dto/create-user.dto.ts`

### Capa Infrastructure
- **Esquema Mongoose**: `src/infrastructure/users/schemas/user.schema.ts`
- **Repositorio MongoDB**: `src/infrastructure/users/repositories/user-mongo.repository.ts`
- **Módulo**: `src/infrastructure/users/user-infrastructure.module.ts`

### Capa Interfaces
- **Controlador**: `src/interfaces/users/users.controller.ts`
- **DTOs de request**: `src/interfaces/users/dto/create-user.request.ts`
- **Módulo**: `src/interfaces/users/user-interface.module.ts`

### Capa Shared
- **Servicio de encriptación**: `src/shared/services/password.service.ts`
  - Encriptación de passwords usando bcrypt
  - Métodos: `hashPassword()`, `comparePassword()`

## Seguridad

### Encriptación de Passwords

Los passwords se encriptan automáticamente antes de ser almacenados en la base de datos usando **bcrypt** con 10 salt rounds. El servicio `PasswordService` se encarga de:

- **Encriptar passwords**: Al crear un usuario, el password se encripta antes de persistirse
- **Verificar passwords**: Método disponible para comparar passwords en texto plano con hashes almacenados

El password original **nunca** se almacena en texto plano, garantizando la seguridad de los datos de los usuarios.

## Configuración MongoDB

La configuración de MongoDB se maneja mediante variables de entorno en el archivo `.env`:

- **Host**: `MONGODB_HOST` (por defecto: `localhost`)
- **Puerto**: `MONGODB_PORT` (por defecto: `27017`)
- **Base de datos**: `MONGODB_DATABASE` (por defecto: `demo3`)
- **Colección**: `user`

### Variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores según tu entorno:

```env
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=demo3
JWT_SECRET=your-secret-key-change-in-production
```

**Alternativa**: También puedes usar `MONGODB_URI` para especificar la cadena de conexión completa:
```env
MONGODB_URI=mongodb://localhost:27017/demo3
```

> **Importante**: Cambia `JWT_SECRET` por una clave secreta segura en producción. Esta clave se usa para firmar y verificar los tokens JWT.

La conexión se configura automáticamente en `src/app.module.ts` usando `@nestjs/config`.

## API Endpoints

### POST /users
Crea un nuevo usuario.

**Request Body:**
```json
{
  "id": "user-1",
  "name": "Mauricio",
  "email": "mauricio@example.com",
  "password": "secreto123"
}
```

**Response (201 Created):**
```json
{
  "id": "user-1",
  "name": "Mauricio",
  "email": "mauricio@example.com",
  "password": "$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012",
  "status": "ACTIVE",
  "dateRegister": "2024-01-01T00:00:00.000Z",
  "dateModify": null
}
```

**Response (409 Conflict) - Cuando el ID ya existe:**
```json
{
  "statusCode": 409,
  "message": "El usuario con ID 'user-1' ya existe"
}
```

> **Nota**: El campo `password` en la respuesta está encriptado usando bcrypt. El password original nunca se almacena en texto plano por seguridad.

> **Validación**: El endpoint valida que el `id` del usuario no exista previamente. Si el `id` ya existe, retorna un error 409 (Conflict) con un mensaje descriptivo.

### POST /users/validate
Valida las credenciales de un usuario (email y password).

**Request Body:**
```json
{
  "email": "mauricio@example.com",
  "password": "secreto123"
}
```

**Response (200 OK) - Credenciales válidas:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200a1b2c3...",
  "scope": "openid profile email"
}
```

**Response (401 Unauthorized) - Credenciales inválidas:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

> **Nota**: El servicio compara el password proporcionado con el hash almacenado usando bcrypt. Si las credenciales son válidas, retorna tokens JWT (access_token y refresh_token). El access_token expira en 3600 segundos (1 hora) y el refresh_token en 604800 segundos (7 días). Si el email no existe o el password no coincide, retorna un error 401.

## Scripts

- `npm install`: instala las dependencias.
- `npm run start`: arranca la aplicación.
- `npm run start:dev`: arranca en modo watch (desarrollo).
- `npm run build`: compila a `dist/`.
- `npm run lint`: ejecuta el linter.

## Requisitos

- Node.js (v18 o superior)
- MongoDB corriendo en `localhost:27017`

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Asegúrate de que MongoDB esté corriendo
# mongod --dbpath <ruta-a-tu-db>

# Iniciar en modo desarrollo
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

## CI/CD con GitHub Actions

El proyecto incluye un workflow de GitHub Actions (`.github/workflows/ci.yml`) que se ejecuta automáticamente en cada push y pull request.

### Integración con SonarQube Cloud

El proyecto está configurado para usar **SonarQube Cloud** para análisis de código y reportes de cobertura.

#### Configuración inicial

1. **Crear cuenta en SonarQube Cloud**:
   - Visita [sonarcloud.io](https://sonarcloud.io)
   - Crea una cuenta o inicia sesión con GitHub

2. **Crear organización y proyecto**:
   - Crea una organización en SonarQube Cloud
   - Crea un nuevo proyecto y obtén el `projectKey` y `organization`

3. **Configurar secrets en GitHub**:
   - Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions
   - Agrega el secret `SONAR_TOKEN` con el token de SonarQube Cloud
   - El `GITHUB_TOKEN` se genera automáticamente

4. **Actualizar `sonar-project.properties`**:
   - Reemplaza `your-organization-key` con tu organización de SonarQube
   - Ajusta `sonar.projectKey` si es necesario

#### El workflow ejecuta:

- ✅ Instalación de dependencias
- ✅ Linting del código
- ✅ Ejecución de tests unitarios
- ✅ Generación de reporte de cobertura
- ✅ Build del proyecto
- ✅ Análisis de código con SonarQube Cloud

Los reportes de cobertura y análisis de calidad de código estarán disponibles en tu dashboard de SonarQube Cloud.


