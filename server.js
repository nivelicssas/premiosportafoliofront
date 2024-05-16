const express = require('express')
const fileupload = require('express-fileupload')
const next = require('next')
const routes = require('./routes')
const cors = require('cors')
const compression = require('compression')
const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3050
const app = next({ dev, hostname, port })
const bodyParser = require('body-parser')
const handle = routes.getRequestHandler(app)
const { join } = require('path')

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(compression())
    server.use(cors())
    server.use(bodyParser.json())
    server.use('/', express.static('public'))

    // Implementacion de CORS para la realizacion de request a servicios externos
    // Configuraciones del fileUpload
    server.use(
      fileupload({
        createParentPath: true,
      })
    )
    // CORS middleware
    server.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
      next()
    })
    // Make express responds to all NextJS routes
    server.get('/', cors(), (req, res) => {
      return handle(req, res)
    })

    server.get('*', cors(), (req, res) => {
      if (req.url.includes('/sw')) {
        const filePath = join(__dirname, 'static', 'sw.js')
        app.serveStatic(req, res, filePath)
      } else {
        handle(req, res, req.url)
      }
    })
    // Intercept the login post to store the HTTPS Cookie by the change
    // of the domain
    server.post('/api/login', async (req, res) => {
      try {
        const response = await fetch(
          `${process.env.BASE_DOMAIN}/user/login?_format=json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
          }
        )
        const cookie = response.headers
          .get('set-cookie')
          .replace(
            `${process.env.BACKEND_DOMAIN.replace('https://', '')}`,
            `${process.env.BASE_DOMAIN.replace('https://', '')}`
          )
        const data = await response.json()
        res.setHeader('Set-Cookie', cookie)
        return res.status(200).json(data)
      } catch (error) {
        return res.status(500).json({ error: error.message })
      }
    })
    // Intercept the profile post to send the HTTPS Cookie
    server.post('/api/profile', async (req, res) => {
      const { uid, token } = req.body
      try {
        const response = await fetch(
          `${process.env.BASE_DOMAIN}/user/${uid}?_format=json`,
          {
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
              Cookie: req.headers.cookie,
            },
          }
        )
        const data = await response.json()
        return res.status(200).json(data)
      } catch (error) {
        console.log('🚀 ~ error:', error)
        return res.status(500).json({ error: error.message })
      }
    })

    // Intercepto del post a upload-file para la carga de archivos
    server.post('/upload-file', async (req, res) => {
      try {
        if (!req.files) {
          res.send({
            status: 'failed',
            message: 'No file uploaded',
          })
        } else {
          const file = req.files.file
          const fileName = req.body.name.replace(/ /g, '_')

          file.mv('./public/static/assets/backend/private/' + fileName)

          res.send({
            status: 'success',
            message: 'File is uploaded',
            data: {
              name: fileName,
              mimetype: file.mimetype,
              size: file.size,
            },
          })
        }
      } catch (err) {
        res.status(500).send(err)
      }
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(
        `[${new Date()}] =>`,
        `Ready on http://localhost:${port} > ENV ${process.env.NODE_ENV}`
      )
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
