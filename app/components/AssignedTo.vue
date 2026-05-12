<template>
    <div class="flex flex-col h-full">

        <!-- HEADER -->
        <div class="mb-5">
            <h3 class="text-lg font-semibold text-gray-800">
                Giao cho nhân viên
            </h3>

            <p class="text-sm text-gray-500 mt-1">
                Chọn nhân viên phụ trách dữ liệu
            </p>
        </div>

        <!-- USER SELECT -->
        <div class="bg-gray-50 border rounded-2xl p-4 mb-5">

            <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nhân viên phụ trách
            </label>

            <select
                v-model="selectedUser"
                class="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
            >
                <option value="">
                    -- Chọn nhân viên --
                </option>

                <option
                    v-for="u in assignedTo"
                    :key="u.value"
                    :value="u.value"
                >
                    {{ u.label }}
                </option>
            </select>

        </div>

        <!-- CUSTOMER LIST -->
        <div class="flex-1 overflow-hidden flex flex-col border rounded-2xl">

            <!-- title -->
            <div class="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">

                <div>
                    <h4 class="font-semibold text-sm text-gray-700">
                        Danh sách khách hàng
                    </h4>

                    <p class="text-xs text-gray-400 mt-1">
                        {{ customers.length }} khách hàng được chọn
                    </p>
                </div>

                <div class="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
                    {{ customers.length }} items
                </div>

            </div>

            <!-- list -->
            <div class="overflow-y-auto flex-1 divide-y">

                <div
                    v-for="item in customers"
                    :key="item.id"
                    class="px-4 py-3 hover:bg-gray-50 transition-all flex items-start gap-3"
                >

                    <!-- avatar -->
                    <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {{ item?.fullname?.charAt(0) }}
                    </div>

                    <!-- info -->
                    <div class="flex-1 min-w-0">

                        <div class="flex items-center gap-2">

                            <h4 class="font-medium text-sm text-gray-800 truncate">
                                {{ item?.fullname }}
                            </h4>

                            <span
                                v-if="item?.company"
                                class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                            >
                                {{ item?.company }}
                            </span>

                        </div>

                        <div class="mt-1 space-y-1">

                            <p class="text-xs text-gray-500 truncate">
                                {{ item?.email || 'Không có email' }}
                            </p>

                            <p class="text-xs text-gray-400">
                                {{ item?.phone || 'Không có SĐT' }}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div class="px-4 py-3 flex justify-end gap-2">
            <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"> Hủy </button>
            <button @click="handleSave" :disabled="!selectedUser" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"> Giao việc </button>
        </div>

    </div>
</template>

<script setup lang="ts">

	const props = defineProps({
	    customers: {
	        type: Array,
	        default: () => []
	    }
	})

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
	            label: u.fullname,
	            value: u.id
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