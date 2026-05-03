<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">{{ isEdit ? 'Chỉnh sửa chiến dịch' : 'Thêm chiến dịch' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Chiến dịch tiếp thị khách hàng</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

        <form @submit.prevent="submit">

            <div class="bg-white px-5 py-4 rounded mb-5">
                <h4 class="font-semibold text-md mb-3">Thông tin chung</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Tên chiến dịch <span class="text-red-500">*</span></label>
                        <input v-model="title" type="text" placeholder="Tên chiến dịch" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ghi chú</label>
                        <input v-model="note" type="text" placeholder="Ghi chú" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ngày bắt đầu</label>
                        <input ref="startRef" type="text" placeholder="Ngày bắt đầu" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ngày kết thúc</label>
                        <input ref="endRef" type="text" placeholder="Ngày kết thúc" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
            </div>

            <div class="bg-white px-5 py-4 rounded mb-5">
                <h4 class="font-semibold text-md mb-3">Thêm khách hàng mục tiêu ({{ selectedCustomers.length }})</h4>

                <div class="flex justify-between items-center">
                    <div>
                        <button type="button" class="px-3 py-1 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all" @click="openCustomerList('group')"><i class="ti ti-plus me-2"></i>Từ nhóm KH</button>
                        &nbsp;&nbsp;
                        <button type="button" class="px-3 py-1 text-sm font-medium bg-white text-black border border-gray-500 rounded-lg hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all" @click="openCustomerList('list')"><i class="ti ti-plus me-2"></i>Từ danh sách KH</button>
                    </div>

                    <div>
                        <button type="button" class="py-1 px-3 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-all" @click="deleteBulk()"><i class="ti ti-trash"></i></button>
                    </div>
                </div>
                
            </div>

            <div class="bg-white border border-b-0 rounded-lg mb-5">

                <table class="w-full">
                    <thead class="border-b">
                        <tr>
                            <th class="p-3 text-left w-12" width="5%">
                                <input type="checkbox" class="w-4 h-4 rounded" :checked="isAllSelected" @change="toggleAll">
                            </th>
                            <th class="p-3 text-sm text-left font-medium" width="15%">Họ tên</th>
                            <th class="p-3 text-sm text-left font-medium" width="20%">Email</th>
                            <th class="p-3 text-sm text-left font-medium" width="15%">Số điện thoại</th>
                            <th class="p-3 text-sm text-left font-medium" width="45%">Doanh nghiệp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(customer, index) in selectedCustomers" :key="index" class="border-b hover:bg-gray-100 transition-all">

                            <td class="p-3">
                                <input type="checkbox" class="w-4 h-4 rounded" :checked="isChecked(customer)" @change="toggleItem(customer)">
                            </td>

                            <td class="p-3">
                                <NuxtLink :to="`/customer/view/${customer?.id}`" target="_blank" class="text-indigo-600 text-sm hover:font-medium">{{ customer?.fullname }}</NuxtLink>
                            </td>

                            <td class="p-3">
                                <span class="text-gray-500 text-sm">{{ customer?.email }}</span>
                            </td>

                            <td class="p-3">
                                <span class="text-gray-500 text-sm">{{ customer?.phone }}</span>
                            </td>

                            <td class="p-3">
                                <span class="text-gray-500 text-xs">{{ customer?.company }}</span>
                            </td>

                        </tr>
                        
                    </tbody>
                </table>
            
            </div>

            <button type="submit" class="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white text-sm font-medium">
                Lưu dữ liệu
            </button>

        </form>

        <Offcanvas :open="open" @close="open = false">
            <CustomerList v-if="sourceType == 'list'" :selected="selectedCustomers" @saved="handleSaved" @close="closeCanvas" :campaignId="campaignId"/>

            <CustomerGroup v-else-if="sourceType == 'group'" :selected="selectedCustomers" @saved="handleSavedGroup" @close="closeCanvas" :campaignId="campaignId"/>
        </Offcanvas>

    </div>
</template>

