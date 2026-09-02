import { createApp } from 'vue'
import App from './App.vue'
import { installDirectives } from './directives'

/* Fonts are self-hosted rather than pulled from a font CDN: one less
   render-blocking third-party request, no third party learning who visits the
   site, and the files are fingerprinted and cached with everything else. Each
   file is subset by unicode-range, so a visitor reading Latin text never
   downloads the Cyrillic or Greek cuts. */
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/inter/wght.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'

import './styles/main.css'

const app = createApp(App)
installDirectives(app)
app.mount('#app')
