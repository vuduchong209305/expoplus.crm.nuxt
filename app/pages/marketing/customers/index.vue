<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Nhóm khách hàng</h1>
                <p class="text-sm text-gray-500 mt-0.5">Danh sách các nhóm khách hàng</p>
            </div>
            <NuxtLink to="/marketing/customers/create" class="px-4 py-2 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all"><i class="ti ti-plus me-2"></i>Thêm nhóm khách hàng </NuxtLink>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <div class="bg-white p-4 rounded-lg mb-3 border">
            <div class="flex flex-wrap items-center gap-2">
                
                <form @submit.prevent="submitSearch" class="relative w-80">
                    <input v-model="search" placeholder="Tìm tên, email, số điện thoại..." class="w-full pl-3 pr-10 py-2 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
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
                        <th class="p-3 text-sm text-left font-medium" width="20%">Nhóm khách hàng</th>
                        <th class="p-3 text-sm text-left font-medium" width="40%">Ghi chú</th>
                        <th class="p-3 text-sm text-left font-medium" width="15%">Số lượng KH</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Ngày tạo</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Ngày cập nhật</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data" :key="index" class="border-b hover:bg-gray-100 transition-all">

                        <td class="p-3">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </td>

                        <td class="p-3">
                            <NuxtLink :to="`/marketing/customers/${item.id}`" class="text-indigo-600 text-sm hover:font-medium">{{ item?.title }}</NuxtLink>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ item?.note }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ item?.detail_count }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.created_at }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.updated_at }}</span>
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
    const data = ref([])
    const search = ref('')

    watch(() => route.query.page, (page) => {
        fetch(Number(page) || 1)
    }, { immediate: true })

    async function fetch(page = 1) {

        const res = await useNuxtApp().$apiFetch(`customer-group`, {
            params: {
                page: page,
                search: search.value,
            }
        });

        if (res.status) {
            data.value = res.data.data
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

    async function submitSearch() {
        fetch()
    }

    useHead(() => ({
        title: 'Nhóm khách hàng'
    }))
</script>