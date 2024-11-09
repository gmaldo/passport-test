# passport-test
Se implementa un login sencillo utilizando jwt para autenticar
rutas implementadas:
* localhost:8080/api/sessions/login
* localhost:8080/api/sessions/signup
* localhost:8080/api/sessions/current

la contraseña se guarda con bycrypt (hashsync)

# .env
```
MONGO_URL = url_mongo_atlas
GUIHUB_CLIENTID = client id de github
GITHUB_CLIENTSECRET = client secret de github
```