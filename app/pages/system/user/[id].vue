<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">{{ isEdit ? 'Chỉnh sửa thành viên' : 'Thêm thành viên' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Thành viên trong ban tổ chức</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6">

    	<form @submit.prevent="submit">

    		<div class="bg-white px-5 py-4 rounded mb-5">
    			<h4 class="font-semibold text-lg pb-3 mb-3">Thông tin chung</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                	<div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Email <span class="text-red-500">*</span></label>
                        <input v-model="form.email" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Họ tên <span class="text-red-500">*</span></label>
                        <input v-model="form.fullname" type="text" placeholder="Họ tên" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Số điện thoại</label>
                        <input v-model="form.phone" type="text" placeholder="Số điện thoại" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Năm sinh</label>
                        <input v-model="form.birthday" type="text" placeholder="Năm sinh" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Cài đặt Mật khẩu</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Mật khẩu mới</label>
                        <input v-model="form.password" type="password" placeholder="******" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-700 font-semibold mb-2">Nhập lại mật khẩu</label>
                        <input v-model="form.password_confirmation" type="password" placeholder="******" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors">
                    </div>
                    
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-5" v-if="form?.is_admin != 1">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Phân quyền</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                	<div>
                		<label class="block text-sm text-gray-700 font-semibold mb-2">Chọn nhóm quyền <span class="text-red-500">*</span></label>
	                    <select v-model="form.role_id" class="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" required>
	                   		<option v-for="(item, index) in roles" :value="item?.id" :key="item?.id">{{ item?.name }}</option>
	                   	</select>
                	</div>
                </div>
	    	</div>

	    	<div class="bg-white px-5 py-4 rounded mb-5">
	    		<h4 class="font-semibold text-lg pb-3 mb-3">Ảnh đại diện</h4>
	    		<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="flex items-center justify-between gap-3">
		                <div class="relative">
						    <!-- Avatar -->
						    <img class="h-20 w-20 rounded-full border border-gray-200 p-1 object-cover" :src="preview || viewImage(form?.avatar)" />
						    <!-- Camera -->
						    <div @click="triggerFile" class="absolute bottom-2 right-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white hover:scale-110 transition cursor-pointer">
						        <i class="ti ti-camera text-white text-xs"></i>
						    </div>
						    <!-- Hidden input -->
						    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
						</div>
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
    })

    const route = useRoute()
    const id = route.params.id
    const isEdit = computed(() => id && id !== 'create')
    const roles = ref([])

    const form = reactive({
	    fullname: '',
	    email: '',
	    phone: '',
	    birthday: '',
	    password: '',
	    password_confirmation: '',
	    avatar: '',
	    role_id: '',
	    is_admin: ''
	})

    const fileInput = ref<HTMLInputElement | null>(null)

    const avatar = ref('')        // ảnh từ DB (edit)
    const file = ref<File | null>(null)
    const preview = ref('')      // preview ảnh mới

    const triggerFile = () => {
        fileInput.value?.click()
    }

    const handleFile = (e: Event) => {
        const target = e.target as HTMLInputElement
        const selectedFile = target.files?.[0]

        if (!selectedFile) return

        file.value = selectedFile

        // preview
        preview.value = URL.createObjectURL(selectedFile)
    }

    const fetch = async() => {
        if (isEdit.value) {
            const res = await useNuxtApp().$apiFetch(`user/edit`, {
                params: {
                    id
                }
            })

            if (res.status) {
                Object.assign(form, res.data)
            }
        }
    }

    const fetchRole = async() => {
        const res = await useNuxtApp().$apiFetch(`role`)
        if (res.status) {
            roles.value = res.data
        }
        
    }

    async function submit() {
		if (!validate()) return

		const formData = new FormData()

		formData.append('id', isEdit.value ? String(id) : '')
	    formData.append('fullname', form.fullname)
	    formData.append('email', form.email)
	    formData.append('phone', form.phone || '')
	    formData.append('birthday', form.birthday || '')
	    formData.append('role_id', form.role_id || '')
	    formData.append('avatar_current', form.avatar || '')

	    if (form.password) {
	        formData.append('password', form.password)
	        formData.append('password_confirmation', form.password_confirmation)
	    }

	    if (file.value) {
	        formData.append('avatar', file.value)
	    }

		const res = await useNuxtApp().$apiFetch('user/save', {
	        method: 'POST',
	        body: formData
	    })

	    if (res.status) {

	        notify.success({
	            title: 'Thông báo',
	            description: res.message
	        })
	        navigateTo(`/system/user`)
	    } else {
	        notify.error({
	            title: 'Lỗi',
	            description: res.message
	        })
	    }
	}

    function validate() {
	    if (!form.fullname || !form.email) {
	        notify.error({ description: 'Vui lòng nhập đầy đủ thông tin' })
	        return false
	    }

	    if (form.password && form.password !== form.password_confirmation) {
	        notify.error({ description: 'Mật khẩu không khớp' })
	        return false
	    }

	    return true
	}

    onMounted(async () => {
        await fetch()
        await fetchRole()
    })
</script>