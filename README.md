### backend development

1. Create git Repo
     git init
2. Add .gitignore file
3. create .env file for environment variables & read data from .env with "dotenv" module
 - npm i dotenv
4. Generate package.json
    npm init -y
5. create express application
6. connect to database
7. Add middlewares (body parsing MW, Error handling MW common for every project generally)
8. Design schema's and create models (crucial step)
9. Design REST APIs for all resources

### Registration & login
*** role should be decided by backend(i.e,server) but not client to ensure more security
10. Registration & login is common for USER & AUTHOR. Create a seperate service to reuse
11. The client wont send role. it just redirects to a 
* route- request handling mech
* when req contains toke then its authenticated req (if req is made after login then it will contain token)
* if invalid roles are assigned then backend will overwrite the application
* if there are common operation for all users then include all those routes in common api (ex-login & logout)
* Architecture,flow,code
* Admin will be given with mail & password by the comp usually where pass can be changed and all privileges are given automatically

* Array($push-just inserts without verification,$AddToSet) and document-($set,$unset) update operators are different











### Backend development

1. Create git repo
    git init

2. Add .gitignore file

3. Create .env file for environment variables & Read data from .env   
   with "dotenv" module
    npm install dotenv

4. Generate package.json

5. Create express app

6. Connect to Database

7. Add middlewares( body parser, err handling middlewares)

8. Design Schemas and create models

9. Design REST APIs for all resources

### Registration & Login

10. Registration & Login in common for USER & AUTHOR. Create a seperate service to reuse

11. The Client wont send role. It just redirects to a specific API based on role selection. The hardcoded role assigned by API routes.