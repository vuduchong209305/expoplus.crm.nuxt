<template>
    <div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">
                    {{ isEdit ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền' }}
                </h1>
                <p class="text-sm text-gray-500 mt-0.5"> Phân quyền trong tổ chức của bạn </p>
            </div>
        </div>
    </div>
    <div class="p-4 lg:p-6">
        <form @submit.prevent="submit">
            <!-- ROLE INFO -->
            <div class="bg-white border rounded p-5 mb-5">
                <h3 class="font-semibold text-base mb-4"> Thông tin nhóm quyền </h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium mb-2"> Tên nhóm quyền <span class="text-red-500">*</span></label>
                        <input v-model="form.name" type="text" placeholder="Ví dụ: Sale, Marketing..." class="w-full border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2"> Mô tả </label>
                        <input v-model="form.description" type="text" placeholder="Mô tả nhóm quyền" class="w-full border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                    </div>
                </div>
            </div>
            <!-- PERMISSION -->
            <div class="bg-white border rounded p-5 mb-5">
                <div class="flex items-center justify-between mb-5">
                    <div>
                        <h3 class="font-semibold text-base"> Phân quyền chức năng </h3>
                        <p class="text-sm text-gray-500 mt-1"> Chọn các quyền mà nhóm được phép truy cập </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" @click="selectAll" class="text-xs px-3 py-2 rounded-lg border hover:bg-gray-50"> Chọn tất cả </button>
                        <button type="button" @click="clearAll" class="text-xs px-3 py-2 rounded-lg border hover:bg-gray-50"> Bỏ chọn </button>
                    </div>
                </div>
                <!-- SEARCH -->
                <div class="mb-5">
                    <input v-model="search" type="text" placeholder="Tìm kiếm quyền..." class="w-full border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                </div>
                <!-- GROUP -->
                <div class="space-y-5">
                    <div v-for="(items, group) in filteredPermissions" :key="group" class="border rounded overflow-hidden">
                        <!-- HEADER -->
                        <div class="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <h4 class="font-semibold text-sm uppercase tracking-wide">
                                    {{ group }}
                                </h4>
                            </div>
                            <button type="button" @click="toggleGroup(items)" class="text-xs text-indigo-600 hover:underline"> Chọn nhóm </button>
                        </div>
                        <!-- PERMISSION LIST -->
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
                            <label v-for="item in items" :key="item.id" class="flex items-start gap-3 border rounded px-3 py-3 cursor-pointer hover:border-indigo-300 transition">
                                <input type="checkbox" :value="item.id" v-model="form.permissions" class="mt-1 w-4 h-4 accent-indigo-500">
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium text-gray-800">
                                        {{ item.title }}
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1 truncate">
                                        {{ item.key }}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ACTION -->
            <div class="flex items-center justify-end gap-3">
                <NuxtLink to="/system/role" class="px-5 py-2.5 rounded border text-sm hover:bg-gray-50"> Quay lại </NuxtLink>
                <button type="submit" class="px-6 py-2.5 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition active:scale-95">
                    Lưu dữ liệu
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
	definePageMeta({
	    middleware: ['auth'],
	})

	const route = useRoute()

	const id = route.params.id

	const isEdit = computed(() => {
	    return id && id !== 'create'
	})

	const search = ref('')

	const permissions = ref < any > ({})

	const form = reactive({
	    name: '',
	    description: '',
	    permissions: [] as number[]
	})

	/* ================= FETCH ================= */

	const fetch = async () => {

	    /*
	    |--------------------------------------------------------------------------
	    | GET PERMISSION
	    |--------------------------------------------------------------------------
	    */

	    const permissionRes = await useNuxtApp().$apiFetch('permission')

	    if (permissionRes.status) {
	        permissions.value = permissionRes.data
	    }

	    /*
	    |--------------------------------------------------------------------------
	    | EDIT
	    |--------------------------------------------------------------------------
	    */

	    if (isEdit.value) {

	        const res = await useNuxtApp().$apiFetch('role/edit', {
	            params: {
	                id
	            }
	        })

	        if (res.status) {

	            form.name = res.data.name
	            form.description = res.data.description

	            form.permissions = res.data.permissions.map(i => i.id)
	        }
	    }
	}

	/* ================= FILTER ================= */

	const filteredPermissions = computed(() => {

	    if (!search.value) {
	        return permissions.value
	    }

	    const result = {}

	    Object.keys(permissions.value).forEach(group => {

	        const items = permissions.value[group].filter(i => {

	            return i.title.toLowerCase().includes(search.value.toLowerCase()) ||
	                i.key.toLowerCase().includes(search.value.toLowerCase())
	        })

	        if (items.length) {
	            result[group] = items
	        }
	    })

	    return result
	})

	/* ================= ACTION ================= */

	const selectAll = () => {

	    const ids = []

	    Object.values(permissions.value).forEach((items: any) => {

	        items.forEach(i => {
	            ids.push(i.id)
	        })
	    })

	    form.permissions = ids
	}

	const clearAll = () => {
	    form.permissions = []
	}

	const toggleGroup = (items) => {

	    const ids = items.map(i => i.id)

	    const allSelected = ids.every(id =>
	        form.permissions.includes(id)
	    )

	    if (allSelected) {

	        form.permissions = form.permissions.filter(id =>
	            !ids.includes(id)
	        )

	    } else {

	        ids.forEach(id => {

	            if (!form.permissions.includes(id)) {
	                form.permissions.push(id)
	            }
	        })
	    }
	}

	/* ================= SUBMIT ================= */

	async function submit() {

	    const res = await useNuxtApp().$apiFetch('role/save', {
	        method: 'POST',
	        body: {
	            id: isEdit.value ? id : null,
	            ...form
	        }
	    })

	    if (res.status) {

	        notify.success({
	            title: 'Thông báo',
	            description: res.message
	        })

	        navigateTo('/system/role')

	    } else {

	        notify.error({
	            title: 'Thông báo',
	            description: res.message
	        })
	    }
	}

	onMounted(async () => {
	    await fetch()
	})
</script>