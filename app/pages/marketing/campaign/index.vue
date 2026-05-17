<template>
    <div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Chiến dịch</h1>
                <p class="text-sm text-gray-500 mt-0.5">Các chiến dịch marketing</p>
            </div>
            <NuxtLink to="/marketing/campaign/create" class="px-4 py-2 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all"><i class="ti ti-plus me-2"></i>Thêm chiến dịch </NuxtLink>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <div class="bg-white p-4 rounded-lg mb-3 border">
        	<div class="flex flex-wrap items-center justify-between gap-2">
                
                <form @submit.prevent="submitSearch" class="relative w-80">
                    <input v-model="search" placeholder="Tìm tên, email, số điện thoại..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                    <!-- BUTTON INSIDE -->
                    <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
                        <i class="ti ti-search text-lg"></i>
                    </button>
                </form>
                
                <div v-if="can('campaign.assigned')">
                    <button class="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm rounded-lg py-1 px-3 transition-all" @click="assigned"><i class="ti ti-user-share me-1"></i> Giao cho </button>
                </div>

            </div>
        </div>

        <div class="bg-white border border-b-0 rounded-lg">

            <table class="w-full">
                <thead class="border-b">
                    <tr>
                        <th class="p-3 text-left w-12" width="5%">
                            <input type="checkbox" class="w-4 h-4 rounded" :checked="isAllSelected" @change="toggleAll">
                        </th>
                        <th class="p-3 text-sm text-center font-medium" width="5%">#</th>
                        <th class="p-3 text-sm text-left font-medium" width="30%">Tên chiến dịch</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Trạng thái</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Số lượng KH</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Phụ trách</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Ngày bắt đầu</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Ngày kết thúc</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in campaigns" :key="index" class="border-b hover:bg-gray-100 transition-all">

                        <td class="p-3">
                            <input type="checkbox" class="w-4 h-4 rounded" :checked="isChecked(item)" @change="toggleItem(item)">
                        </td>

                        <td class="p-3">
                            <div class="flex items-center justify-center gap-2">
                                <div class="dropdown relative">
                                    <!-- Trigger -->
                                    <button class="dropdown-btn px-1 border rounded-full bg-white text-gray-700 border-gray-200">
                                        <i class="ti ti-dots-vertical text-gray-400"></i>
                                    </button>
                                    <!-- Menu -->
                                    <ul class="dropdown-menu hidden absolute mt-2 w-52 bg-white border rounded shadow-md py-1 z-50">
                                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm">
                                            <NuxtLink :to="`/marketing/campaign/${item.id}`" class="block w-full">
                                                <i class="ti ti-edit"></i>&nbsp;&nbsp;Sửa
                                            </NuxtLink>
                                        </li>
                                        <li class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer text-sm" @click="deleteItem(item.id)"><i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa</li>
                                    </ul>
                                </div>
                            </div>
                        </td>

                        <td class="p-3">
                            <NuxtLink :to="`/marketing/campaign/view/${item.id}`" class="text-blue-500 text-sm hover:font-medium">{{ item?.title }}</NuxtLink>
                        </td>

                        <td class="p-3">
                            <span :class="['text-xs py-1 px-2 rounded-full border', item?.is_complete == 1 ? 'border-green-300 text-green-500 bg-green-100' : 'border-red-300 text-red-500 bg-red-100']">{{ item?.is_complete == 1 ? 'Hoàn thành' : 'Chưa hoàn thành' }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ item?.detail_count ?? 0 }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ item?.assigned?.fullname }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.start_date }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.end_date }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ item?.created_at }}</span>
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

    <Offcanvas :open="openCanvas" @close="openCanvas = false" :title="`Giao cho người phụ trách`">
        <AssignedTo :campaigns="checkbox" @saved="handleSave" @close="closeCanvas" />
    </Offcanvas>

</template>

<script setup lang="ts">

    import Swal from 'sweetalert2'
    
    const { can } = usePermission()

    definePageMeta({
        middleware: ['auth'],
    })

    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    const openCanvas = ref(false)
    const route = useRoute()
    const campaigns = ref([])
    const search = ref('')

    const {
        selected: checkbox,
        toggleItem,
        toggleAll,
        isAllSelected,
        isChecked
    } = useCheckboxTable(campaigns)

    watch(() => route.query.page, async (page) => {
        await fetch(Number(page) || 1)
    }, { immediate: true })

    async function fetch(page = 1) {

        const res = await useNuxtApp().$apiFetch(`campaign`, {
            params: {
                page: page,
                search: search.value,
            }
        });

        if (res.status) {
            campaigns.value = res.data.data
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
                const res = await useNuxtApp().$apiFetch(`campaign/delete`, {
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

    const assigned = () => {
        if(checkbox.value.length == 0) {
            notify.error({
                title: 'Thông báo',
                description: 'Vui lòng chọn dữ liệu'
            })
            return
        }

        openCanvas.value = true
    }

    const handleSave = async(user) => {
        if(checkbox.value.length == 0) {
            notify.error({
                title: 'Thông báo',
                description: 'Vui lòng chọn dữ liệu'
            })
            return
        }

        const res = await useNuxtApp().$apiFetch(`campaign/assignedTo`, {
            method: 'POST',
            body: {
                user_id: user.id,
                campaigns: checkbox.value.map(i => i.id)
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })
            openCanvas.value = false
            fetch(route.query.page)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const closeCanvas = () => {
        openCanvas.value = false
    }

    useHead(() => ({
        title: 'Chiến dịch'
    }))
</script>