<template>
    <div class="flex flex-col h-full space-y-4">

        <p class="text-sm text-gray-500">
            Chọn nhân viên phụ trách dữ liệu
        </p>

        <select v-model="selectedUser" class="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white" >
            <option value=""> -- Chọn nhân viên -- </option>

            <option v-for="u in assignedTo" :key="u.id" :value="u.id">
                {{ u.fullname }}
            </option>
        </select>

        <div class="flex justify-end gap-2">
            <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"> Hủy </button>
            <button @click="handleSave" :disabled="!selectedUser" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"> Giao việc </button>
        </div>

    </div>
</template>

<script setup lang="ts">

	const emit = defineEmits([
	    'saved',
	    'close'
	])

	const assignedTo = ref([])
	const selectedUser = ref('')

	onMounted(() => {
	    assignedList()
	})

	/* ================= USERS ================= */

	async function assignedList() {

	    const res = await useNuxtApp().$apiFetch('user')

	    if (res.status) {

	        assignedTo.value = res.data.map(u => ({
	            fullname: u.fullname,
	            id: u.id
	        }))

	    } else {

	        notify.error({
	            title: 'Thông báo',
	            description: res.message
	        })
	    }
	}

	/* ================= SAVE ================= */

	const handleSave = () => {
	    emit('saved', {
	        id: selectedUser.value
	    })
	}

</script>