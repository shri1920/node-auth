# NODE-AUTH
Token based Authorization service using NodeJS, Redis, CouchDB.
## API DESCRIPTION
#### TO REGISTER USER
    curl -X POST http://localhost:5100/registeruser
         -H "Content-Type: application/json"
         -d '{"userId": "someone@example.com", "passwd": "123456", "firstName": "Fname", "lastName": "Lname"}'
#### TO CONFIRM REGISTERED USER
    curl -X POST http://localhost:5100/confirmuser/<user id>?signature=<token>
#### USER LOG IN
    curl -X POST http://localhost:5100/login
         -H "Content-Type: application/json"
         -d '{"userId": "someone@example.com", "passwd": "123456"}'
#### USER LOG OUT
    curl -X POST http://localhost:5100/logout
         -H "Authorization: Bearer <token>"
#### TO GET PASSWORD RECOVERY LINK
    curl -X POST http://localhost:5100/forgotpasswd
         -H "Content-Type: application/json"
         -d '{"userId": "someone@example.com"}'
#### TO UPDATE PASSWORD
    curl -X POST http://localhost:5100/changepasswd/<user id>?signature=<token>
         -H "Content-Type: application/json"
         -d '{"passwd": "new-passwd"}'
#### TO VERIFY TOKEN
    curl -X POST http://localhost:5100/verify
         -H "Authorization: Bearer <token>"

#### "LICENSE"

[MIT](https://github.com/shri1920/node-auth/blob/master/LICENSE)