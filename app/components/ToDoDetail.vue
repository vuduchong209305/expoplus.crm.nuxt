<template>
    <form @submit.prevent="submit" class="space-y-6">

        <div>
            <input v-model="form.title" type="text" placeholder="Tên tác vụ..." class="w-full text-lg font-semibold outline-none border-b border-transparent focus:border-indigo-500 pb-1" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Ưu tiên</label>
                <select v-model="form.priority" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="">-- Chọn --</option>
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                </select>
            </div>

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Ngày đến hạn</label>
                <input v-model="form.due_date" type="datetime-local" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Trạng thái</label>
                <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="pending">Chưa xong</option>
                    <option value="completed">Hoàn thành</option>
                </select>
            </div>

            <div>
                <label class="text-sm text-gray-700 mb-1 block">Hoàn thành vào lúc</label>
                <input v-model="form.completed_at" type="text" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" disabled="" />
            </div>
        </div>

        <div>
            <label class="text-sm text-gray-700 mb-1 block">Mô tả</label>
            <textarea v-model="form.description" rows="3" placeholder="Thêm mô tả..." class="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
        </div>

        <div>
            <label class="text-sm text-gray-700 mb-1 block">Ghi chú</label>
            <textarea v-model="form.note" rows="3" placeholder="Thêm ghi chú..." class="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
        </div>

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
        }
    })

    const emit = defineEmits(['saved', 'deleted', 'close'])

    const form = reactive({
        id: null,
        title: '',
        priority: '',
        due_date: '',
        status: 'pending',
        description: '',
        note: ''
    })

    const formatDateForInput = (date) => {
        if (!date) return ''
        return date.replace(' ', 'T').slice(0, 16)
    }

    // sync dữ liệu khi mở task
    watch(() => props.task, (val) => {
        if (val) {
            Object.assign(form, val)
            form.due_date = formatDateForInput(val.due_date)
        }
    }, {
        immediate: true
    })

    const submit = async () => {
        const res = await useNuxtApp().$apiFetch(`todo/update`, {
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
                due_date: form.due_date,
                priority: form.priority,
                completed_at: form.status == 'completed' ? 1 : null
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
                const res = await useNuxtApp().$apiFetch(`todo/delete`, {
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