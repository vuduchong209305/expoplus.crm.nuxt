<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Báo giá</h1>
                <p class="text-sm text-gray-500 mt-0.5">Các đơn hàng báo giá cho khách hàng</p>
            </div>
            <NuxtLink to="/contract/quotation/create" class="px-4 py-2 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all"><i class="ti ti-plus me-2"></i>Thêm báo giá</NuxtLink>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <div class="bg-white p-4 rounded-lg mb-3 border">
        	<div class="flex flex-wrap items-center gap-2">
                
                <form @submit.prevent="submitSearch" class="relative w-80">
                    <input v-model="search" placeholder="Tìm mã báo giá, khách hàng, triển lãm..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                    <!-- BUTTON INSIDE -->
                    <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
                        <i class="ti ti-search text-lg"></i>
                    </button>
                </form>
                
            </div>
        </div>

        <div class="bg-white border border-b-0 rounded-lg">

            <table class="w-full">
                <thead class="border-b">
                    <tr>
                        <th class="p-3 text-left w-12" width="5%">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </th>
                        <th class="p-3 text-sm text-center font-medium" width="5%">#</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Mã báo giá</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Họ tên</th>
                        <th class="p-3 text-sm text-left font-medium" width="40%">Doanh nghiệp</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Thành tiền</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Phụ trách</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Sự kiện</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in quotations" :key="index" class="border-b hover:bg-gray-100 transition-all">

                        <td class="p-3">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </td>

                        <td class="p-3">
                            <div class="flex items-center justify-center gap-2">
                                <div class="dropdown relative">
                                    <!-- Trigger -->
                                    <button class="dropdown-btn px-1 border rounded-full bg-white text-gray-700 border-gray-200">
                                        <i class="ti ti-dots-vertical text-gray-400"></i>
                                    </button>
                                    <!-- Menu -->
                                    <ul class="dropdown-menu hidden absolute mt-2 w-40 bg-white border rounded shadow-md py-1 z-50">
                                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm">
                                            <NuxtLink :to="`/contract/quotation/${item.id}`" class="block w-full">
                                                <i class="ti ti-edit"></i>&nbsp;&nbsp;Sửa
                                            </NuxtLink>
                                        </li>
                                        <li class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer text-sm" @click="deleteItem(item.id)"><i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa</li>
                                    </ul>
                                </div>
                            </div>
                        </td>

                        <td class="p-3">
                            <NuxtLink :to="`/contract/quotation/${item.id}`" class="text-gray-500 text-sm text-indigo-500 hover:font-semibold transition-all">{{ item?.code }}</NuxtLink>
                        </td>

                        <td class="p-3">
                            <NuxtLink :to="`/customer/view/${item?.customer?.id}`" class="text-sm text-blue-500 hover:font-semibold transition-all truncate">{{ item?.customer?.fullname }}</NuxtLink>
                        </td>

                        <td class="p-3">
                            <span class="text-sm text-gray-500 truncate">{{ item?.customer?.company }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ formatMoney(item?.grand_total) }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.assigned?.fullname }}</span>
                        </td>

                        <td class="p-3">
                            <img :src="viewImage(item?.exhibition?.logo)" :alt="item?.exhibition?.title">
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
</template>

<script setup lang="ts">

    import Swal from 'sweetalert2'
    
    definePageMeta({
        middleware: ['auth'],
    })

    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    const route = useRoute()
    const quotations = ref([])
    const search = ref('')

    watch(() => route.query.page, (page) => {
        fetch(Number(page) || 1)
    }, { immediate: true })

    async function fetch(page = 1) {
        const res = await useNuxtApp().$apiFetch(`quotation`, {
            params: {
                page: page,
                search: search.value,
            }
        });

        if (res.status) {
            quotations.value = res.data.data
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
                const res = await useNuxtApp().$apiFetch(`quotation/delete`, {
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

    async function submitSearch() {
        await fetch()
    }

    useHead(() => ({
        title: 'Báo giá'
    }))
</script>