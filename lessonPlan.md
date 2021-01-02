## 1

- Routing in ExpressJS
- modular route handlers
- Writing middleware functions
- writing configurable middleware functions
- writing router level middleware functions
- writing error handler middleware functions
- using expressjs built-in middleware fucntions to serve static assets
- parsing http req body
- compressing http responses
- using http req logger
- managing and creating virtual domains
- securing express web app with helmet
- using template engine
- debugging express web app

## 2 robust web app and api

- req methods can be safe - read only operation on server, idempotent - same effect for identical req are made - all safe methods are idempotent ( GET, PUT, DELETE), cacheable - res that can be cached - not all methods or verb can be cached - status code of res, method used to make the req are cacheable, GET - 200 req success, 204 no content, 206 - partial content, 301 moved permanently, 404 not found, 405 methods not allowed, 410 gone or content permanently removed from server, 414 uri too strong

## routing restful api

- express - req- all data and infos about client req, for instance. Expressjs parses uri and make its parameters availabe on req.query
- express - res- datas that are sent to clients res headers can be modified - res object has several methods for sending status code and data to client - res.status(200).send("some data)
-
- route method
- - get, delete
- import express from "express"
- const app = express()
- app.get("/", (req,res,next)=>{
  res.status(200).send("Hello from express")
  })
  - app.listen(4000, ()=>console.log(`Web Server on port ${port}`))
  -
- route handlers
- app.get("/one", (req, res, next)=>{
  res.type("text/plain");
  res.write("Hello")
  next()
  })
  - app.get("/one", (req, res, next)=>{
    res.status(200).end("World!")
    })
- app.get("/two", (req, res, next)=>{
  res.type("text/plain");
  res.write("Hello");
  next()

  },
  (req, res, next)=>{
  res.status(200).end("moon!")

}
)

-
- chainable route methods
- app.route("/home")
  .get((req, res, next)=>{
  res.type("text/html");
  res.write("<!DOCTYPE html>);
  next()
  })
  .get((req, res, next)=>{
  res.end(`
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>WebApp powered by ExpressJS</title>
    </head>
    </head>
    <body>
      <form method="post" action="/home">
        <input type="text" />
        <button type="submit">Send</button>
      </form>
    </body>
    </html>
  `);
  })
  .post((req, res, next)=>{
      res.send("Got It!")
  })

- rote paths can be string or regular expression internally turned by path-to-regexp
- app.get("/:id-:tag", (req, res, next)=>{
  res.send(req.params)
  })

  -
  - modular route handlers
  - express js has build in router class to write moutable and modular route handlers
  - const router = express.Router();
    router.get("/", (req, res, next)=>{
    res.send("Hello there!")
    })
    router.post("/", (req, res, next)=>{
    res.send("i got data")
    })

    -
    - const miniapp = express.Router();
      miniapp.get("/home", (req, res, next)=>{
      const url= req.originalUrl;
      res.status(200).send(`you are visiting /home from ${url}`)
      })
    - app.use("/first", miniapp)
    - app.use("/second", miniapp)
    -
    - writing middleware functions - mainly used to make changes in req and res objects, they are req compilation are in orders, if middleware functions does'nt pass control, the req is left hanging..

    - app.use((req, res, next)=>{
      req.allowed = Reflect.has(req.query, 'allowme')
      next()
      })
    - app.get("/", (req, res, next)=>{
      if req.allowed
      res.send("Hello Secret World!")
      else
      res.send("You are not allowed to enter")

    })

- writing configurable middleware functions
- common pattern for writing middleware functions inside another middleware function the result of doing so is configurable middleware functions they are Higer Order Function
- const fn = options => (res, req, next)=>{
  next()
  }

  - logger
  - const logger = (options) => (req, res, next)=>{
    if (typeof options === "object" && options !== null && options.enable){
    console.log("status code: ", res.statusCode, "URL :", req.originalUrl)
    }
    next()
    }
    module.exports = logger

    - const express = require("express")
      const loggerMiddleWare = require("./")
      const app = express()
      app.use(loggerMiddleWare({enable: true}))

      // debug module , winston module
      // log helps service checks, errors and bugs
      // understand app working, modular applications

      - router level middleware functions
      - const express = require("express")
        const app = express(), router = express.Router()
        router.use((req, res, next)=>{
        console.log("URL :", req.originalUrl)
        next()
        })
        app.use("/router", router)

- const express = require("express")
  const app = express()
  const router = express.Router()
  router.use((req, res, next)=>{
  if(!req.query.id){
  next("router")
  }else{
  next()
  }
  })
  router.get("/", (req, res, next)=>{
  const id = req.query.id
  res.send(`you specified a user id => ${id}`)
  })

  app.get("/", router, (req, res, next)=>{
  res.status(400).send("a user id need to be specified")
  })

  - writing error-handler middleware functions
  - express already includes by default a built-in error handler gets executed at end of all middleware and route handlers
    // implicit
    app.get("/", router, (req, res, next)=>{
    throw new Error("oh no! something went wrong!")
    })
    //explicit
    app.get("/", router, (req, res, next)=>{
    try{

    throw new Error("oh no! something went wrong!")
    } catch (error){
    next(error)
    }
    })

    - custom error handler
      app.use((error, req, res, next)=>{
      next(error)
      })

- custom error handler
- const express = require("express")
  const app = express()

  app.get("/", router, (req, res, next)=>{
  try{

  throw new Error("oh no! something went wrong!")
  } catch (error){
  next(error)
  }
  })

  app.use((error, req, res, next)=>{
  res.end(error.message)
  })

- using expressjs built-in middleware functions for static assets
- built-in middleware error, staic
- express.static
- create index.html
  <!DOCTYPE html>
  <html>
   <head>
     <meta charset="utf-8" />
     <title>Simple Web </title>
   </head>
   <body>
     <section role="application">
       <h1>Web app</h1>
     </section>
   </body>
  </html>
  -
- const express = require("express")
  const path = require("path")
  const app = express()
  const publicDir = path.join(\_\_dirname, "./public")

  app.use("/", express.static(publicDir))

  -- define router static
  const staticRouter = express.Router()
  express.static configurable middleware functions to include both directories

  const assets = { first: path.join(**dirname, "./public"), second: path.join(**dirname, "./another-public") }
  staticRouter.use(express.static(assets.first))
  staticRouter.use(express.static(assets.second))

  app.use("/", staticRoouter)
  app.listen(4000, ()=> console.log("Web server running on port: 4000"))

  - parsing http req body
  - - req, req.body
  -
  - JSON, TEXT, RAW ( buffer original incomming DATA ), URL ENCODED FORM
  - automatic decompression gzip and deflates encodings when incoming req is compressed
  - express, body-parser

- const express = require("express")
  const bodyParser = require("body-parser")
  const app = express()
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.text())
  app.get("/", (req, res, next)=>{
  res.send(`
    <!DOCTYPE html>

      <html lang="en">
       <head>
         <meta charset="utf-8" />
         <title>Simple Web </title>
       </head>
       <body>
         <div role="application">
           <form method="post" action="/setData">
             <input name="urlencoded" type="text">
             <button type="submit">SEND</button>
           </form>
           <form method="post" action="/setData">
             <input name="txtencoded" type="text">
             <button type="submit">SEND</button>
           </form>
         </div>
       </body>
      </html>

  `)
  })

  app.post('/setdata', (req, res, next)=>{
  console.log(req.body)
  res.end()
  })

  - compressing http responses
    -gzip, deflate- Accept-Encoding http header to determine which content-encoding mechanism support on client-side, content-encoding , compression configurable middleware function accepts option object as first arg as behaviour for middleware and also pass zip options

  - compression, express

  - const express = require("express")
  - const compression = require("compression")
    const app = express()
    include compression middleware function , specify the level of compression and threshold or minimum sizes in bytees
    app.use(compression({level: 9, threshold: 0}))
    app.get("/", (req, res, next)=>{
    res.send(`<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <title>WebApp powered by Express</title> </head> <body> <section role="application"> <h1>Hello this page is compressed</h1> </section> </body> <body> </body> </html>`)
    console.log(req.acceptsEncoding())
    })
    - widely used http req logger - morgan
    - its configurable middleware functions takes two arg format and option
      format and kind of information formts - tiny, short, common, combined, dev

- express, morgan
- morgan configurable middleware function with dev format to display every info of every req
- const express = require("express")

  - const morgan = require("morgan")
    const app = express()
    app.use(morgan("dev"))
    app.get("\*", (req, res, next)=>{
    res.send("Hello Morgan!")
    })
    app.listen(4000, ()=>{})

    -
    - managing and creating virtual domains
    - vhost - configurable middleware accepts 2 args hostname and req handler, hostname follow same rules as route paths
    - express, vhost
    - const express = require("express")
      const vhost = require("vhost")
      const app = express()
      const app1 = express.Router()
      const app2 = express.Router()

    app1.get("/", (req, res, next)=>{
    res.send("This is main app")
    })

    app2.get("/", (req, res, next)=>{
    res.send("This is second app")
    })

  app.use(vhost("localhost", app1))
  app.use(vhost("second.localhost", app2))

  - const express = require("express")
    const vhost = require("vhost")
    const app = express()
    const users = express.Router()
    users.get("/", (req, res, next)=>{
    const userName = req.vhost[0].split("-").map(name=>( name[0].toUpperCase() name.slice(1) )).join(" ")
    res.send(`hello ${userName}`)
    })
    app.use(vhost("\*.localhost", users))

    -
    - securing express web appliction with helmet
    - protect against cross-site scripting ( xss ), insecure reqs, clickjacking
    - collection of 12 middleware functions that allow to specific http headers
    - - Content Security Policy - allows whitelist resource in app such as js, images, css
    - - cetificate transperancy
    - - DNS Prefetch control
    - - frameguard - prevent clickJacking by telling browser not put application inside iframe
    - - hide powered-by - header indicates not to display technology powers the server
    - - http public key pinning - helps to prevent man-in-middle attack
    - - http strict transport security - strict to https
    - ie no open
    - no cache - disable browser caching
    - dont sniff mimetype - forces browser to disable mime sniff or guessing content type of served file
    - referer policy - referer header provide server data regarding req was originated
    - xss filter
    -
    - - body-parser, express, helmet, uuid
    - const express = require("express")
      const helmet = require("helmet")
      const bodyParser = require("body-parser")
      const uuid = require("uuid/v1")
      const app = express()
      const suid = uuid()
      app.use(bodyParser.json({ type: ["json", "application/csp-report"] }))

    app.use(helmet.contentSecurityPolicy({
    directives: {//by default not allowed until whitelisted
    defaultSrc: ["none/self"], scriptSrc: [`'nonce-${ssuid}'`], reportUri: '/csp-voilation'}
    }))

    app.post('/csp-voilation', (req, res, next)=>{
    const {body} = req
    if(body){
    console.log("csp report voilation:")
    console.dir(body, {colors: true, depth: 5})
    }
    res.status(204).send()
    })
    app.use(helmet.dnsPrefetchControl({allow: false}))
    app.use(helmet.framegaurd({action: "deny"}))
    app.use(helmet.hiddenPoweredBy({
    setTo: 'Django/3.2.1 SVN-1336'
    }))
    app.use(helmet.ieNoOpen())
    app.use(helmet.noSniff())
    app.use(helmet.referrerPolicy({
    policy: "same-origin"
    }))
    app.use(helmet.xssFilter())
    app.get("/", (req, res, next)=>{
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
       <head>
         <meta charset="utf-8" />
         <title>Simple Web </title>
       </head>
       <body>
       <span id="txtLog"></span>
       <img src="" alt="">
       <script></script>
       <script nonce="${ssuid}"></script>
       </body>
       </html>
      
      `)
    })

-
- using template engine
- generate html code in more convenient way
- template or view can be written in any format, replace variable with value
- build your template engine
  app.engine("...", (path, options, callback)=>{
  ...
  })
  app.set("views", "./")
  app.set("view engine", "...")

  -
  - views direcory
    .tpl html file
    <!DOCTYPE html>
     <html lang="en">
      <head>
       
      </head>
      <body>
        <h1>%title%</h1>
      </body>
     </html>

- express, fs
- const express = require("express")
  const fs = require("fs")
  const app = express()
  app.engine("tpl", (filepath, options, callback) => {
  fs.readFile(filepath, (err, data) => {
  if(err){
  return callback(err)
  }
  const content = data.toString().replace(/%[a-z]+%/gi, (match) => {
  const variable = match.replace(/%/g, "")
  if(Reflect.has(options, variable)){
  return options[variable]
  }
  return match
  })
  return calback(null, content)
  })

  })
  app.set("views", "./views")
  app.set("view engine", "tpl")
  app.get("/", (req, res, next)=>{
  res.render("home", {title : "hello"})
  })

- debugging express web app
- express uses debug internal module to log info, debug logs can easily be diasbled on production mode

- deebug, express
  unlike console.log in production debug can be disabled
- const express = require("express")
- const debug = require("debug"("js file name"))
  const app = express()
  app.get("_", (req, res, next)=>{
  debug("Request: ", req.originalUrl)
  res.send("Hello")
  })
  app.listen(4000, ()=> console.log("web"))
  //
  set DEBUG=exprss:_ node debugging.js
  - building a restful API
  - CRUD operations using ExpressJs route Methods
- CRUD operation with Mongoose
- using Mongoose query builders
- definig document instance methods
- defining static model methods
- writing middleware functions for mongoose
- writing custom validators for mongoose schemas
- building restful api to manage users with express and mongoose
- representational state transfer is architectural style the web was built on...
  // add create
  app.post("/resource", handler)
  // get read
  app.get("/resource/:id", handler)
  //update
  app.put("/resource/:id", handler)
  //delete
  app.delete("/resource", handler)
- in MVC, controller are in charge of transformng input too something that model and views are understand
  they transform input into actions or commands and sends them to model or view to update

  -
  - express, node-fetch, uuid
  - build restful api with in memory database, an arrays of objects contain list of users, CRUD operation using http methods

  - const express = require("express")
    const uuid = require("uuid")
    const app = express()

    let data = [
    {id: uuid(), name: "Bob"}
    {id: uuid(), name: "Alice"}
    ]

  // model contains functions making CRUD operations
  const usr = {
  create(name){
  const user = {id: uuid(), name}
  data.push(user)
  return user
  },
  read(id){
  if(id === "all") return data
  return data.find(user => user.id===id)
  },
  update(id, name){
  const user = data.find(usr => usr.id === id)
  if(!user) return {status: "User not found"}
  user.name = name
  return user
  },
  delete(id){
  data = data.filter(user => user.id !== id)
  return {status: "deleted", id}
  }
  }
  // req handler post method create operation
  app.post("/users/:name", (req, res)=>{
  res.status(201).json(usr.create(req.params.name))
  })
  // retur ided user or list users
  app.get("/users/:id", (req, res)=>{
  res.status(200).json(usr.read(req.params.id))
  })
  // put method to update handler
  app.put("/user/:id=:name", (req, res)=>{
  res.status(200).json(usr.update( req.params.id, req.params.name))
  })
  // delete operation
  app.delete("/users/:id", (req, res) => {
  res.status(200).json(usr.delete(req.params.id))
  })
  app.listen(4000, ()=> console.log("web"))

  )
  // test
  const fetch = require("node-fetch");
  const rFetch = async (url, method) => ( await fetch(`http://localhost:1337${url}`, {method}).then(rdata=> rdata.json())
  const log = (...obj) => (
  obj.forEach(o=> console.dir(o, {colors: true}))
  )
  async function test(){
  const users = await rFetch("/users/all", "get")
  const {id} = users[0]
  const getById = await rFetch("/users/${id}", "get")
    const updateById = await rFetch("/users/${id}=Jhon", "put")
  const deleteById = await rFetch("/users/${id}", "delete")
  const addUsr = await rFetch("/users/Smith", "post")
  const getAll = await rFetch("/users/all", "get")
  //
  log("[GET] users:", users)
  log("[GET] a user with id=${id}:", getById)
  log("[PUT] a user with id=${id}:", updateById)
  log("[POST] users:", addUsr)
  log("[DELETE] users:", deleteById)
  log("[GET] users:", getAll)
  }
  test()

- crud operations with mongoose
- create database by using schemas and built in validation, MongoDB is document-oriented database
- const PersonSchema = new Schema({
  firstName: String,
  lastName: String
  })
  const Person = connection.model("Person", PersonSchema)
  // String, Number, Boolean, Array, Date, Buffer, Mixed, Objectid, Decimal128

  - const {Schema} = require("mongoose")
    const PersonSchema = new Schema({
    name: String,
    age: Number,
    isSingle: Boolean,
    birthDay: Date,
    descriptions: Buffer
    })

- - const {Schema, SchemaTypes} = require("mongoose")
    const PersonSchema = new Schema({
    name: SchemaTypes.String,
    age: SchemaTypes.Number,
    isSingle: SchemaTypes.Boolean,
    birthDay: SchemaTypes.Date,
    descriptions: SchemaTypes.Buffer
    })

- - const {Schema} = require("mongoose")
    const PersonSchema = new Schema({
    name: {type: String, required: true, default: "Unknown"},
    age: {type: Number, required: true, min: 18, max: 80},
    isSingle: {type: Boolean},
    birthDay: {type: Date, required: true},
    descriptions: {type: Buffer}
    })

  const PersonSchema = new Schema({
  name: String,
  age: Number,
  likes: [String.]
  })

-

- mongoose
  const mongoose = require("mongoose")
  const {onnection, Schema} = mongoose
  mongoose.connect('mongodb://localhost:27017/test').catch(console.error)

  - const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    likes: [String]
    })

  - const User = mongoose.model("User", UserSchema)

  - const addUser = (firstNam, lasNam)=>new User({
    firstNam,
    lastNam
    }).save()

        - const getUser = id => User.findById(id)

        - const removeUser = id => User.remove({id})

        - connection.once("connected", async () => {

    try{

  //create
  const newUser = await addUser("john")
  //read
  const user = await getUser(newUser.id)
  //update
  user.firstName = "john"
  user.lastName = "Smith"
  user.likes = {
  "cooking",
  "iceCream"
  }
  await user.save()
  console.log(JSON.stringify(user, null, 4))
  //delete
  await removeUser(user.id)
  }catch(error){
  console.dir(error.message, {colors: true})
  }finally{
  await connection.close()
  }
  })

- mongoose query builder
  const user = await User.findOne({
  firstNam: "John",
  age: {$lte: 30}
  }, (error, document) => {
  if(error) return console.log(error)
  console.log(document)
  })

  const user = User.findOne({
  firstNam: "John",
  age: {$lte: 30}
  })
  user.exec((error, document) => {
  if(error) return console.log(error)
  console.log(document)
  })

  try{
  const user = await User.findOne({
  firstNam: "John",
  age: {$lte: 30}
  })
  console.log(user)
  }catch(error){
  console.log(error)
  }

try{
const user = await User.findOne().where("firstNam", "John").where("age").lte(30)
console.log(user)
}catch(error){
console.log(error)
}

- mongoose
  const mongoose = require("mongoose")
  const {connection, Schema} = mongoose
  mongoose.connect("mongodb://localhost:27017/test").catch(console.error)
  const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number
  })
  const User = mongoose.model("User", UserSchema)

  connection.once("connected", async ()=>{
  try{
  const user = await new User({
  firstName: "John",
  lastName: "Snow",
  age: 30,
  }).save()
  const findUser = await User.findOne().where("firstName").equals("John").where("age").lte(30).select("lastName")
  console.log(JSON.stringify(findUser, null, 4))
  await user.remove()
  }catch(error){
  console.dir(error.message, {colors: true})
  }finally{
  await connectionn.close()
  }
  } )

  - defining document instance methods
    // const instance = new Model()
    or
    // Model.findOne([condition]).then((instance)=>{})

    - const mongoose = require("mongoose")
      const {conection, Schema} = mongoose
      mongoose.connect("mongodb://localhost:27017/test").catch(console.error)
      const UserSchema = new Schema({
      firstName: String,
      lastName: String,
      age: Number,
      likes: [String]
      })
      UserSchema.method("setFullName", function setFullName(v){
      const fullName = String(v).split(" ")
      this.lastName = fullName[0] || "" this.firstName = fullName[1] || ""
      })
      UserSchema.method("getFullName", function getFullName(){
      return `${this.firstName} ${this.lastName}`
      })
      UserSchema.method("loves", function loves(stuff){
      this.likes.push(stuff)
      })
      UserSchema.method("dislikes", function dislikes(stuff){
      this.likes = this.likes.filter(str => str !== stuff)
      })

      const User = mongoose.model("User", UserSchema)

      - connection.once("connected", async () => {
        try{
        const user = new User()
        user.setFullName("Huang Jinguax")
        user.loves("Kitties")
        user.loves("strawberries")
        user.loves("snakes")
        await user.save()
        const person = await User.findOne().where("firstName", "jinc").where("likes").in(["snakes", "kitties"])
        person.dislikes("snakes")
        await user.save()

            console.log(person.getFullName())
            console.log(JSON.stringify(person, null, 4))
            await user.remove()

        }catch(error){
        console.dir(error.message, {colors: true})
        }finally{
        await connection.close()
        }
        })

