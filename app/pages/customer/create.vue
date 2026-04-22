<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Thêm khách hàng mới</h1>
                <p class="text-sm text-gray-500 mt-0.5">Danh sách Lead</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

    	<form @submit.prevent="submit">

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Thông tin chung</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Họ tên <span class="text-red-500">*</span></label>
                        <input v-model="fullname" type="text" placeholder="Họ tên" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Email <span class="text-red-500">*</span></label>
                        <input v-model="email" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Số điện thoại</label>
                        <input v-model="phone" type="text" placeholder="Số điện thoại" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Năm sinh</label>
                        <input v-model="birthday" type="text" placeholder="Năm sinh" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Giới tính</label>
                        <select v-model="gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none cursor-pointer text-gray-500 bg-white border-r border-gray-300">
                        	<option value="">Lựa chọn</option>
                        	<option value="1">Nam</option>
                        	<option value="2">Nữ</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Liên hệ</label>
                        <input v-model="contact" type="text" placeholder="Liên hệ" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Loại dữ liệu</label>
                        <select v-model="type_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none cursor-pointer text-gray-500 bg-white border-r border-gray-300">
                        	<option value="1">Lead</option>
                        	<option value="2">Contact</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Người phụ trách</label>
                        <select v-model="assigned_to" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none cursor-pointer text-gray-500 bg-white border-r border-gray-300">
                        	<option value="">Lựa chọn</option>

                        	<option :value="item.id" v-for="(item, index) in assignedTo" :key="index">{{ item.fullname }}</option>
                        </select>
                    </div>
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-3">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Thông tin tổ chức</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Doanh nghiệp</label>
                        <input v-model="company" type="text" placeholder="Doanh nghiệp" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ngành nghề</label>
                        <input v-model="profession" type="text" placeholder="Ngành nghề" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Mã số thuế</label>
                        <input v-model="mst" type="text" placeholder="Mã số thuế" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Website</label>
                        <input v-model="website" type="text" placeholder="Website" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Địa chỉ</label>
                        <input v-model="address" type="text" placeholder="Địa chỉ" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-3">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Thông tin mô tả</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Mô tả</label>
                        <textarea v-model="description" placeholder="Mô tả" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Ghi chú</label>
                        <textarea v-model="note" placeholder="Ghi chú" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"></textarea>
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
	definePageMeta({
        middleware: ['auth'],
    });

    const fullname = ref('')
    const email = ref('')
    const phone = ref('')
    const birthday = ref('')
    const gender = ref('')
    const contact = ref('')
    const type_id = ref(1)
    const assigned_to = ref('')

    const company = ref('')
    const profession = ref('')
    const mst = ref('')
    const website = ref('')
    const address = ref('')

    const description = ref('')
    const note = ref('')

    const assignedTo = ref([]);

    onMounted(() => {
        assignedList()
    });

    async function assignedList() {

        const res = await useNuxtApp().$apiFetch(`user`)

        if (res.status) {
            assignedTo.value = res.data
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const submit = async () => {
        const res = await useNuxtApp().$apiFetch(`customer/store`, {
            method: 'POST',
            body: {
                fullname: fullname.value,
                email: email.value,
                phone: phone.value,
                birthday: birthday.value,
                gender: gender.value,
                contact: contact.value,
                type_id: type_id.value,
                assigned_to: assigned_to.value,
                company: company.value,
                profession: profession.value,
                mst: mst.value,
                website: website.value,
                address: address.value,
                description: description.value,
                note: note.value
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })
            navigateTo(`/customer/view/${res.data.id}`)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    useHead(() => ({
        title: 'Thêm khách hàng'
    }))
</script>