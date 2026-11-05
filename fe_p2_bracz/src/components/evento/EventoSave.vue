<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, DatePicker, Dialog, InputNumber, InputText, Select } from 'primevue'
import { ESTADOS_EVENTO, type Evento } from '@/models/evento'
import type { Recinto } from '@/models/recinto'

interface EventoForm {
  id?: number
  idRecinto: number | null
  titulo: string
  artistaPrincipal: string
  duracionMinutos: number | null
  precioEntrada: number | null
  fechaEvento: Date | null
  estado: string | null
}

const ENDPOINT = 'eventos-culturales'
const props = defineProps({
  mostrar: Boolean,
  evento: {
    type: Object as () => Evento | null,
    default: null,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const vacio = (): EventoForm => ({
  idRecinto: null,
  titulo: '',
  artistaPrincipal: '',
  duracionMinutos: null,
  precioEntrada: null,
  fechaEvento: null,
  estado: null,
})
const evento = ref<EventoForm>(vacio())
const recintos = ref<Recinto[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function obtenerRecintos() {
  recintos.value = await http.get('recintos').then((res) => res.data)
}

// 'AAAA-MM-DD' <-> Date (en hora local, para evitar desfases de zona horaria)
function textoADate(fecha: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio!, mes! - 1, dia)
}

function dateATexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerRecintos()
      if (props.evento) {
        evento.value = {
          id: props.evento.id,
          idRecinto: props.evento.idRecinto,
          titulo: props.evento.titulo,
          artistaPrincipal: props.evento.artistaPrincipal,
          duracionMinutos: props.evento.duracionMinutos,
          precioEntrada: props.evento.precioEntrada,
          fechaEvento: textoADate(props.evento.fechaEvento),
          estado: props.evento.estado,
        }
      } else {
        evento.value = vacio()
      }
    }
  },
)

async function handleSave() {
  try {
    const body = {
      idRecinto: evento.value.idRecinto,
      titulo: evento.value.titulo,
      artistaPrincipal: evento.value.artistaPrincipal,
      duracionMinutos: evento.value.duracionMinutos,
      precioEntrada: evento.value.precioEntrada,
      fechaEvento: evento.value.fechaEvento ? dateATexto(evento.value.fechaEvento) : null,
      estado: evento.value.estado,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${evento.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    evento.value = vacio()
    dialogVisible.value = false
  } catch (error: any) {
    const mensaje = error?.response?.data?.message
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Evento' : 'Crear Evento'"
      style="width: 32rem"
      modal
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="recinto" class="font-semibold w-4">Recinto</label>
        <Select
          id="recinto"
          v-model="evento.idRecinto"
          :options="recintos"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccione un recinto"
          class="flex-auto"
          filter
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-4">Título</label>
        <InputText
          id="titulo"
          v-model="evento.titulo"
          class="flex-auto"
          maxlength="150"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="artista" class="font-semibold w-4">Artista principal</label>
        <InputText
          id="artista"
          v-model="evento.artistaPrincipal"
          class="flex-auto"
          maxlength="100"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="duracion" class="font-semibold w-4">Duración (min)</label>
        <InputNumber
          id="duracion"
          v-model="evento.duracionMinutos"
          class="flex-auto"
          :min="1"
          :useGrouping="false"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-4">Precio de entrada</label>
        <InputNumber
          id="precio"
          v-model="evento.precioEntrada"
          class="flex-auto"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :min="0"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fecha" class="font-semibold w-4">Fecha del evento</label>
        <DatePicker
          id="fecha"
          v-model="evento.fechaEvento"
          class="flex-auto"
          dateFormat="dd/mm/yy"
          showIcon
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-4">Estado</label>
        <Select
          id="estado"
          v-model="evento.estado"
          :options="ESTADOS_EVENTO"
          placeholder="Seleccione un estado"
          class="flex-auto"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
