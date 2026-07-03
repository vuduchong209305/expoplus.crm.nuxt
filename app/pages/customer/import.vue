<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Thêm khách hàng mới</h1>
                <p class="text-sm text-gray-700 mt-0.5">Thêm mới bằng file Google Sheet</p>
            </div>

            <div>
            	<a target="_blank" href="https://docs.google.com/spreadsheets/d/1-9ME6kDXJcfLY9HJVYLccnMxHrCKREUCsNOqm6HpNxw/edit?gid=0#gid=0" class="text-indigo-500 underline italic">Xem file mẫu</a>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

    	<form @submit.prevent="submit">

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Nhập Google Sheet URL</h4>
                <div class="mb-3">
                    <label class="block text-sm text-gray-700 font-semibold mb-2">URL công khai<span class="text-red-500">*</span></label>
                    <input v-model="url" type="text" placeholder="https://docs.google.com/spreadsheets/d/..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                </div>

                <div class="flex gap-3">
                	<button type="submit" class="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white text-sm font-medium">
		                <i class='ti ti-eye me-2'></i>Xem dữ liệu
		            </button>

		            <button v-if="customers.length > 0" @click="importData" type="button" class="px-6 py-2 active:scale-95 transition bg-green-500 rounded text-white text-sm font-medium">
		                <i class='ti ti-file-import me-2'></i>Import dữ liệu
		            </button>
                </div>
            </div>
        </form>

        <div class="bg-white px-5 py-4 rounded mb-5">
        	<table class="w-full">
	            <thead class="border-b">
	                <tr>
	                    <th class="p-3 text-left font-medium">#</th>
	                    <th class="p-3 text-left font-medium">Email</th>
	                    <th class="p-3 text-left font-medium">Họ tên</th>
	                    <th class="p-3 text-left font-medium">Số điện thoại</th>
	                    <th class="p-3 text-left font-medium">Doanh nghiệp</th>
	                    <th class="p-3 text-left font-medium">Địa chỉ</th>
	                    <th class="p-3 text-left font-medium">#</th>
	                </tr>
	            </thead>
	            <tbody>
	                <tr v-for="(customer, index) in customers" :key="index" class="border-b hover:bg-gray-100 transition-all">

	                    <td class="p-3 text-sm">
	                        {{ index + 1 }}
	                    </td>

	                    <td class="p-3 text-sm">
	                        {{ customer?.email }}
	                    </td>

	                    <td class="p-3 text-sm">
	                        {{ customer?.fullname }}
	                    </td>

	                    <td class="p-3 text-sm">
	                        {{ customer?.phone }}
	                    </td>

	                    <td class="p-3 text-sm">
	                        {{ customer?.company }}
	                    </td>

	                    <td class="p-3 text-sm">
	                        {{ customer?.address }}
	                    </td>

	                    <td class="p-3 text-sm">
	                    	<b v-html="customer?.status == 'new' ? '<span class=text-green-500>New</span>' : '<span class=text-red-500>Exists</span>'"></b>
	                    </td>
	                </tr>
	                
	            </tbody>
	        </table>
        </div>
        
    </div>

</template>

<script setup lang="ts">

	const url = ref('')
	const customers = ref([])

	const submit = async() => {
        const res = await useNuxtApp().$apiFetch(`customer/preview`, {
            method: 'POST',
            body: {
                url: url.value
            }
        })

        if (res.status) {
        	customers.value = res.data
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

    const importData = async() => {
    	const res = await useNuxtApp().$apiFetch(`customer/import`, {
            method: 'POST',
            body: {
                url: url.value
            }
        })

        if (res.status) {
        	customers.value = res.data
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
</script>