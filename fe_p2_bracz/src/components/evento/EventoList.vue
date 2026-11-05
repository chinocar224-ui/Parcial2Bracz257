<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Evento, EstadoEvento } from '@/models/evento'

const ENDPOINT = 'eventos-culturales'
const eventos = ref<Evento[]>([])
const busqueda = ref<string>('')
const eventoDelete = ref<Evento | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  eventos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const eventosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return eventos.value.filter(
    (evento) =>
      evento.titulo.toLowerCase().includes(texto) ||
      evento.artistaPrincipal.toLowerCase().includes(texto) ||
      evento.recinto.nombre.toLowerCase().includes(texto) ||
      evento.estado.toLowerCase().includes(texto),
  )
})

function severidad(estado: EstadoEvento) {
  if (estado === 'Programado') return 'success'
  if (estado === 'Agotado') return 'warn'
  return 'danger'
}

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function emitirEdicion(evento: Evento) {
  emit('edit', evento)
}

function mostrarEliminarConfirm(evento: Evento) {
  eventoDelete.value = evento
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${eventoDelete.value?.id}`)
    await obtenerLista()
  } catch (error: any) {
    alert(error?.response?.data?.message)
  } finally {
    mostrarConfirmDialog.value = false
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <InputGroup class="mb-3">
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText
        v-model="busqueda"
        type="text"
        placeholder="Buscar por título, artista, recinto o estado"
      />
    </InputGroup>
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Título</th>
            <th>Artista principal</th>
            <th>Recinto</th>
            <th>Fecha</th>
            <th>Duración (min)</th>
            <th>Precio (Bs.)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(evento, index) in eventosFiltrados" :key="evento.id">
            <td>{{ index + 1 }}</td>
            <td>{{ evento.titulo }}</td>
            <td>{{ evento.artistaPrincipal }}</td>
            <td>{{ evento.recinto.nombre }} ({{ evento.recinto.ciudad }})</td>
            <td>{{ formatearFecha(evento.fechaEvento) }}</td>
            <td>{{ evento.duracionMinutos }}</td>
            <td>{{ Number(evento.precioEntrada).toFixed(2) }}</td>
            <td><Tag :value="evento.estado" :severity="severidad(evento.estado)" /></td>
            <td class="acciones">
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                @click="emitirEdicion(evento)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                text
                @click="mostrarEliminarConfirm(evento)"
              />
            </td>
          </tr>
          <tr v-if="eventosFiltrados.length === 0">
            <td colspan="9">No se encontraron resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.acciones > button {
  width: 32px;
  margin-inline: 2px;
}
</style>
