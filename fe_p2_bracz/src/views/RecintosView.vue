<script setup lang="ts">
import RecintoList from '@/components/recinto/RecintoList.vue'
import RecintoSave from '@/components/recinto/RecintoSave.vue'
import type { Recinto } from '@/models/recinto'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const recintosListRef = ref<typeof RecintoList | null>(null)
const recintoEdit = ref<Recinto | null>(null)

function handleCreate() {
  recintoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(recinto: Recinto) {
  recintoEdit.value = recinto
  mostrarDialog.value = true
}

function handleSave() {
  recintosListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Recintos</h2>
      <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    </div>
    <RecintoList ref="recintosListRef" @edit="handleEdit" />
    <RecintoSave
      :mostrar="mostrarDialog"
      :recinto="recintoEdit"
      :modoEdicion="!!recintoEdit"
      @guardar="handleSave"
      @close="handleCloseDialog"
    />
  </section>
</template>

<style scoped></style>
