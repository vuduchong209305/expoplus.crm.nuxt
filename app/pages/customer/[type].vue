<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Quản lý khách hàng</h1>
                <p class="text-sm text-gray-500 mt-0.5">{{ type === 'lead' ? 'Danh sách Lead' : 'Danh sách Contact' }}</p>
            </div>
            <NuxtLink to="/customer/create" class="px-4 py-2 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all"><i class="ti ti-plus me-2"></i>Thêm khách hàng </NuxtLink>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <div class="bg-white p-4 rounded-lg mb-3 border">
            <div class="flex flex-wrap items-center gap-2">
                
                <form @submit.prevent="submitSearch" class="relative w-80">
                    <input v-model="search" placeholder="Tìm tên, email, số điện thoại..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                    <!-- BUTTON INSIDE -->
                    <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
                        <i class="ti ti-search text-lg"></i>
                    </button>
                </form>
                
                <!-- FILTER BUTTON -->
                <button @click="openFilterCanvas" class="px-3 py-2 border border-indigo-500 text-indigo-500 hover:bg-indigo-600 hover:text-white rounded-lg text-sm transition-all"> + Bộ lọc </button>
                <!-- RESET -->
                <button @click="resetFilter" class="px-3 py-2 text-sm text-red-500"> Reset </button>
            </div>
            <!-- FILTER PANEL -->
            <div v-if="showFilter" class="mt-3 border rounded-lg p-3 bg-gray-50">
                <div class="space-y-2">
                    <div v-for="(f, index) in filters" :key="index" class="flex gap-2 items-center">
                        <!-- FIELD -->
                        <select v-model="f.field" class="border px-2 py-1 rounded text-sm">
                            <option value="fullname">Họ tên</option>
                            <option value="email">Email</option>
                            <option value="phone">SĐT</option>
                            <option value="company">Doanh nghiệp</option>
                            <option value="bookmark">Đánh dấu</option>
                        </select>
                        <!-- OPERATOR -->
                        <select v-model="f.operator" class="border px-2 py-1 rounded text-sm">
                            <option value="contains">chứa</option>
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                        </select>
                        <!-- VALUE -->
                        <input v-model="f.value" class="border px-2 py-1 rounded text-sm flex-1" placeholder="Giá trị..." />
                        <!-- REMOVE -->
                        <button @click="removeFilter(index)" class="text-red-500">✕</button>
                    </div>
                    <button @click="addFilter" class="text-sm text-indigo-500"> + Thêm điều kiện </button>
                </div>
            </div>
            <!-- FILTER CHIPS -->
            <div class="flex flex-wrap gap-2 mt-3">
                <div v-for="(f, index) in filters" :key="'chip-'+index" class="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded flex items-center gap-1">
                    {{ f.field }} {{ f.operator }} {{ f.value }}
                    <button @click="removeFilter(index)">✕</button>
                </div>
            </div>
        </div>

        <div class="bg-white border border-b-0 rounded-lg">

            <table class="w-full">
                <thead class="border-b">
                    <tr>
                        <th class="p-3 text-left w-12" width="5%">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </th>
                        <th class="p-3 text-left font-medium" width="5%">#</th>
                        <th class="p-3 text-left font-medium" width="20%">Họ tên</th>
                        <th class="p-3 text-left font-medium" width="20%">Email</th>
                        <th class="p-3 text-left font-medium" width="15%">Số điện thoại</th>
                        <th class="p-3 text-left font-medium" width="30%">Doanh nghiệp</th>
                        <th class="p-3 text-left font-medium" width="15%">Giao cho</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer, index) in customers" :key="index" class="border-b hover:bg-gray-100 transition-all">

                        <td class="p-3">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </td>

                        <td class="p-3">
                            <div class="flex items-center gap-2">
                                <a href="javascript:;" @click="bookmark(customer?.id)">
                                    <svg v-if="customer?.bookmark == 1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-star text-yellow-500">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                                    </svg>
                                    <i v-else class="ti ti-star text-gray-400 text-lg hover:text-yellow-500"></i>
                                </a>
                                <div class="dropdown relative">
                                    <!-- Trigger -->
                                    <button class="dropdown-btn px-1 border rounded-full bg-white text-gray-700 border-gray-200">
                                        <i class="ti ti-dots-vertical text-gray-400"></i>
                                    </button>
                                    <!-- Menu -->
                                    <ul class="dropdown-menu hidden absolute mt-2 w-40 bg-white border rounded shadow-md py-1 z-50">
                                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm" @click="selectedCustomer = customer; openCustomer(customer)"><i class="ti ti-eye"></i>&nbsp;&nbsp;Xem nhanh</li>
                                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm"><i class="ti ti-calendar"></i>&nbsp;&nbsp;Tạo lịch</li>
                                        <li class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer text-sm" @click="deleteItem(customer?.id)"><i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa</li>
                                    </ul>
                                </div>
                            </div>
                        </td>

                        <td class="p-3">
                            <NuxtLink :to="(`/customer/view/${customer.id}`)" class="text-sm text-blue-500 hover:font-medium">{{ customer?.fullname }}</NuxtLink>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.email }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.phone }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.company }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.assigned?.fullname }}</span>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        
        </div>

        <Pagination
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :per-page="pagination.per_page"
            :total="pagination.total"
            @page-change="fetch"
        />
    </div>

    <Offcanvas :open="openCanvas" @close="openCanvas = false">
        <CustomerDetail v-if="canvasType === 'customer'" :customer="selectedCustomer" />
        <FilterBuilder v-else-if="canvasType === 'filter'" />
    </Offcanvas>