<script setup lang="ts">

    import flatpickr from 'flatpickr'
    import 'flatpickr/dist/l10n/vn.js'

    import Swal from 'sweetalert2'

    definePageMeta({
        middleware: ['auth'],
    })

    const title = ref('')
    const note = ref('')
    const assigned_to = ref('')
    const start_date = ref('')
    const end_date = ref('')

    const startRef = ref<HTMLInputElement | null>(null)
    const endRef = ref<HTMLInputElement | null>(null)

    const open = ref(false)
    const route = useRoute()
    const id = route.params.id
    const isEdit = computed(() => id && id !== 'create')
    const sourceType = ref('')

    const selectedCustomers = ref([])

    let startPicker: any = null
    let endPicker: any = null

    const {
        selected: checkbox,
        toggleItem,
        toggleAll,
        isAllSelected,
        isChecked
    } = useCheckboxTable(selectedCustomers)

    const campaignId = computed(() => {
        return isEdit.value ? id : null
    })
        
    const openCustomerList = (type) => {
        sourceType.value = type
        open.value = true
    }

    const handleSaved = (data) => {
        selectedCustomers.value = data
        open.value = false
    }

    const handleSavedGroup = async (groupIds) => {

        const res = await useNuxtApp().$apiFetch('campaign/add-group', {
            method: 'POST',
            body: {
                id: campaignId.value,
                group_ids: groupIds
            }
        })

        if(res.status) {
            await fetch() // reload lại
            open.value = false
        }        
    }

    const closeCanvas = () => {
        open.value = false
    }

    const submit = async () => {
        const res = await useNuxtApp().$apiFetch(`campaign/save`, {
            method: 'POST',
            body: {
                id: isEdit.value ? id : null,
                title: title.value,
                note: note.value,
                assigned_to: assigned_to.value,
                start_date: start_date.value,
                end_date: end_date.value,
                customers: selectedCustomers.value.map(i => i.id)
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })

            navigateTo(`/marketing/campaign/${res.data.id}`)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const fetch = async() => {
        if (isEdit.value) {
            const res = await useNuxtApp().$apiFetch(`campaign/edit`, {
                params: {
                    id
                }
            })

            if (res.status) {
                title.value = res.data.title
                note.value = res.data.note
                assigned_to.value = res.data.assigned_to

                start_date.value = res.data.start_date
                end_date.value = res.data.end_date

                startPicker.setDate(start_date.value)
                endPicker.setDate(end_date.value)

                selectedCustomers.value = res.data.customers
            }
        }
    }

    onMounted(async () => {
        await fetch()
    })

    onMounted(() => {

        endPicker = flatpickr(endRef.value!, {
            locale: 'vn',
            dateFormat: 'Y-m-d',
            minDate: 'today',
            onChange: (dates) => {
                if (dates.length) {
                    end_date.value = formatDate(dates[0])
                }
            }
        })

        startPicker = flatpickr(startRef.value!, {
            locale: 'vn',
            dateFormat: 'Y-m-d',
            minDate: 'today',
            onChange: (dates) => {
                if (dates.length) {
                    start_date.value = formatDate(dates[0])
                }
                endPicker.set('minDate', dates[0])
            }
        })
    })

    const deleteBulk = async() => {

        const selectedIds = checkbox.value.map(i => i.id)
        if(selectedIds.length == 0) {
            alert('Vui lòng chọn dữ liệu')
            return
        }
        
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

                if (isEdit.value) {
                    const res = await useNuxtApp().$apiFetch(`campaign/deleteCustomer`, {
                        method: 'POST',
                        body: {
                            campaign_id: id,
                            ids: selectedIds
                        }
                    })

                    if (res.status) {
                        notify.success({
                            title: 'Thông báo',
                            description: res.message
                        })

                        await fetch()
                    } else {
                        notify.error({
                            title: 'Thông báo',
                            description: res.message
                        })
                    }
                } else {
                    selectedCustomers.value = selectedCustomers.value.filter(
                        item => !selectedIds.includes(item.id)
                    )

                    checkbox.value = []
                }
            }
        });
    }

    const formatDate = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }
</script>