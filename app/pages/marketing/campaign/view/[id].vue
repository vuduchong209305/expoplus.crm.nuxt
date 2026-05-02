<template>
	<div class="bg-white border-b p-4">
        <div class="flex items-center justify-between gap-3">
            <div class="flex items-center justify-between gap-3">
                <div class="relative">
                    <img class="h-20 w-20 rounded-full border border-gray-200 bg-gray-100 p-4 object-cover" src="/megaphone.png" />
                </div>
                <div>
                    <h1 class="text-lg sm:text-xl font-semibold">Chiến dịch: {{ campaign?.title }}</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Bắt đầu: <span class="text-green-600">{{ campaign?.start_date }}</span> <i class="ti ti-arrow-right"></i> Kết thúc: <span class="text-red-600">{{ campaign?.end_date }}</span></p>
                </div>
            </div>

            <div class="flex items-center justify-between gap-5">
                
                <div class="dropdown relative inline-block w-24 text-sm">
                    <!-- BUTTON -->
                    <button class="dropdown-btn px-4 py-2 bg-indigo-500 text-white rounded shadow flex items-center justify-between w-full"> Tác vụ <i class="ti ti-chevron-down"></i>
                    </button>
                    <!-- DROPDOWN -->
                    <ul class="dropdown-menu hidden absolute right-0 top-full mt-2 w-40 bg-white border border-gray-300 rounded shadow-md py-1 z-50">
                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm">
                            <NuxtLink :to="`/marketing/campaign/${campaign.id}`" class="block w-full">
                                <i class="ti ti-edit"></i>&nbsp;&nbsp;Sửa chiến dịch
                            </NuxtLink>
                        </li>
                        <li class="px-4 py-2 hover:bg-red-500/10 text-red-500 cursor-pointer text-sm" @click="deleteItem(campaign?.id)">
                            <i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>

    <div class="p-4">

        <div class="bg-white p-4 rounded-lg mb-3 border">
            <div class="flex flex-wrap items-center justify-between gap-2">
                
                <form @submit.prevent="submitSearch" class="relative w-80">
                    <input v-model="keyword" placeholder="Tìm tên, email, số điện thoại..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                    <!-- BUTTON INSIDE -->
                    <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600">
                        <i class="ti ti-search text-lg"></i>
                    </button>
                </form>
                
                <div>
                    <p class="text-sm"><span class="text-gray-500">Phụ trách: </span><span>{{ campaign?.assigned?.fullname }}</span></p>
                </div>
            </div>
        </div>

        <div class="bg-white px-5 py-4 rounded mb-3">
            <table class="w-full">
                <thead class="border-b">
                    <tr>
                        <th class="p-3 text-left w-12" width="5%">
                            <input type="checkbox" class="w-4 h-4 rounded">
                        </th>
                        <th class="p-3 text-sm text-center font-medium" width="5%">#</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Họ tên</th>
                        <th class="p-3 text-sm text-left font-medium" width="15%">Email</th>
                        <th class="p-3 text-sm text-left font-medium" width="10%">Số điện thoại</th>
                        <th class="p-3 text-sm text-left font-medium" width="25%">Doanh nghiệp</th>
                        <th class="p-3 text-sm text-left font-medium" width="15%">Tình trạng</th>
                        <th class="p-3 text-sm text-left font-medium" width="15%">Đánh giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer, index) in customers" :key="index" class="border-b hover:bg-gray-100 transition-all">

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
                                        <li class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer text-sm" @click="deleteItem(customer?.customer?.id)"><i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa</li>
                                    </ul>
                                </div>
                            </div>
                        </td>

                        <td class="p-3">
                            <a @click="selectedCustomer = customer?.customer; openCustomer(customer?.customer?.id)" href="javascript:;" class="text-indigo-600 text-sm hover:font-medium">{{ customer?.customer?.fullname }}</a>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.customer?.email }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-sm">{{ customer?.customer?.phone }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">{{ customer?.customer?.company }}</span>
                        </td>

                        <td class="p-3">
                            <span class="text-white text-xs px-2 py-1 text-xs font-medium inline-flex items-center rounded-md border" :class="customer?.progress?.color">
                                {{ customer?.progress?.name }}
                            </span>
                        </td>

                        <td class="p-3">
                            <span class="text-gray-500 text-xs">
                                <span v-for="i in 5" :key="i" class="text-xl" :class="i <= customer?.rating ? 'text-yellow-400' : 'text-gray-300'"> ★ </span>
                            </span>
                        </td>

                    </tr>
                    
                </tbody>
            </table>
        </div>

        <Offcanvas :open="open" @close="open = false">
            <CampaignCustomer :customer="selectedCustomer" :progress="progress" @saved="handleSaved" @close="closeCanvas" :campaign-id="id" />
        </Offcanvas>

    </div>
</template>

<script setup lang="ts">

    import Swal from 'sweetalert2'

	definePageMeta({
        middleware: ['auth'],
    });

	const route = useRoute()

	const campaign = ref({});
    const customers = ref([]);
    const keyword = ref('')
	const { id } = route.params

    const open = ref(false)
    const selectedCustomer = ref('');
    const progress = ref([])

    onMounted(() => {
    	view();
    });

    async function view() {

        const res = await useNuxtApp().$apiFetch(`campaign/detail`, {
        	params: {
                id,
                keyword: keyword.value
            }
        })

        if (res.status) {
            campaign.value = res.data.campaign
            customers.value = res.data.customers
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function submitSearch() {
        view()
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

                    navigateTo(`/marketing/campaign`)
                } else {
                    notify.error({
                        title: 'Thông báo',
                        description: res.message
                    })
                }
            }
        });
    }

    const openCustomer = async(customer_id) => {

        const res = await useNuxtApp().$apiFetch(`campaign/customer`, {
            method: 'POST',
            body: {
                customer_id: customer_id,
                id: id
            }
        })

        if (res.status) {
            selectedCustomer.value = res.data.customer
            progress.value = res.data.progress
            open.value = true
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const handleSaved = () => {
        open.value = false
        view()
    }

    const closeCanvas = () => {
        open.value = false
    }
</script>