- definig static model methods
- find , findOne, findOneAndRemove
- mongoose
  const mongoose = require("mongoose")
  const {connection, Schema} = mongoose
  mongoose.connect("mongodb://localhost:27017/test").catch(console.error)
  // define Schema
  const UsrSchm = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  likes: [String]
  })
  UsrSchm.static("getByFullName", function getByFullName(v){
  const fullName = String(v).split(" "),
  firstName = fullName[1] || ""
  lastName = fullName[0] || ""
  return this.findOne().where("firstName").equals(firstName)
  })
  const User = mongoose.model("User", UsrSchm)

  connection.once("connected", async ()=>{
  try{
  //create
  const user = new User({
  firstName: "Jingxuan",
  lastName: "Huang",
  likes: ["kitties", "strawberries"]
  })
  await user.save()

      const peron = await User.getByFullName("Haung Jinx")
      console.log(JSON.stringify(person, null, 4))
      await person.remove()
      await connection.close()

  }catch(error){
  consle.log(error.message)
  }
  })

- writing middleware function mongoose prehooks, posthooks
- document middleware, model middleware, aggrgate middleware, query middleware

  const UsrSchm = new Schema({
  firstName: String,
  lastName: String,
  fullName: String
  age: Number,
  likes: [String]
  })
  UsrSchm.pre("save", async function preSave(){
  this.fullName = `${this.firstName} ${this.lastName}`
  })
  UsrSchm.post("save", async function postSave(doc){

  console.log("ew User created:", doc.fullName)

  })
  const User = mongoose.model("User", UsrSchm)

