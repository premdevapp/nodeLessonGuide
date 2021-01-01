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