</template>

<script setup lang="ts">

	import Swal from 'sweetalert2'
    import debounce from 'lodash/debounce'

    definePageMeta({
        middleware: ['auth'],
    });

	const route = useRoute()
	const type = computed(() => route.params.type)

	// map type_id
	const typeMap = {
		lead: 1,
		contact: 2
	}

	const typeId = computed(() => typeMap[type.value] || 1)

	const selectedCustomer = ref('');
    const openQuickView = ref(false)
    const openFilter = ref(false)

    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    const search = ref('')
    const showFilter = ref(false)
    const filters = ref([])
    const customers = ref < any[] > ([])

    const openCanvas = ref(false)
    const canvasType = ref<'customer' | 'filter' | null>(null)

    const openCustomer = (customer) => {
        selectedCustomer.value = customer
        canvasType.value = 'customer'
        openCanvas.value = true
    }

    const openFilterCanvas = () => {
        canvasType.value = 'filter'
        openCanvas.value = true
    }

    async function fetch(page = 1) {

        const res = await useNuxtApp().$apiFetch(`customer`, {
            method: 'POST',
            body: {
            	type_id: typeId.value,
                page: page,
                search: search.value,
                filters: filters.value
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
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    watch(() => route.query.page, (page) => {
        fetch(Number(page) || 1)
    }, { immediate: true })

    async function bookmark(id) {
        const res = await useNuxtApp().$apiFetch(`customer/bookmark`, {
            method: 'POST',
            body: {
                id
            }
        })

        if (res.status) {
            fetch(route.query.page)
            notify.success({
                title: 'Thông báo',
                description: res.message
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
                const res = await useNuxtApp().$apiFetch(`customer/delete`, {
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

                    fetch(route.query.page)
                } else {
                    notify.error({
                        title: 'Thông báo',
                        description: res.message
                    })
                }
            }
        });
    }

    // FILTER
    const addFilter = () => {
        filters.value.push({
            field: 'fullname',
            operator: 'contains',
            value: ''
        })
    }

    const removeFilter = (index) => {
        filters.value.splice(index, 1)
    }

    const resetFilter = () => {
        search.value = ''
        filters.value = []
    }

    async function submitSearch() {
        fetch()
    }

    useHead(() => ({
        title: type?.value == 'lead' ? 'Danh sách Lead' : 'Danh sách Contact'
    }))

    // 🔥 auto fetch khi filter đổi
    // watch(
    //     [search, filters],
    //     debounce(fetch, 500), {
    //         deep: true
    //     }
    // )
</script>