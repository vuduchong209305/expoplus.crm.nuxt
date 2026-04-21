<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex items-center gap-4">
            <div class="relative">
                <img :src="viewImage(customer?.avatar)" class="w-16 h-16 rounded-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold truncate">
                    {{ customer?.fullname || 'Chưa có tên' }}
                </h2>
                <p class="text-sm text-gray-500">
                    {{ customer?.email || 'Chưa có email' }}
                </p>
                <!-- Badge -->
                <div class="mt-1">
                    <span class="px-2 py-1 text-xs rounded bg-amber-100 text-amber-600" v-if="customer?.type_id == 1">
                        Lead
                    </span>
                    <span class="px-2 py-1 text-xs rounded bg-green-100 text-green-600" v-else>
                        Contact
                    </span>
                </div>
            </div>
        </div>
        <!-- INFO SECTION -->
        <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3"> Thông tin khách hàng </h3>
            <div class="grid grid-cols-1 gap-4">
                <!-- ROW -->
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Họ tên</span>
                    <div class="flex-1 text-gray-700 text-sm text-right">
                        {{ customer?.fullname }}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Email</span>
                    <div class="flex-1 text-gray-700 text-sm text-right">
                        {{ customer?.email }}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Số điện thoại</span>
                    <div class="flex-1 text-gray-700 text-sm text-right">
                        {{ customer?.phone }}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Doanh nghiệp</span>
                    <div class="flex-1 text-gray-700 text-sm text-right">
                        {{ customer?.company }}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Người phụ trách</span>
                    <div class="flex-1 text-gray-700 text-sm text-right">
                        {{ customer?.assigned?.fullname }}
                    </div>
                </div>
            </div>
        </div>
        <!-- EXTRA SECTION -->
        <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3"> Thông tin bổ sung </h3>
            <div class="grid grid-cols-1 gap-4">
                <!-- ROW -->
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Ngày tạo</span>
                    <div class="flex-1 text-gray-700 text-sm text-right italic">
                        {{ customer?.created_at }}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm w-32">Cập nhật mới nhất</span>
                    <div class="flex-1 text-gray-700 text-sm text-right italic">
                        {{ customer?.updated_at }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        customer: Object,
        required: true
    })
</script>