// async function const user = new User({
firstName: String,
lastName: String,
})
await user.save()

Document middleware
Model middleware
Query middleware

- mongoose
- in document middleware functions this refer to document, builtin methods, define hooks for them: init , validate, save, remove

const mongoose = require("mongoose")
const {connection, Schema} = mongoose
mongoose.connect("mongodb://localhost:27017/test").catch(console.error)

const UsrSchm = new Schema({
firstName: {type: String, required: true},
lastName: {type: String, required: true},

})

UsrSchm.pre("init", async function preInit(){
console.log("A document wws going to be initialized")
})
UsrSchm.post("init", async function postInit(){
console.log("A document wws initialized")
})

UsrSchm.pre("validate", async function preValidate(){
console.log("A document wws going to be validateed")
})
UsrSchm.post("validate", async function postValidate(){
console.log("A document wws validateed")
})

UsrSchm.pre("save", async function preSave(){
console.log("A document wws going to be saved")
})
UsrSchm.post("save", async function postSave(){
console.log("A document wws saved")
})

UsrSchm.pre("remove", async function preRemove(){
console.log("A document wws going to be removed")
})
UsrSchm.post("remove", async function postRemove(){
console.log("A document wws removed")
})

const User = mongoose.model("User", UsrSchm)

connection.once("connected", async ()=>{
try{
const user = new User({
firstName: "John",
lastName: "smith",
})
await user.save()
await User.findById(user.id)
await user.remove()
await connection.close()
} catch(error){
await connection.close()
console.dir(error.message, {colors: true})
throw new Error("Doc")
}
})
Query middleware this refer query object, supported only in model and query functions

