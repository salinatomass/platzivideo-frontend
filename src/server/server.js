import express from 'express'
import dotenv from 'dotenv'
import webpack from 'webpack'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from '../frontend/app/moviesReducer'
import initialState from '../frontend/initialState'
import ServerApp from '../frontend/routes/ServerApp'

dotenv.config()

const { ENV, PORT } = process.env
const app = express()

if (ENV === 'development') {
  console.log('Development config')
  const webpackConfig = require('../../webpack.ssr.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(webpackConfig)
  const serverConfig = { publicPath: '/', serverSideRender: true }

  app.use(webpackDevMiddleware(compiler, serverConfig))
  app.use(webpackHotMiddleware(compiler))
}

const setResponse = (html, preloadedState) => {
  return (`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Platzi Video</title>
        <link rel="stylesheet" href="/assets/app.css" type="text/css">
        </head>
        <body>
        <div id="app">${html}</div>
        <script id="preloadedState">
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/assets/app.js" type="text/javascript"></script>
      </body>
    </html>
  `)
}

const renderApp = (req, res) => {
  const store = configureStore({
    reducer: moviesReducer,
    preloadedState: initialState
  })

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <ServerApp />
      </StaticRouter>
    </Provider>
  )

  const preloadedState = store.getState()

  res.send(setResponse(html, preloadedState))
}

app.get('*', renderApp)

app.listen(PORT, (err) => {
  if (err) console.log(err)
  else console.log(`Server running on port ${PORT}`)
})
