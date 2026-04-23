<template>
    <form @submit.prevent="submit" class="space-y-6">
        <!-- TITLE -->
        <div>
            <input v-model="form.title" type="text" placeholder="Tên tác vụ..." class="w-full text-lg font-semibold outline-none border-b border-transparent focus:border-indigo-500 pb-1" />
        </div>
        <!-- META -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Bắt đầu</label>
                <input v-model="form.start_date" type="date" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Kết thúc</label>
                <input v-model="form.end_date" type="date" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>
        </div>

        <div>
            <label class="text-sm text-gray-700 mb-1 block">Giao cho</label>
            <select v-model="form.assigned_to" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                <option value="">-- Giao cho --</option>
                <option v-for="u in props.users" :key="u.id" :value="u.id">
                    {{ u.fullname }}
                </option>
            </select>
        </div>

        <div>
            <label class="text-sm text-gray-700 mb-2 block">
                Tiến độ: <span class="font-semibold">{{ form.progress }}%</span>
            </label>

            <input v-model="form.progress" type="range" min="0" max="100" step="5" class="w-full accent-indigo-500 cursor-pointer" />
        </div>

        <div>
            <label class="text-sm text-gray-700 mb-1 block">Hoàn thành lúc</label>
            <input v-model="form.completed_at" type="datetime-local" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>

        <!-- NOTE -->
        <div>
            <label class="text-sm text-gray-700 mb-1 block">Ghi chú</label>
            <textarea v-model="form.note" rows="3" placeholder="Thêm ghi chú..." class="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
        </div>
        <!-- ACTION -->
        <div class="flex items-center justify-between gap-2 pt-2 border-t">
            <div>
                <button type="button" @click="deleteItem(form.id)" class="text-red-500 text-xs p-1 border border-red-500 hover:bg-red-500 hover:text-white rounded active:scale-95 transition">
                    <i class='ti ti-trash'></i>
                </button>
            </div>
            <div>
                <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 active:scale-95 transition"> Hủy </button>
                &nbsp;
                <button type="submit" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 active:scale-95 transition"> Lưu dữ liệu </button>
            </div>
            
        </div>
    </form>
</template>

<script setup lang="ts">

    import Swal from 'sweetalert2'

    const props = defineProps({
        task: {
            type: Object,
            required: true
        },
        users: {
            type: Array,
            default: () => []
        }
    })

    const emit = defineEmits(['saved', 'deleted', 'close'])

    const form = reactive({
        id: null,
        title: '',
        start_date: '',
        end_date: '',
        assigned_to: '',
        completed_at: '',
        note: '',
        progress: 0
    })

    // sync dữ liệu khi mở task
    watch(() => props.task, (val) => {
        if (val) {
            Object.assign(form, val)
            form.assigned_to = val.assigned_to ?? ''
        }
    }, {
        immediate: true
    })

    const submit = async () => {
        const res = await useNuxtApp().$apiFetch(`task/update`, {
            method: 'POST',
            body: {
                form
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })
            emit('saved', {
                id: form.id,
                title: form.title,
                start_date: form.start_date,
                end_date: form.end_date,
                progress: form.progress,
                completed_at: form.completed_at
            })
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function deleteItem(id) {
        Swal.fire({
            title: "Xóa dữ liệu",
            text: "Bạn chắc chắn muốn xóa dữ liệu này",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Đóng"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await useNuxtApp().$apiFetch(`task/delete`, {
                    method: 'POST',
                    body: {
                        id
                    }
                })

                if (res.status) {
                    notify.success({
                        title: 'Thông báo',
                        description: res.message
                    })
                    emit('deleted', form.id)
                } else {
                    notify.error({
                        title: 'Thông báo',
                        description: res.message
                    })
                }
            }
        });
    }
</script>