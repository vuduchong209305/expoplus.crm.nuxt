<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">{{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Sản phẩm cung cấp cho khách hàng</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <form @submit.prevent="submit">

            <div class="bg-white px-5 py-4 rounded mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Tên sản phẩm <span class="text-red-500">*</span></label>
                        <input v-model="title" type="text" placeholder="Tên sản phẩm" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Giá</label>
                        <input v-model="price" type="number" placeholder="Giá" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Đơn vị tính</label>
                        <input v-model="unit" type="text" placeholder="Đơn vị tính" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ghi chú</label>
                        <input v-model="note" type="text" placeholder="Ghi chú" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-4 rounded mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Hình ảnh</label>

                        <div class="flex items-center gap-4">
                            <!-- PREVIEW -->
                            <div class="relative">
                                <img :src="preview || viewImage(avatar)" class="w-24 h-24 object-cover rounded-full border" />
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
	definePageMeta({
        middleware: ['auth'],
    })

    const route = useRoute()
    const id = route.params.id
    const isEdit = computed(() => id && id !== 'create')

    const title = ref('')
    const price = ref('')
    const unit = ref('')
    const note = ref('')

    const fileInput = ref<HTMLInputElement | null>(null)

    const avatar = ref('')        // ảnh từ DB (edit)
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
        formData.append('note', note.value)
        formData.append('unit', unit.value)
        formData.append('price', price.value)

        if (file.value) {
            formData.append('avatar', file.value)
        }

        const res = await useNuxtApp().$apiFetch(`product/save`, {
            method: 'POST',
            body: formData
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })

            navigateTo(`/system/product`)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const fetch = async() => {
        if (isEdit.value) {
            const res = await useNuxtApp().$apiFetch(`product/edit`, {
                params: {
                    id
                }
            })

            if (res.status) {
                title.value = res.data.title
                note.value = res.data.note
                unit.value = res.data.unit
                price.value = res.data.price
                avatar.value = res.data.avatar
            }
        }
    }

    onMounted(async () => {
        await fetch()
    })
</script>