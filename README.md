# Pagina principal
La página contiene los primeros dos módulos principales del sistema electoral, los cuales son, el módulo de login y el módulo de registro.

### Ejecución
- Ejecutar el comando `npm install`
- Ejecutar el comando `npm start`

## Endpoints

**POST** - **LOGIN** `/users/login`
#### Request
```json
{
    "membership_number": "15",
    "dpi": "2998365150101",
    "birthdate": "2004-02-20",
    "password": "umg123"
}
```

#### Response (200)

```json
{
    "ok": true,
    "msg": {
        "membership_number": 15,
        "full_name": "superadmin",
        "email": "superadmin@gmail.com",
        "dpi": "2998365150101",
        "birthdate": "2004-02-20",
        "password": "$2b$10$D6Sjj7A9Yl.BF/Rw.PDKZOmkT4yZaN9dm54DZ37XNLfo30bW7Lr2m",
        "role_id": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJzaGlwX251bWJlciI6MTUsInJvbGVfaWQiOjIsImlhdCI6MTc2MDI0NjYyNSwiZXhwIjoxNzYwMjY4MjI1fQ.GmEAvfLFn2M4eEXyWrG-SZwHoiu0GElGFFbDAhDtzg8"
}
```

**POST** - **REGISTRO** `/users`
#### Request
```json
{
    "membership_number": "6",
    "full_name": "Andrea Perez",
    "email": "andrea.perez@gmail.com",
    "dpi": "299836580101",
    "birthdate": "04/02/2002",
    "password":"umg123",
    "role_id": "2"
}
```

#### Response (200)
```json
{
    "ok": true,
    "msg": {
        "membership_number": 6,
        "full_name": "Andrea Perez",
        "email": "andrea.perez@gmail.com",
        "dpi": "299836580101",
        "birthdate": "2004-02-20",
        "password": "$2b$10$NTKEb46dj/Uo1LC2jV2UkO6VF7g/oArMCDgDp16l2iAhGpib3do3u",
        "role_id": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJzaGlwX251bWJlciI6Niwicm9sZV9pZCI6MiwiaWF0IjoxNzYwMjQ0OTE3LCJleHAiOjE3NjAyNjY1MTd9.OdqDyq_8QTnCwHSzqZJtCvWDsz8l-XUt4VGd5gUO-D0"
}
```

### URL 
#### API
https://electoral-system.onrender.com

#### Página web
https://electoral-system-page.onrender.com