- count, find, findOne, findOneAndRemove, findOneAndUpdate, update
- query middleware functions

  const mongoose = require("mongoose")
  const {connection, Schema} = mongoose
  mongoose.connect("mongodb://localhost:27017/test").catch(console.error)
  const UsrSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},

})
UsrSchema.pre("count", async function preCount(){
console.log("preparing to count document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.post("count", async function postCount(){
console.log("counted to ${count} document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.pre("find", async function preFind(){
console.log("preparing to count document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.post("find", async function postFind(docs){
console.log("counted to ${docs.count} document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.pre("findOne", async function preFOne(){
console.log("preparing to count document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.post("findOne", async function postFOne(docs){
console.log("counted to ${docs.count} document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.pre("update", async function preUpdate(){
console.log("preparing to count document with this criteria: ${JSON.stringify(this.\_conditions)}")
})
UsrSchema.post("update", async function postUpdate(docs){
console.log("counted to ${docs.count} document with this criteria: ${JSON.stringify(this.\_conditions)}")
})

const User = mongoose.model("User", UsrSchema)

connection.once("connected", async ()=>{
try{
const user = new User({
firstName: "John",
lastName: "Smith"
})
await user.save()
await User.where("frstName").equals("John").update({lastName: "Anderson"})
await User.findOne().select(["firstName"]).where("firstName").equals("John")
await User.find().where("firstName").equals("John")
await User.where("firstName").equals("John").count()
await user.remove()
}catch(error){
console.dir(error, {colors: true})
}finally{
await connection.close()
}
})

- model middleware functions

  const mongoose = require("mongoose")
  const {connection, Schema} = mongoose
  mongoose.connect("mongodb://localhost:27017/test").catch(console.error)
  const UsrSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  })
  UsrSchema.pre("insertMany", async function prMany(){
  console.log("Preparing docs...")
  })
  UsrSchema.post("insertMany", async function psMany(){
  console.log("Preparing docs...")
  })

const User = mongoose.model("User", UsrSchema)
connection.once("connected", async ()=>{
try{
await User.insertMany([{firstName: "Leo", lastName: "Smith"}, {firstName: "Neo", lastName: "Jackson"}])
}catch(error){
console.dir(error, {colors: true})
}finally{
await connection.close()
}
})

- - # writing custom validators for mongoose schema
    const mongoose = require("mongoose")
    const {connection, Schema} = mongoose
    mongoose.connect("mongodb://localhost:27017/test").catch(console.error)

const UsrSchema = new Schema({
username: {
type: String,
minlength: 6,
maxlength: 20,
required: [true, "user is required"],
validate: {message: `{value} is not valid username`}
validator: (val)=> /^[a-zA-Z]+$/.test(val)
}

const User = mongoose.model("User",UsrSchema )

connection.once("connected", async ()=>{
try{
const user = new User()
let errors = null
errors = user.validateSync()
console.dir(errors.errors["username"].message)
}catch(error){
console.dir(error, {colors: true})
}finally{await connection.close()}
})

- building restful api to manage users with express and mongoose
  ///

- body-parser, connect-mongo, express, express-session, mongoose, node-fetch
  // 2 middleware functions , one to configure session, other connecting mongodb before mount api routes
  const mongoose = require("mongoose")
  const express = require("express")
  const session = require("express-session")
  const bodyParser = require("body-parser")  
   const MongoStore = require("connect-mongo")(session)
  const api = require("./api/controller")
  const app = express()
  const db = mongoose.connect("mongodb://localhost:27017/test").then(conn=>conn).catch(console.error)

      // use body-parser to parse req body as json middlewware
      app.use(bodyParser.json())

      // define express middlewae ensure web apps connected to mongodb first before allowing next routes handler
      app.use((req, res, next)=>{
        Promise.resolve(db).then(
          (connection, err) => (typeof connection !== "undefined") ? next() : next(new Error("MongoError"))
        )
      })

      // configure express-session middleware to store sessions in mongo database
      app.use(session({
        secret: "Mern CookBookSecret",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
          collection: "sessions",
          mongooseConnection: mongoose.connection
        })
      }))

      // mount api controller to api routes
      app.use("/users", api)

      // listen on port
      app.listen(4000, ()=>console.log("web"))

      //create new directory nammed api, next create bussiness logic, define schema for users with static and instance methods that allow useers to signup, login, logout, get profile data, change thier password, remove profile

      //creat model.js in api directory - npm crypto
      const {connection, Schema} = require("mongoose")
      const crypto = require("crypto")

      // define Schema
      const UserSchema = new Schema({
        username: {
          type: String,
          minlength: 4,
          maxlength: 20,
          required: [true, "username field is required"],
          validate: {
            validator: function (value){
              return /^[a-zA-Z]+$/.test(value)
            },
            message: '{VALUE} is not valid username'
          },
        },
        password: String
      })

  // define static model method for login
  UserSchema.static("login", async function(usr, pwd){
  const hash = crypto.createHash("sha256").update(String(pwd))
  const user = await this.findOne().where("username").equals(usr).where("password").equals(hash.digest("hex"))
  if(!user) throw new Error("Incorrect credentials")
  delete user.password
  return user
  })

// define static model method for signup
UserSchema.static("signup", async function(usr, pwd){
if(pwd.length < 6) throw new Error("Pwd must be more than 6 chars")
const hash = crypto.createHash("sha256").update(pwd)
const exist = await this.findOne().where("username").equals(usr)
if(exist) throw new Error("username a;ready exists")
const user = this.create({
username: usr,
pasword: hash.digest("hex"),
})
return user
})

// define document instance method for changePass
UserSchema.method("changePass", async function(pwd){
if(pwd.length < 6) throw new Error("PWD have more 6")
const hash = crypto.createHash("sha256").update(pwd)
this.password = hash.digest("hex")
return this.save()
})

// compile mongoose schema into model and export
module.exports = connection.model("User", UserSchema)

//finally define controllerthat transform req body to actions that model can understand, export it as express router that contain all API
//create controller.js in api folder
// import model js
const express = require("express")
const User = require("./model")
const api = express.Router()
// define router handler for user login and another for not logged in
const isLogged = ({session}, res, next) =>{
if(!session.user) res.status(403).json({
status: "You are not logged in!!"
})else next()
}
const isNotLogged = ({session}, res, next) =>{
if(session.user) res.status(403).json({
status: "You are logged in already"
}) else next()
}

// define post req method to handle req to login endpoint
api.post("/login", isNotLogged, async (req, res)=>{
try{
const {session, body} = req
const {username, password} = body
const user = await User.login(username, password)
session.user = {
\_id: user.\_id,
username: user.username,
}
session.save(() => {
res.status(200).json({
status: "Welcome"
})
})
}catch(error){
res.status(403).json({error: error.message})
}
})

// define a post req /logout
api.post("/logout", isLogged, (req, res)=>{
req.session.destroy()
res.status(200).send({status: "Bye bye!!!"})
})

//post req method to handle singup
api.post("/signup", async(req, res)=>{
try{
const {session, body} = req
const {username, password} = body
const user = await User.signup(username, password)
res.status(201).json({status: "created!"})

}catch(error){
res.status(403).json({error: error.message})
}
})

//define get req method to handle /profile
api.get("/profile", isLogged, (req, res)=>{
const {user} = req.session
res.staus(200).json({user})
})

// define put req method to handle /changepass
api.put("/changepass", isLogged, async (req, res)=>{
try{

const {session, body} = req
const {password} = body
const {\_id} = session.user

const user = await User.findOne({\_id})
if (user){
user.changePass(password)
res.status(200).json({status: "Pwd changed"})
}else{
res.status(403).json({status: user})
}

}catch(error){
res.status(403).json({error: error.message})
}
})

// define delete req method to handle /delete
api.delete("/delete", isLogged, async (req, res)=>{
try{

const {\_id} = req.session.user

const user = await User.findOne({\_id})
await user.remove()
req.session.destroy((err)=>{
if(err) throw new Error(err)
res.status(200).json({status: "Deleted"})
})

}catch(error){
res.status(403).json({error: error.message})
}
})

//export route
module.exports = api

// test it built nodejs repl and client api

- node-fetch, repl, util, vm

//move to root of project create client-repl.js
const repl = require("repl")
const util = require("util")
const vm = require("vm")
const fetch = reqiure("node-fetch")
const {Headers} = fetch

// define var that will later contain session id from cookie once user is logged in, the cookie will be used
to allow server logged in user

let cookie = null

// define helper function named query to make http req to server, credentials optipon allows to send and recieve cookies from and to server
define headers to tell server content type of req body be sent as json content
const query = (path, ops) => {
return fetch(`http://localhost:1337/users/${path}`, {method: ops.method, body: ops.body, credentials: "include", body: JSON.stringify(ops.body), headers: new Headers({...(ops.headers || {}), cookie, Accept: "application/json", "Content-Type": "application/json",}), }).then(
async (r) => {
cookie = r.headers.get("set-cookie") || cookie
return { data: await r.json(), status: r.status, }
}
).catch(error=> error)
}

// define method to signup
const signup = (username, password) => query("/signup", {method: "POST", body: {username, password}, })

// define method to login
const login = (username, password) => query("/login", {method: "POST", body: {username, password}, })

// define method to logout
const logout = () => query("/logout", {method: "POST", })

// define method to get profile
const getProfile = () => query("/profile", {method: "GET", })

// define method to change password
const changePassword = (password) => query("/changepass", {method: "PUT", body: { password}, })

// define method to deleteProfile
const deleteProfile = () => query("/delete", {method: "DELETE", })

const replServer = repl.start({
prompt: ">>",
ignoreUndefined: true,
async eval(cmd, context, filename, callback){
const script = new vm.Script(cmd)
const is_raw = process.stdin.isRaw
process.stdin.setRawMode(false)
try{
const res = await Promise.resolve(
script.runInContext(context, {
displayErrors: false,
breakOnSigint: true,
})
)
callback(null, res)
}catch(error){
callback(error)
}finally{
process.stdin.setRawMode(is_raw)
}
},
writer(output){
return util.inspect(output, {breakLength: process.stdout.columns, colors: true, compact: false})
}
})

replServer.context.api = {
signup, login, logout, getProfile, changePassword, deleteProfile,
}

// execute api.signup("John", "zchvmn")
api.login("John", "zchvmn")
api.getProfile()
api.changePassword("newPWD")
api.logout()
api.login("John", "newPWD")

///

- body-parser, connect-mongo, express, express-session, mongoose, node-fetch

- real time communication with socket.io and express

///

- understand nodejs events
- understand socket.IO events
- working with socket.IO namespaces
- defining and joining to Socket.IO rooms
- writing middlewares for Socket.IO
- integrating Socket.IO with expressjs
- using expressjs middleware in Socket.io
  // html5 websocket protocol, uses single tcp connection kept ope even client and server not communicating, connections between
  client and server exists everytime
- chat application to multi user game
- nodejs event driven architecture, EventEmitter, tha allows listenres to subscribe to certain named events that triggered later by emitter
  const EventEmitter = require("events")
  const emitter = new EventEmitter()
  emitter.on("welcome", ()=>{
  console.log("Welcome")
  })
  // can trigger by emiter
  emitter.emit("welcome")
  // create new project np init
  // class extends EventEmitter and two instance methods start, stop, when start method called trigger all listners attached to start event
  keep starting time using process.hrtime, when stop called trigger all listner attached to stop event
  // create timer.js
  const EventEmitter = require("events")
  // define two contants use to convert returned value of process.hrtime from sec to nanosecond to millisecond
  const NS_PER_SEC = 1e9
  const NS_PER_MS = 1e6

// timer with two instance methods
class Timer extends EventEmitter {
start(){
this.startTime = process.hrtime()
this.emit("start")
stop(){
const diff = process.hrtime(this.startTime)
this.emit("stop", (diff[0]\*NS_PER_SEC+diff[1]) / NS_PER_MS,)
}  
 }
}

// create instance of timer
const tasks = new Timer()

// attach event listner to start event
tasks.on("start", ()=>{
let res = 1
for(let i = 1; i < 100000; i++){
res \*= i
}
tasks.stop()
})

attach eventListne to stop event
timer.on("stop", (time)=>{
console.log(`Task completed in ${time} ms`)
})

tasks.start()

// synchronous

const EventEmitter = require("events")
const events = new EventEmitter()
events.on("print", ()=> console.log("1"))
events.on("print", ()=> console.log("2"))
events.on("print", ()=> console.log("3"))
events.emit("print")

//Asynchronous

const EventEmitter = require("events")
const events = new EventEmitter()
events.on("print", ()=> console.log("1"))
events.on("print", async ()=> await Promise.resolve("2"))
events.on("print", ()=> console.log("3"))
events.emit("print")
//
const EventEmitter = require("events")
class MyEvents extends EventEmitter{
start(){
return this.listeners("logme").reduce( (promise, nextEvt) => promise.then(nextEvt), Promise.resolve(), )
}
}
const event = new MyEvents()
event.on("logme", ()=> console.log("1"))
event.on("logme", async ()=> await Promise.resolve("2"))
event.on("logme", ()=> console.log("3"))
event.start()

io.on("connection", (socket) => {
console.log("A new client is connected")
})

io.of("/").on("connection", (socket) => {
console.log("A new client is connected")
})

socket.on("disconnecting", (reason) => {
console.log("Disconnecting because ", reason)
})

socket.on("disconnect", (reason) => {
console.log("Disconnected because ", reason)
})

socket.on("error", (error) => {
console.log("Oh! no ", error.message)
})

// client
clientSocket.on("connect", ()=>{
console.log("Successfully connected")
})
clientSocket.on("connect_error", (error)=>{
console.log("connection error", error)
})
clientSocket.on("connect_timeout", (timeout)=>{
console.log("connect attempt timed out after", timeout)
})
clientSocket.on("disconnect", (reason)=>{
console.log("disconnected because", reason)
})
clientSocket.on("reconnect", (n)=>{
console.log("Reconnected after", n, 'attempt(s')
})
clientSocket.on("reconnect_attempt", (n)=>{
console.log("Trying to reconnect again", n, 'attempt(s'))
})
clientSocket.on("reconnect_error", (error)=>{
console.log("Oh no could'nt reconnect", error)
})
clientSocket.on("reconnect_failed", (n)=>{
console.log("could'nt reconnected after", n, 'attempt(s'))
})
clientSocket.on("ping", ()=>{
console.log("checking if server is alive")
})
clientSocket.on("pong", (latency)=>{
console.log("server responded after", latency, 'm(s'))
})
clientSocket.on("error", (error)=>{
console.log("Oh no", error.message)
})

- socket.io
  // create new file simple-io-server.js
  const io = require("socket.io")()

//define url path
io.path("/socket.io")
const root = io.of("/")
root.on("connection", socket => {
let counter = 0
socket.on("time", ()=>{
const currentTime = new Date().toTimeString()
counter +=1
socket.emit("got time?", currentTime, counter)
})
})
io.listen(1337)

// simple-io-client.js
const io = require("socket.io-client")
const clientSocket = io("http://localhost:1337", {path: "/socket.io"})
clientSocket.on("connect", ()=>{
for(let i = 1; i <= 5; i++) clientSocket.emit("time")
})
clientSocket.on("got time?", (time, counter)=> {
console.log(counter, time)
})

const http = require("http")
const fs = require("fs")
const path = require("path")
const io = require("socket.io")

const app = http.createServer((req, res)=>{
if(req.url === "/"){
fs.readFile(path.resolve(\_\_dirname, "nsp-client.html"), (err, data)=>{
if(err){
res.writeHead(500)
return void res.end()
}
res.writeHead(200)
res.end(data)
})

}else{
res.writeHead(403)
res.end()
}
})

io.path("/socket.io")
io.of("/en").on("connection", (socket) => {
socket.on("getData", ()=>{
socket.emit("data", {
title: "English Page",
msg: "Welcome to my website"
})
})
})

io.of("/es").on("connection", (socket) => {
socket.on("getData", ()=>{
socket.emit("data", {
title: "Pa`gina en Espanol",
msg: "Bienvenido a mi sitio Web"
})
})
})

io.attach(app.listen(1337, ()=>{
console.log("serve")
}))
// create nsp-client.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Socket IO Client</title>
  <head>
  <body>
    <!-- code here -->
    <h1 id="title"></h1>
    <section id="msg"></section>
    <button id="toggleLang">Get Content in spanish</button>
    <script>socket.io.js</script>
    <script>babel.js</script>
    <script>
      const title = document.getElementById("title")
      const msg = document.getElementById("msg")
      const btn = document.getElementById("toggleLang")
const manager = new io.Manager("http://localhost:1337", {path: "/socket.io"})
const socket = manager.socket("/en") //"/es"
socket.on("connect", ()=>{
  socket.emit("getData")
})
socket.on("data", data => {
  title.textConnect = data.title
  msg.textConnect = data.msg
})

btn.addEventListner("click", event=>{
socket.nsp = socket.nsp === "/en" ? "/es": "/en"
btn.textContent = socket.nsp === "/en" ? "Get Content in spanish":"Get Content in english"
socket.close()
socket.open()
})

    </script>

  </body>
</html>

- express, socket.io

///

- managing state with redux
  const a = 5;
  const b = 10;
  const c = [a, b].reduce((accumlator, value)=>{
  return accumlator+value
  }, 0)

  const action = {
  type: "INCREMENT_COUNTER",
  }
  // action creators
  const increment = (incrementBy) => ({
  type: "INCREMENT_COUNTER",
  incrementBy
  })
  const decrement = (decrementBy) => ({
  type: "DECREMENT_COUNTER",
  decrementBy
  })

  const reduced = [
  increment(10), decrement(5), increment(3)
  ].reduce((accu, action)=>{
  switch (action.type){
  case INCREMENT_COUNTER:
  return accumulator + action.incrementBy
  case DECREMENT_COUNTER:
  return accumulator - action.decrementBy
  default:
  return accu
  }
  })
  console.log(reduced)

  - devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom

- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }

