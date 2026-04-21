<template>
    <div class="inline-flex items-center gap-1 group">
        <!-- DISPLAY -->
        <template v-if="!editing">
            <span :class="modelValue ? 'text-gray-900' : 'text-gray-400 italic'">
                {{ displayLabel }}
            </span>
            <!-- ICON sát bên -->
            <button @click="startEdit" class="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-blue-500">
                <i class="ti ti-pencil text-lg"></i>
            </button>
        </template>
        <!-- EDIT MODE -->
        <template v-else>
            <!-- TEXT -->
            <input v-if="type === 'text'" v-model="value" @keydown.enter.prevent="save" @keydown.esc.prevent="cancel" class="border w-96 px-2 py-1 rounded text-sm focus:outline-none focus:border-indigo-300" autofocus />

            <!-- TEXT -->
            <textarea v-if="type === 'textarea'" v-model="value" @keydown.ctrl.enter="save" @keydown.esc.prevent="cancel" class="border w-96 px-2 py-1 rounded text-sm" rows=3></textarea>

            <!-- SELECT -->
            <select v-if="type === 'select'" v-model="value" class="border px-2 py-1 rounded text-sm">
                <option value="">-- Chọn --</option>
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
            <!-- ACTION BUTTON -->
            <div class="flex items-center gap-1 ml-1">
                <!-- Save -->
                <button @click="save" class="text-green-500 hover:text-green-600">
                    <i class="ti ti-check text-lg"></i>
                </button>
                <!-- Cancel -->
                <button @click="cancel" class="text-gray-400 hover:text-red-500">
                    <i class="ti ti-x text-lg"></i>
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        modelValue: [String, Number],
        field: String,
        type: {
            type: String,
            default: 'text'
        },
        options: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: 'Chưa có'
        }
    })

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string | number): void
        (e: 'save', payload: { field: string; value: any }): void
    }>()

    const editing = ref(false)
    const value = ref(props.modelValue)

    watch(() => props.modelValue, (v) => value.value = v)

    const startEdit = () => {
        editing.value = true
    }

    const save = () => {
        emit('save', {
            field: props.field,
            value: value.value,
            oldValue: props.modelValue
        })
        editing.value = false
        emit('update:modelValue', value.value)
    }

    const cancel = () => {
        editing.value = false
        value.value = props.modelValue
    }

    const displayLabel = computed(() => {
        if (props.type === 'select') {
            const found = props.options.find(o => o.value == props.modelValue)
            return found ? found.label : props.placeholder
        }

        return props.modelValue || props.placeholder
    })
</script>