# CareerHub Frontend

## Run locally with Windows Command Prompt

Open two Command Prompt windows. Start the backend in the first one using the environment values and MySQL database setup documented in `..\backend\README.md`:

```cmd
cd /d C:\CareerHub\backend
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "DB_URL=jdbc:mysql://localhost:3306/careerhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
set "DB_USERNAME=your-local-mysql-user"
set "DB_PASSWORD=your-local-mysql-password"
set "APP_JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long"
mvn spring-boot:run
```

In the second window, start the frontend:

```cmd
cd /d C:\CareerHub\frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The frontend calls the backend at `http://localhost:8081/api` by default. To use a different API address, create `frontend\.env.local` containing:

```text
VITE_API_BASE_URL=http://localhost:8081/api
```

Keep database credentials and the JWT secret in your local terminal environment; do not commit them.
