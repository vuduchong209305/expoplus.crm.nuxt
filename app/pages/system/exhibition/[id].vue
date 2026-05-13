<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">{{ isEdit ? 'Chỉnh sửa triển lãm' : 'Thêm triển lãm' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Thông tin triển lãm</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <form @submit.prevent="submit">

            <div class="bg-white px-5 py-4 rounded mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Tên triển lãm <span class="text-red-500">*</span></label>
                        <input v-model="title" type="text" placeholder="Tên triển lãm" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Địa điểm</label>
                        <input v-model="location" type="text" placeholder="Địa điểm" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ngày bắt đầu</label>
                        <input ref="startRef" type="text" placeholder="Ngày bắt đầu" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ngày kết thúc</label>
                        <input ref="endRef" type="text" placeholder="Ngày kết thúc" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-4 rounded mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Logo</label>

                        <div class="flex items-center gap-4">
                            <!-- PREVIEW -->
                            <div class="relative">
                                <img :src="preview || viewImage(logo)" class="w-44 object-contain rounded border" />
                                <!-- nút chọn -->
                                <div @click="triggerFile" class="absolute bottom-2 right-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white hover:scale-110 transition cursor-pointer">
                                    <i class="ti ti-camera text-white text-xs"></i>
                                </div>
                            </div>
                            <!-- hidden input -->
                            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" class="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white text-sm font-medium">
                Lưu dữ liệu
            </button>

        </form>

    </div>
</template>

<script setup lang="ts">

    import flatpickr from 'flatpickr'
    import 'flatpickr/dist/l10n/vn.js'

	definePageMeta({
        middleware: ['auth'],
    })

    const route = useRoute()
    const id = route.params.id
    const isEdit = computed(() => id && id !== 'create')

    const title = ref('')
    const location = ref('')
    const start_date = ref('')
    const end_date = ref('')

    const startRef = ref<HTMLInputElement | null>(null)
    const endRef = ref<HTMLInputElement | null>(null)

    let startPicker: any = null
    let endPicker: any = null

    const fileInput = ref<HTMLInputElement | null>(null)

    const logo = ref('')        // ảnh từ DB (edit)
    const file = ref<File | null>(null)
    const preview = ref('')      // preview ảnh mới

    const triggerFile = () => {
        fileInput.value?.click()
    }

    const handleFile = (e: Event) => {
        const target = e.target as HTMLInputElement
        const selectedFile = target.files?.[0]

        if (!selectedFile) return

        file.value = selectedFile

        // preview
        preview.value = URL.createObjectURL(selectedFile)
    }

    const submit = async () => {
        const formData = new FormData()

        formData.append('id', isEdit.value ? String(id) : '')
        formData.append('title', title.value)
        formData.append('location', location.value)
        formData.append('start_date', start_date.value)
        formData.append('end_date', end_date.value)
        formData.append('avatar_current', logo.value || '')

        if (file.value) {
            formData.append('logo', file.value)
        }

        const res = await useNuxtApp().$apiFetch(`exhibition/save`, {
            method: 'POST',
            body: formData
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })

            navigateTo(`/system/exhibition`)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const fetch = async() => {
        if (isEdit.value) {
            const res = await useNuxtApp().$apiFetch(`exhibition/edit`, {
                params: {
                    id
                }
            })

            if (res.status) {
                title.value = res.data.title
                location.value = res.data.location
                logo.value = res.data.logo

                start_date.value = res.data.start_date
                end_date.value = res.data.end_date

                startPicker.setDate(start_date.value)
                endPicker.setDate(end_date.value)
            }
        }
    }

    onMounted(async () => {
        await fetch()
    })

    onMounted(() => {

        endPicker = flatpickr(endRef.value!, {
            locale: 'vn',
            dateFormat: 'Y-m-d',
            minDate: 'today',
            onChange: (dates) => {
                if (dates.length) {
                    end_date.value = formatDate(dates[0])
                }
            }
        })

        startPicker = flatpickr(startRef.value!, {
            locale: 'vn',
            dateFormat: 'Y-m-d',
            minDate: 'today',
            onChange: (dates) => {
                if (dates.length) {
                    start_date.value = formatDate(dates[0])
                }
                endPicker.set('minDate', dates[0])
            }
        })
    })
</script>