- lifecycleTimes components, constructor(props) -initialize intial state
- static getDerivedStateFromProps(nextProps, nextState) - merge propos with state
- componentDidMount, sertInterval
- shouldComponentUpdate(nextProps, nextState)
- componentDidUpdate(prevProps, preState, snapshot)
- getSnapshotBeforeUpdate(prevProps, preState)
- componentWillUnmount()

-
- index.html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Life Cycle Methods</title>
    </head>
    <body>
      <div role="main"></main>
      <script src="./stateful-react.js"></script>
    </body>
  </html>
  import * as React from "react"
  import * as ReactDOM from "react-dom"

  class LifeCycleTime extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  time: new Date().toTimeString(),
  color: null,
  dontUpdate: false,
  }
  }

  static getDerivedStateFromProps(nextProps, prevState){
  return nextProps
  }

  componentDidMount(){
  this.intervalId = setInterval(()=>{
  this.setState({
  time: new Date().toTimeString()
  })
  }, 100)
  }

  componentWillUnmount(){
  clearInterval(this.intervalId)
  }

  shouldComponentUpdate(nextProps, nextState){
  if (nextState.dontUpdate){
  return false
  }
  return true
  }

  getSnapshotBeforeUpdate(prevProps, prevState){
  return "snapshot befre update"
  }

  componentDidUpdate(prevProps, prevState, snapshot){
  console.log("Component did update and recieved snapshot", snapshot)
  }

  render(){
  return (
  <span style={{color: this.state.color}}>
  {this.state.time}
  </span>
  )
  }

}

