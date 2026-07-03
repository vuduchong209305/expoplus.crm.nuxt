<template>
    <div class="flex flex-col h-full space-y-3">
    	<div class="space-y-2">
    		<label class="text-sm text-gray-500"> Loại dữ liệu </label>
	        <select v-model="typeSelected" class="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white" >
	            <option value=""> -- Lựa chọn -- </option>
	            <option v-for="u in types" :key="u.id" :value="u.id">
	                {{ u.name }}
	            </option>
	        </select>
    	</div>

    	<div class="space-y-2">
    		<label class="text-sm text-gray-500"> Đánh dấu quan trọng </label>
	        <select v-model="bookmarkSelected" class="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white" >
	            <option value=""> -- Lựa chọn -- </option>
	            <option value="1">Có</option>
	            <option value="0">Không</option>
	        </select>
    	</div>

        <div class="flex justify-end gap-2">
            <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"> Hủy </button>
            <button @click="handleSave" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"> Cập nhật </button>
        </div>

    </div>
</template>

<script setup lang="ts">

	const emit = defineEmits([
	    'saved',
	    'close'
	])

	const types = ref([])
	const typeSelected = ref('')
	const bookmarkSelected = ref('')

	onMounted(() => {
	    customerType()
	})

	/* ================= USERS ================= */

	async function customerType() {
	    const res = await useNuxtApp().$apiFetch('customer/type')
	    if (res.status) {
	        types.value = res.data
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
	        type_id: typeSelected.value,
	        bookmark: bookmarkSelected.value
	    })
	}

</script>