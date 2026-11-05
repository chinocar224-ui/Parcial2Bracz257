<script setup lang="ts">
import EventoList from '@/components/evento/EventoList.vue'
import EventoSave from '@/components/evento/EventoSave.vue'
import type { Evento } from '@/models/evento'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const eventosListRef = ref<typeof EventoList | null>(null)
const eventoEdit = ref<Evento | null>(null)

function handleCreate() {
  eventoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(evento: Evento) {
  eventoEdit.value = evento
  mostrarDialog.value = true
}

function handleSave() {
  eventosListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Eventos Culturales</h2>
      <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    </div>
    <EventoList ref="eventosListRef" @edit="handleEdit" />
    <EventoSave
      :mostrar="mostrarDialog"
      :evento="eventoEdit"
      :modoEdicion="!!eventoEdit"
      @guardar="handleSave"
      @close="handleCloseDialog"
    />
  </section>
</template>

<style scoped></style>
