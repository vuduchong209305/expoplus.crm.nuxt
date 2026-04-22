<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Thêm nhóm khách hàng</h1>
                <p class="text-sm text-gray-500 mt-0.5">Danh sách các nhóm khách hàng</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

    	<form @submit.prevent="submit">

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3">Thông tin chung</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Tên nhóm khách hàng <span class="text-red-500">*</span></label>
                        <input v-model="title" type="text" placeholder="Tên nhóm khách hàng" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ghi chú</label>
                        <input v-model="note" type="text" placeholder="Ghi chú" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3">Chọn khách hàng</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
				    <!-- LEFT: SEARCH + LIST -->
				    <div class="border rounded-lg p-4">
				        <div class="relative w-full">
				        	<input v-model="search" placeholder="Tìm tên, email, số điện thoại..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
		                    <!-- BUTTON INSIDE -->
		                    <button type="button" class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
		                        <i class="ti ti-search text-lg"></i>
		                    </button>
				        </div>
				        
				        <hr class="my-5">

				        <div class="max-h-[400px] overflow-y-auto space-y-2">
				            <div v-for="item in availableCustomers" :key="item.id" @click="toggleCustomer(item)" class="flex items-center justify-between px-3 py-2 border border-indigo-200 rounded cursor-pointer hover:bg-indigo-50">
				                <div>
				                    <div class="text-sm font-medium">{{ item.fullname }}</div>
				                    <div class="text-xs text-gray-500">{{ item.email }}</div>
				                </div>
				                <button type="button" class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-600"> + Chọn </button>
				            </div>
				        </div>

				        <Pagination
				            :current-page="pagination.current_page"
				            :last-page="pagination.last_page"
				            :per-page="pagination.per_page"
				            :total="pagination.total"
				            @page-change="fetch"
				        />
				    </div>
				    <!-- RIGHT: SELECTED -->
				    <div class="border rounded-lg p-4">
				        <h5 class="font-semibold mb-3">Đã chọn ({{ selected.length }})</h5>
				        <div v-if="selected.length === 0" class="text-sm text-gray-400"> Chưa có khách hàng nào </div>
				        <div class="max-h-[400px] overflow-y-auto space-y-2">
				            <div v-for="item in selected" :key="item.id" class="flex items-center justify-between px-3 py-2 border rounded bg-indigo-50">
				                <div>
				                    <div class="text-sm font-medium">{{ item.fullname }}</div>
				                    <div class="text-xs text-gray-500">{{ item.email }}</div>
				                </div>
				                <button type="button" @click="removeCustomer(item.id)" class="text-xs px-2 py-1 rounded bg-red-100 text-red-500"> Xóa </button>
				            </div>
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
	import debounce from 'lodash/debounce'

	definePageMeta({
		middleware: ['auth'],
	});

	const title = ref('')
	const note = ref('')
	const search = ref('')
	const customers = ref([])
	const selected = ref([])
	const route = useRoute()

	const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

	onMounted(() => {
    	fetch()
    });

	// 🔥 auto fetch khi filter đổi
    watch(
        [search],
        debounce(fetch, 500), {
            deep: true
        }
    )

    watch(() => route.query.page, (page) => {
        fetch(Number(page) || 1)
    }, { immediate: true })

	// fetch API
	async function fetch(page = 1) {
	    const res = await useNuxtApp().$apiFetch('customer', {
	    	method: 'POST',
	        body: {
	        	page: page,
	        	type_id: 2,
	            search: search.value
	        }
	    })

	    if (res.status) {
	        customers.value = res.data.data
	        pagination.value = {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
                total: res.data.total
            }
	    }
	}

	const availableCustomers = computed(() => {
		const selectedIds = selected.value.map(i => i.id)
		return customers.value.filter(c => !selectedIds.includes(c.id))
	})

	// add/remove
	const toggleCustomer = (item) => {
	    const exists = selected.value.find(i => i.id === item.id)

	    if (!exists) {
	        selected.value.push(item)
	    }
	}

	const removeCustomer = (id) => {
	    selected.value = selected.value.filter(i => i.id !== id)
	}

	async function submit() {
		const res = await useNuxtApp().$apiFetch(`customer-group/store`, {
            method: 'POST',
            body: {
                title: title.value,
                note: note.value,
                customers: selected.value.map(i => i.id)
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })
            navigateTo(`/marketing/customers`)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
	}
</script>