- class App extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  color: "red",
  dontUpdate: false,
  unmount: false
  }
  this.toggleColor = this.toggleColor.bind(this)
  this.toggleUpdate = this.toggleUpdate.bind(this)
  this.toggleUnmount = this.toggleUnmount.bind(this)
  }
  toggleColor(){
  this.setState((prevState)=>({
  color: prevState.color === "red"? "Blue" : "red"
  }))

  }
  toggleUpdate(){
  this.setState((prevState)=>({
  dontUpdate: ! prevState.dontUpdate

  }))
  }
  toggleUnmount(){
  this.setState((prevState)=>({
  unmount: ! prevState.unmount
  }

  render(){
  const {
  color,
  dontUpdate,
  unmount,
  } = this.state
  return (
  <React.Fragment>
  {unmount === false && <LifeCycleTime color={color} dontUpdate={dontUpdate} /> }
  <button> Toggle color {JSON.stringify({color})} </button>
  <button> Should update? {JSON.stringify({dontUpdate})} </button>
  <button> Should unmount? {JSON.stringify({unmount})} </button>
  </React.Fragment>
  )
  }

  }

// render
ReactDom.render(
<App />,
document.querySelector('[role="main"]')
)

- React.PureComponent
- shouildComponentUpdate in React.Coonent, lifecycle internally make shallow compearison of state and props
- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>React PureComponent</title>
    </head>
    <body>
      <div role="main"></main>
      <script src="./pureComponent-react.js"></script>
    </body>
  </html>

  import _ as React from "react"
  import _ as ReactDOM from "react-dom"
  class Button extends React.PureComponent{
  componentDidUpdate(){
  console.log("button component did update")
  }
  render(){
  return <button>{this.props.children}</button>
  }
  }
  class Text extends React.Component{
  componentDidUpdate(){
  console.log("text component did update")
  }
  render(){
  return this.props.children
  }
  }
  class App extends React.Component{
  state={
  counter = 0,
  }
  componentDidMount(){
  this.intervalId = setInterval(()=>{
  this.setState(({counter}) => ({
  counter: counter+1,
  }))
  }, 1000)
  }
  componentWillUnmount(){
  clearInterval(this.intervalId)
  }
  render(){
  const {counter} = this.state
  return (
  <React.Fragment>
  <h1>Counter : {counter}</h1>
  <Text>I'm Just a Text</Text>
  <Button>I'am button</Button>
  </React.Fragment>
  )
  }

  }

  ReactDom.render(
  <App />,
  document.querySelector('[role="main"]')
  )

  - React Event handlers

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>React Event Handlers</title>
    </head>
    <body>
      <div role="main"></main>
      <script src="./event-react.js"></script>
    </body>
  </html>

  import _ as React from "react"
  import _ as ReactDOM from "react-dom"

  class App extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  title: "Untitled"
  }
  this.onBtnClick = this.onBtnClick.bind(this)
  }

  onBtnClick(){
  this.setState(
  {
  title: "Hello there"
  }
  )
  }

  render(){
  return (
  <section>
  <h1>{this.state.title}</h1>
  <button onClick={this.onBtnClick}>
  Click me to change title
  </button>
  </section>
  )
  }

  }
  ReactDOM.render(
  <App />,
  document.querySelector('[role="main"]')
  )

  // conditional rendering of components

  const Meal = ({timeOfDay}) => (
  <span> {timeOfDay === "noon" ? "Pizza" : "Sandwich"} </span>
  )

  const Meal = ({timeOfDay}) => (
  <span children={timeOfDay === "noon" ? "Pizza" : "Sandwich"} />
  )

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Conditional rendering</title>
    </head>
    <body>
      <div role="main"></main>
      <script src="./condition-react.js"></script>
    </body>
  </html>

  import _ as React from "react"
  import _ as ReactDOM from "react-dom"

  const Toggle = ({condition, children}) => (
  ccondition ? children[0] : children[1]
  )

  class App extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  color: "blue",
  }
  this.onClick = this.onClick.bind(this)
  }
  onClick(){
  this.setState(({color}) => ({
  color: (color === "blue") ? "lime" : "blue"
  }))
  }

  render(){
  const {color} = this.state
  return (
  <React.Fragment>
  <Toggle condition={color==="blue"}>
  <p style={{color}}>Blue!</p>
  <p style={{color}}>Lime!</p>
  </Toggle>
  <button onClick={this.onClick}>
  Toggle Colors
  </button>
  </React.Fragment>
  )
  }

  }

  ReactDOM.render(
  <App />,
  document.querySelector('[role="main"]')
  )

  - <ul>
      {[
        <li key={0}>One</li>,
        <li key={1}>Two</li>,
      ]}
    </ul>

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Rendering Lists</title>
      </head>
      <body>
        <div role="main"></main>
        <script src="./Lists-react.js"></script>
      </body>
    </html>

  import _ as React from "react"
  import _ as ReactDOM from "react-dom"

  const MapArray = ({
  from,
  mapToProps,
  children: Child,
  }) => (
  <React.Fragment>
  {from.map((item)=>(<Child {...mapToProps(item)} />))}
  </React.Fragment>
  )

  const TodoItem = ({done, label}) => (
    <li>
      <input type="checkbox" checked={done} readOnly />
      <label>{label}</label>
    </li>
  )

  const list = [
  {id: 1, done: true, title: "Study for Chinese Exam"},
  {id: 2, done: false, title: "Take a Shower"},
  {id: 3, done: true, title: "Finish the work"},
  ]

  const mapToProps = ({id: key, done, title: label}) => ({
  key,
  done,
  label
  })

  const TodoListApp = ({items}) => (
    <ol>
      <MapArray from={list} mapToProps={mapToProps}>
      {TodoItem}
      </MapArray>
    </ol>
  )

  ReactDom.render(<TodoListApp items={list}/>, document.querySelector('[role="main"]'))

