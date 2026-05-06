function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/$/, '')
}

function getSavedBackendUrl() {
  const v = localStorage.getItem('backendUrl')
  return v ? normalizeBaseUrl(v) : ''
}

function getBackendUrl() {
  const fromServer = normalizeBaseUrl(window.__BACKEND_URL__)
  const fromStorage = getSavedBackendUrl()
  return fromStorage || fromServer
}

function setBackendUrl(url) {
  const v = normalizeBaseUrl(url)
  localStorage.setItem('backendUrl', v)
  return v
}

function swaggerJsonUrl(baseUrl) {
  return `${normalizeBaseUrl(baseUrl)}/swagger/v1/swagger.json`
}

function backendSwaggerUiUrl(baseUrl) {
  return `${normalizeBaseUrl(baseUrl)}/swagger/index.html`
}

function mountSwagger(baseUrl) {
  const url = swaggerJsonUrl(baseUrl)

  const el = document.getElementById('swagger-ui')
  el.innerHTML = ''

  // global: SwaggerUIBundle, SwaggerUIStandalonePreset
  window.ui = SwaggerUIBundle({
    url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'BaseLayout',
    requestInterceptor: (req) => {
      // Railway/ASP.NET a veces requiere explicit Accept
      req.headers = req.headers || {}
      req.headers['Accept'] = req.headers['Accept'] || 'application/json'
      return req
    },
  })
}

function setActiveRoute(route) {
  const routes = ['dashboard', 'api', 'settings', 'inicio']
  const effective = routes.includes(route) ? route : 'dashboard'

  document.getElementById('page-dashboard').hidden = effective !== 'dashboard'
  document.getElementById('page-api').hidden = effective !== 'api'
  document.getElementById('page-settings').hidden = effective !== 'settings'
  document.getElementById('page-inicio').hidden = effective !== 'inicio'

  const title = document.getElementById('pageTitle')
  const subtitle = document.getElementById('pageSubtitle')
  if (effective === 'dashboard') {
    title.textContent = 'Dashboard laboratorio'
    subtitle.textContent = 'Vista rápida para operación diaria: pendientes, cuellos de botella y métricas básicas.'
  } else if (effective === 'api') {
    title.textContent = 'API Explorer'
    subtitle.textContent = 'Accede a todos los controllers a través de Swagger UI.'
  } else if (effective === 'settings') {
    title.textContent = 'Configuración'
    subtitle.textContent = 'Define el backend URL y recarga endpoints.'
  } else if (effective === 'inicio') {
    title.textContent = 'Inicio (CRUD)'
    subtitle.textContent = 'Pantalla base para formularios CRUD.'
  }

  document.querySelectorAll('.nav-link[data-route]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-route') === effective)
  })

  return effective
}

function getRouteFromHash() {
  const hash = String(window.location.hash || '')
  const m = hash.match(/^#\/([^/?#]+)/)
  return m ? m[1] : 'dashboard'
}

function boot() {
  const backendInput = document.getElementById('backendUrl')
  const saveBtn = document.getElementById('saveBackend')
  const reloadBtn = document.getElementById('reload')
  const openSwagger = document.getElementById('open-swagger')

  const initial = getBackendUrl()
  if (backendInput) backendInput.value = initial
  if (openSwagger) openSwagger.href = backendSwaggerUiUrl(initial)

  const doReload = () => {
    const baseUrl = normalizeBaseUrl((backendInput && backendInput.value) || getBackendUrl())
    if (backendInput) backendInput.value = baseUrl
    if (openSwagger) openSwagger.href = backendSwaggerUiUrl(baseUrl)

    // Only mount Swagger when user is in API section (saves time)
    if (!document.getElementById('page-api')?.hidden) {
      mountSwagger(baseUrl)
    }
  }

  if (saveBtn && backendInput) {
    saveBtn.addEventListener('click', () => {
      const v = setBackendUrl(backendInput.value)
      backendInput.value = v
      doReload()
    })
  }

  if (reloadBtn) reloadBtn.addEventListener('click', doReload)
  if (backendInput) {
    backendInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doReload()
    })
  }

  const onRouteChange = () => {
    const effective = setActiveRoute(getRouteFromHash())
    if (effective === 'api') doReload()
  }

  window.addEventListener('hashchange', onRouteChange)
  onRouteChange()

  // Cheap "work-like" numbers
  const pendientesEl = document.getElementById('kpi-pendientes')
  if (pendientesEl) pendientesEl.textContent = String(1)
}

boot()

