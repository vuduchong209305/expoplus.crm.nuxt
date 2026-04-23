<template>
	<form @submit.prevent="submit" class="space-y-5">
	    <!-- TITLE -->
	    <div>
	        <input v-model="form.title" placeholder="Thêm tiêu đề..." class="w-full text-lg font-semibold border-b border-gray-300 focus:border-indigo-500 focus:outline-none pb-2" required />
	    </div>
	    <!-- TYPE -->
	    <div>
	        <label class="text-xs text-gray-700 mb-1 block">Loại lịch</label>
	        <select v-model="form.type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required>
	            <option value="call">📞 Gọi điện</option>
	            <option value="meeting">📅 Meeting</option>
	        </select>
	    </div>
	    <!-- TIME -->
	    <div class="grid grid-cols-2 gap-3">
	        <div>
	            <label class="text-xs text-gray-700 mb-1 block">Bắt đầu</label>
	            <input type="datetime-local" v-model="form.start_time" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required />
	        </div>
	        <div>
	            <label class="text-xs text-gray-700 mb-1 block">Kết thúc</label>
	            <input type="datetime-local" v-model="form.end_time" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required />
	        </div>
	    </div>
	    <!-- REMINDER -->
	    <div>
	        <label class="text-xs text-gray-700 mb-1 block">Nhắc nhở</label>
	        <select v-model="form.reminder_minutes" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
	            <option value="0">Không nhắc</option>
	            <option value="15">15 phút trước</option>
	            <option value="30">30 phút trước</option>
	            <option value="60">1 giờ trước</option>
	        </select>
	    </div>

	    <div>
	    	<label class="text-xs text-gray-700 mb-1 block">Địa điểm</label>
	    	<textarea v-model="form.location" rows="3" placeholder="Thêm mô tả..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
	    </div>

	    <div>
	    	<label class="text-xs text-gray-700 mb-1 block">Ghi chú</label>
	    	<textarea v-model="form.note" rows="3" placeholder="Thêm ghi chú..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-500"></textarea>
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
        event: Object
    })

	const editingId = ref(null)
    const emit = defineEmits(['saved', 'deleted', 'close'])

    const form = reactive({
		title: '',
		type: 'call',
		start_time: '',
		end_time: '',
		location: '',
		note: '',
		reminder_minutes: 0
	})

    // sync dữ liệu khi mở task
    watch(() => props.event, (val) => {
        if (val) {
            Object.assign(form, val)
        }
    }, {
        immediate: true
    })

	const formatDateTimeLocal = (date) => {
		if (!date) return '';
		const d = new Date(date);
		const pad = (n) => n.toString().padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
	}

	async function submit() {

		const url = editingId.value ? 'event/update' : 'event/store'

		const res = await useNuxtApp().$apiFetch(url, {
		    method: 'POST',
		    body: {
		    	id: editingId.value,
      			...form
		    }
		})

		if (res.status) {
			emit('saved')
		}
	}
	
	watch(() => props.event, (val) => {
		if (val) {
			editingId.value = val.id

			form.title = val.title
			form.type = val.type

			form.start_time = formatDateTimeLocal(val.start_time)
			form.end_time = formatDateTimeLocal(val.end_time)

			form.location = val.location || ''
			form.note = val.note || ''
			form.reminder_minutes = val.reminder_minutes || 0
		}
	}, { immediate: true })

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
                const res = await useNuxtApp().$apiFetch(`event/delete`, {
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