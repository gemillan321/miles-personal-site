<script setup lang="ts">
import { useLightRig } from '@/composables/useLightRig'
import { useCalmMode } from '@/composables/useCalmMode'

import NodeField from '@/components/visual/NodeField.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import WorkSection from '@/components/sections/WorkSection.vue'
import DisciplinesSection from '@/components/sections/DisciplinesSection.vue'
import WorkflowSection from '@/components/sections/WorkflowSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

/* The rig is started once, here, for the whole application. Calm mode is
   initialised early so a returning visitor who turned motion off never sees a
   frame of it. */
useCalmMode()
useLightRig()
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>

  <NodeField />
  <div class="grain" aria-hidden="true" />

  <SiteHeader />

  <main id="main" class="page">
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <WorkSection />
    <DisciplinesSection />
    <WorkflowSection />
    <ProcessSection />
    <ContactSection />
  </main>

  <SiteFooter />
</template>

<style scoped>
/* Everything except the aurora and the grain sits on layer 2. */
.page {
  position: relative;
  z-index: 2;
}
</style>
