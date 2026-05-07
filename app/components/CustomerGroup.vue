<template>
    <div class="flex flex-col h-full">

        <!-- SEARCH -->
        <div class="pb-3">
            <input v-model="search" type="text" placeholder="Tìm tên nhóm..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <!-- LIST -->
        <div class="flex-1 overflow-y-auto">
            <!-- loading -->
            <div v-if="loading" class="p-6 text-center text-gray-400"> Đang tải dữ liệu... </div>
            <!-- data -->
            <div v-else class="divide-y">
                <div v-for="item in customers_group" :key="item.id" class="flex items-center gap-3 px-2 py-3 hover:bg-gray-50">

				    <input type="checkbox" :checked="isSelected(item.id)" @change="toggleSelect(item)" class="w-4 h-4 accent-indigo-500" />

				    <div class="flex-1">
				        <div class="text-sm font-semibold">
				            {{ item.title }}
				        </div>

				        <div class="text-xs text-gray-500">
				            {{ item.detail_count }} khách hàng
				        </div>

				        <div class="text-xs text-gray-400">
				            {{ item.note || 'Không có ghi chú' }}
				        </div>
				    </div>
				</div>
                <div v-if="customers_group.length === 0" class="p-6 text-center text-gray-400"> Không có nhóm khách hàng khả dụng </div>
            </div>
        </div>
        <!-- PAGINATION -->
        <div class="px-4 py-3 border-t flex items-center justify-between text-sm">
            <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border rounded disabled:opacity-40"> ← Trước </button>
            <span>
                {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button @click="nextPage" :disabled="page === pagination.last_page" class="px-3 py-1 border rounded disabled:opacity-40"> Sau → </button>
        </div>
        <!-- FOOTER -->
        <div class="px-4 py-3 border-t flex justify-end gap-2">
            <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"> Hủy </button>
            <button @click="handleSave" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"> Thêm ({{ selectedGroups.length }}) </button>
        </div>
    </div>
</template>

<script setup lang="ts">
	const props = defineProps({
	    selectedCustomers: {
	        type: Array,
	        default: () => []
	    }
	})

	const emit = defineEmits(['saved', 'close'])

	const customers_group = ref([])
	const loading = ref(false)
	const selectedGroups = ref([])
	const selectedCustomers = ref([])

	const search = ref('')
	const page = ref(1)

	const pagination = ref({
	    current_page: 1,
	    last_page: 1,
	    per_page: 10,
	    total: 0
	})

	watch(() => props.selectedCustomers, (val) => {
	    selectedCustomers.value = [...val] // clone để tránh mutate props
	}, {
	    immediate: true
	})

	onMounted(() => {
	    fetchCustomers()
	})

	/* ================= FETCH ================= */
	const fetchCustomers = async () => {
	    loading.value = true

	    const res = await useNuxtApp().$apiFetch('customer-group', {
	        params: {
	            page: page.value,
	            search: search.value
	        }
	    })

	    if (res.status) {
	        customers_group.value = res.data.data

	        pagination.value = {
	            current_page: res.data.current_page,
	            last_page: res.data.last_page,
	            per_page: res.data.per_page,
	            total: res.data.total
	        }
	    }

	    loading.value = false
	}

	/* ================= SEARCH ================= */
	let timeout: any = null

	watch(search, () => {
	    clearTimeout(timeout)

	    timeout = setTimeout(() => {
	        page.value = 1
	        fetchCustomers()
	    }, 400)
	})

	/* ================= PAGINATION ================= */
	const nextPage = () => {
	    if (page.value < pagination.value.last_page) {
	        page.value++
	        fetchCustomers()
	    }
	}

	const prevPage = () => {
	    if (page.value > 1) {
	        page.value--
	        fetchCustomers()
	    }
	}

	/* ================= ACTION ================= */
	const handleSave = async() => {

		const res = await useNuxtApp().$apiFetch('campaign/customer-group', {
            params: {
                group_ids: selectedGroups.value.map(i => i.id)
            }
        })

        if(res.status) {
        	const customers = res.data.map(i => i.customer)
        	
        	const merged = Array.from(
			    new Map(
			        [...selectedCustomers.value, ...customers]
			        .map(item => [item.id, item])
			    ).values()
			)

	        emit('saved', merged)
        }   
	}

	const toggleSelect = (item) => {
	    const index = selectedGroups.value.findIndex(i => i.id === item.id)

	    if (index > -1) {
	        selectedGroups.value.splice(index, 1)
	    } else {
	        selectedGroups.value.push(item)
	    }
	}

	const isSelected = (id) => {
	    return selectedGroups.value.some(i => i.id === id)
	}
</script>