- working with forms and inputs in react

- start: "parcel serve -p 1337 index.html"

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
    <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Forms and inputs</title>
        </head>
        <body>
          <div role="main"></main>
          <script src="./forms-react.js"></script>
        </body>
      </html>

  import _\*_ as React from "react"
  import _\*_ as ReactDOM from "react-dom"

  class LoginForm extends React.Component{

      constructor(props){

  super(props)
  this.state = {
  username: "",
  password: "",
  }
  this.onChange = this.onChange.bind(this)
  }
  onChange(event){
  const {name, value} = event.target
  this.setState({
  [name] : name === "username" ? value.replace(/d/gi, "") : value
  })
  }
  render(){
  return (
  <form>
  <input type="text" name="username" placeholder="UserName" value={this.state.username} onChange={this.onChange} />
  <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
  <pre>{JSON.stringify(this.state, null, 2)}</pre>
  </form>
  )
  }
  }
  ReactDOM.render(<LoginForm />, document.querySelector('[role="main"]'))

// understanding refs and to use them

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
    <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Refs</title>
        </head>
        <body>
          <div role="main"></main>
          <script src="./refs-react.js"></script>
        </body>
      </html>

  import _\*_ as React from "react"
  import _\*_ as ReactDOM from "react-dom"

  class LoginForm extends React.Component{
  refForm = React.createRef()
  constructor(props){
  super(props)
  this.state = {}
  this.onSubmit = this.onSubmit.bind(this)
  this.onClick = this.onClick.bind(this)
  }
  onSubmit(event){
  event.preventDefault()
  const form = this.refForm.current
  const data = new FormData(form)
  this.setState({
  user: data.get("user"),
  pass: data.get("pass")
  })
  }
  onClick(event){
  const form = this.refForm.current
  form.dispatchEvent(new Event("submit"))
  }
  render(){
  const {onSubmit, onClick, refForm, state} = this
  return (
  <React.Fragment>
  <form onSubmit={onSubmit} ref={refForm}>
  <input type="text" name="user"/>
  <input type="text" name="pass" />
  </form>
  <button onClick={onClick}>LogIn</button>
  <pre>{JSON.stringify(state, null, 2)}</pre>
  </React.Fragment>
  )
  }

  }
  ReactDOM.render(<LoginForm />, document.querySelector('[role="main"]'))

