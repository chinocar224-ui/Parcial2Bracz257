<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand" to="/eventos">
        <i class="bi bi-ticket-perforated me-2"></i>Agenda Cultural
      </RouterLink>
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            :class="{ active: route.path.startsWith('/eventos') }"
            to="/eventos"
          >
            Eventos
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            :class="{ active: route.path.startsWith('/recintos') }"
            to="/recintos"
          >
            Recintos
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>
