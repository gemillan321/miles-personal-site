import type { App } from 'vue'
import { vReveal } from './reveal'
import { vSpotlight } from './spotlight'
import { vMagnetic } from './magnetic'
import { vTilt } from './tilt'
import { vDraw } from './draw'

/** Registers the site's interaction directives. */
export function installDirectives(app: App) {
  app.directive('reveal', vReveal)
  app.directive('spotlight', vSpotlight)
  app.directive('magnetic', vMagnetic)
  app.directive('tilt', vTilt)
  app.directive('draw', vDraw)
}

export { vReveal, vSpotlight, vMagnetic, vTilt, vDraw }