- understanding react portals

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
    <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Portals</title>
        </head>
        <body>
          <div role="main"></main>
          <script src="./portals-react.js"></script>
        </body>
      </html>

  import _\*_ as React from "react"
  import _\*_ as ReactDOM from "react-dom"

  const Header = () => ReactDOM.createPortal(
    <h1>React Portal </h1>,
    document.querySelector('[id="heading"]')
  )

  const App = () => (
  <React.Fragment>
    <p>Hello World!</p>
    <Header />
    </React.Fragment>
  )

  ReactDom.render(<App />, document.querySelector('[role="main"]'))

  - catching errors with errorBoundry

- implements component did catch to catch errors in children, they catch errors in constructor, errors cannot be caugt are asynchronous code, event handlers and errors, error and objectc stacked

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
    <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>catching errors</title>
        </head>
        <body>
          <div role="main"></main>
          <script src="./error-boundry-react.js"></script>
        </body>
      </html>

      // create error-boundry.js

  import _\*_ as React from "react"
  import _\*_ as ReactDOM from "react-dom"

  class ErrorBoundry extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  hasError: false,
  message: null,
  where: null
  }
  }
  coponentDidCatch(error, info){
  this.setState({
  hasError: true,
  message: error.message,
  where: info.componentStack
  })
  }
  render(){
  const {hasError, message, where} = this.state
  return (hasError ? <details style={{whiteSpace: "pre-wrap"}}>
  <summary>{message}</summary>
  <p>{where}</p>
  </details> : this.props.children)
  }
  }

  class App extends React.Component{
  constructor(props){
  super(props)
  this.onClick = this.onClick.bind(this)
  }
  onClick(){
  this.setState(()=>{
  throw new Error("Error while sending state")
  })
  }
  render(){
  return(<button onClick={this.onClick}>Buggy Button </button>)
  }
  }

ReactDom.render(<ErrorBoundry><App /><ErrorBoundry>, document.querySelector('[role="main"]'))

- checking properties with PropTypes
- static propTypes prooperties
  class MyComponent extends React.Component{
  static propTypes = {
  children: propTypes.string.isRequired
  }
  render(){
  return <span>{this.props.children}</span>
  }
  }

- devdependcies: babel-plugin-transform-class-properties, babel-preset-env, babel-preset-react, babel-core, parcel-bundler, react, react-dom
- .babelrc
  {
  "presets" : ["env", "react"],
  "plugins": ["transform-class-properties"]
  }
- index.html
    <!DOCTYPE html>

      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Type Checking</title>
        </head>
        <body>
          <div role="main"></main>
          <script src="./type-checking-react.js"></script>
        </body>
      </html>

      // create error-boundry.js

  import _\*_ as React from "react"
  import _\*_ as ReactDOM from "react-dom"
  import _\*_ as propTypes from "prop-types"

  class Toggle extends React.Component{
  static propTypes = {
  condition: propTypes.any.isRequired,
  children: (props, propName, componentName) => {
  const customPropTypes = {
  children: propTypes.arrayOf(propTypes.element).isRequired
  }
  const isArrayOfElements = propTypes.checkPropTypes(customPropTypes, props, propName, componentName)
  const children = props[propName]
  const count = React.Children.count(children)
  if(isArrayOfElements instanceof Error) return isArrayOfElements
  else if(count !== 2){
  return new Error(` ${componentName} expected ${propName} to contain exactly 2 react elements `)
  }
  }
  render(){
  const {condition, children } = this.props
  return condition? children[0]: children[1]
  }
  }

  }

  class App extends React.Component{
  constructor(props){
  super(props)
  this.state = {
  value: false
  }
  this.onClick = this.onClick.bind(this)
  }
  onClick(){
  this.setState(({value})=> ({
  value: !value
  }))
  }
  render(){
  const value = this.state
  return(
  <React.Fragment>
  <Toggle condition={value}>
  <p style={{color: "blue"}}>BLUE</p>
  <p style={{color: "lime"}}>LIME</p>
  <p style={{color: "pink"}}>PINK</p>
  <Toggle>
  <button onClick = {this.onClick}>
  Toggle Colors
  <button>
  </React.Fragment>
  )
  }
  }
