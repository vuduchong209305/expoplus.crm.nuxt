<template>
	<div class="bg-white border-b p-4">
        <div class="flex items-center justify-between gap-3">
            <div class="flex items-center justify-between gap-3">
                <div class="relative">
				    <!-- Avatar -->
				    <img class="h-20 w-20 rounded-full border border-gray-200 p-1 object-cover" :src="viewImage(customer?.avatar)" />
				    <!-- Camera -->
				    <div @click="triggerFile" class="absolute bottom-2 right-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white hover:scale-110 transition cursor-pointer">
				        <i class="ti ti-camera text-white text-xs"></i>
				    </div>
				    <!-- Hidden input -->
				    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
				</div>
			    <div>
			    	<h1 class="text-lg sm:text-xl font-semibold">{{ customer?.fullname }}</h1>
                	<p class="text-sm text-gray-500 mt-0.5">{{ customer?.company }}</p>
			    </div>
            </div>
            <div class="flex items-center justify-between gap-5">
            	<a href="javascript:;" @click="bookmark(customer?.id)" class="inline-block">
                    <svg v-if="customer?.bookmark == 1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-star text-yellow-500">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                    </svg>
                    <i v-else class="ti ti-star text-gray-400 text-lg hover:text-yellow-500"></i>
                </a>
            	
            	<div class="dropdown relative inline-block w-24 text-sm">
				    <!-- BUTTON -->
				    <button class="dropdown-btn px-4 py-2 bg-indigo-500 text-white rounded shadow flex items-center justify-between w-full"> Tác vụ <i class="ti ti-chevron-down"></i>
				    </button>
				    <!-- DROPDOWN -->
				    <ul class="dropdown-menu hidden absolute right-0 top-full mt-2 w-40 bg-white border border-gray-300 rounded shadow-md py-1 z-50">
				        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm" @click="handleCreate">
				            <i class="ti ti-calendar"></i>&nbsp;&nbsp;Tạo lịch
				        </li>
				        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm" @click="open = true">
				            <i class="ti ti-library-plus"></i>&nbsp;&nbsp;Thêm vào nhóm
				        </li>
				        <li class="px-4 py-2 hover:bg-red-500/10 text-red-500 cursor-pointer text-sm" @click="deleteItem(customer?.id)">
				            <i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa
				        </li>
				    </ul>
				</div>
            </div>
            
        </div>
    </div>

    <div class="p-4">
	    <!-- Tabs -->
	    <div class="text-sm font-medium relative bg-white px-5 py-4 rounded">
	        <ul class="flex gap-6">
	            <li v-for="tab in tabs" :key="tab.key">
	                <button @click="activeTab = tab.key" :class="activeTab === tab.key ? 'text-blue-600' : 'text-gray-600'" class="relative hover:text-blue-500 transition pb-2">
	                    {{ tab.label }}
	                    <!-- underline -->
	                    <span v-if="activeTab === tab.key" class="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-300"></span>
	                </button>
	            </li>
	        </ul>
	    </div>
	    <!-- Content -->
	    <div class="mt-3">
	        <!-- Tổng quan -->
	        <div v-if="activeTab === 'overview'">

	        	<div class="bg-white px-5 py-4 rounded mb-3">

	        		<h3 class="font-semibold text-lg pb-3">Thông tin chung</h3>

	        		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	        			<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Họ tên </td>
						            <td class="py-3 font-medium text-gray-900"><Editable v-model="customer.fullname" field="fullname" @save="handleSave"/></td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Giới tính </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.gender" type="select" field="gender" @save="handleSave" :options="[{ label: 'Nam', value: 1 }, { label: 'Nữ', value: 2 }]"/> </td>
						        </tr>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500"> Email </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.email" field="email" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500"> Liên hệ </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.contact" field="contact" @save="handleSave"/> </td>
						        </tr>
						    </tbody>
						</table>

						<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Số điện thoại </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.phone" field="phone" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Năm sinh </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.birthday" field="birthday" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500"> Loại dữ liệu </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.type_id" type="select" field="type_id" @save="handleSave" :options="[{ label: 'Lead', value: 1 }, { label: 'Contact', value: 2 }]"/> </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500"> Giao cho </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.assigned_to" type="select" field="assigned_to" @save="handleSave" :options="assignedTo"/> </td>
						        </tr>
						    </tbody>
						</table>
	        		</div>
	        	</div>
	        	
	        	<div class="bg-white px-5 py-4 rounded mb-3">

	        		<h3 class="font-semibold text-lg pb-3">Thông tin tổ chức</h3>

		        	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	        			<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Doanh nghiệp </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.company" field="company" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Mã số thuế </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.mst" field="mst" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500"> Địa chỉ </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.address" field="address" @save="handleSave"/> </td>
						        </tr>
						    </tbody>
						</table>

						<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Ngành nghề </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.profession" field="profession" @save="handleSave"/> </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Website </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.website" field="website" @save="handleSave"/> </td>
						        </tr>
						    </tbody>
						</table>
	        		</div>
	        	</div>

	        	<div class="bg-white px-5 py-4 rounded mb-3">

	        		<h3 class="font-semibold text-lg pb-3">Thông tin mô tả</h3>

		        	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	        			<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Mô tả </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.description" type="textarea" field="description" @save="handleSave"/> </td>
						        </tr>
						    </tbody>
						</table>

						<table class="w-full text-sm">
						    <tbody>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Ghi chú </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.note" type="textarea" field="note" @save="handleSave"/> </td>
						        </tr>
						    </tbody>
						</table>
	        		</div>
	        	</div>

	        	<div class="bg-white px-5 py-4 rounded mb-3">

	        		<h3 class="font-semibold text-lg pb-3">Thông tin hệ thống</h3>

		        	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	        			
						<table class="w-full text-sm">
						    <tbody>
						    	<tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Nguồn dữ liệu </td>
						            <td class="py-3 font-medium text-gray-900"> <Editable v-model="customer.source_id" type="select" field="source_id" @save="handleSave" :options="sources"/> </td>
						        </tr>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500 w-40"> Người tạo </td>
						            <td class="py-3 font-medium text-gray-900"> {{ customer?.owner?.fullname }} </td>
						        </tr>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Công ty </td>
						            <td class="py-3 font-medium text-gray-900"> {{ customer?.company_organizer?.name }} </td>
						        </tr>
						    </tbody>
						</table>

						<table class="w-full text-sm">
						    <tbody>
						        <tr>
						        	<td class="py-3 pr-4 text-gray-500 w-40"> Ngày tạo </td>
						            <td class="py-3 font-medium text-gray-900"> {{ customer?.created_at }} </td>
						        </tr>
						        <tr>
						            <td class="py-3 pr-4 text-gray-500"> Ngày sửa </td>
						            <td class="py-3 font-medium text-gray-900"> {{ customer?.updated_at }} </td>
						        </tr>
						    </tbody>
						</table>
	        		</div>
	        	</div>
	        </div>
	        <!-- Bình luận -->
	        <div v-if="activeTab === 'comments'">
	        	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	        		<div class="bg-white px-5 py-4 rounded mb-3">
		            	<h3 class="font-semibold text-lg mb-2">Bình luận</h3>

		            	<form @submit.prevent="submitComment">
		            		<textarea v-model="content" class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none resize-y focus:border-indigo-500 transition-colors" placeholder="Nội dung bình luận" required rows="5"></textarea>

		            		<div class="flex justify-end">
							    <button type="submit" class="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white text-sm font-medium">
							      	<i class="ti ti-send"></i>&nbsp;&nbsp;Gửi bình luận
							    </button>
							</div>
		            	</form>
		            	
		            </div>

		            <div class="bg-white px-5 py-4 rounded mb-3">
					    <h3 class="font-semibold text-lg mb-4">Bình luận gần đây</h3>
					    <div class="relative">
					        <!-- Line timeline -->
					        <div class="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
					        <div class="space-y-6">
					            <!-- ITEM -->
					            <div v-for="comment in comments" :key="comment.id" class="relative flex gap-4">
					                <!-- Avatar -->
					                <div class="relative z-10">
					                    <img :src="viewImage(comment?.owner?.avatar)" class="w-8 h-8 rounded-full object-cover" />
					                </div>
					                <!-- Content -->
					                <div class="flex-1 bg-gray-50 rounded-lg px-4 py-3">
					                    <!-- Header -->
					                    <div class="flex items-center justify-between mb-1">
					                        <div class="flex items-center gap-2">
					                            <span class="font-medium text-sm text-gray-900">
					                                {{ comment?.owner?.fullname }}
					                            </span>
					                            <span class="text-xs text-gray-400">
					                                {{ comment?.created_at }}
					                            </span>
					                        </div>
					                        <!-- Action -->
					                        <button class="text-gray-400 hover:text-gray-600">
					                            <i class="ti ti-dots text-sm"></i>
					                        </button>
					                    </div>
					                    <!-- Content -->
					                    <p class="text-sm text-gray-700 whitespace-pre-line">
					                        {{ comment?.content }}
					                    </p>
					                </div>
					            </div>
					        </div>
					    </div>

					    <Pagination
				            :current-page="pagination.current_page"
				            :last-page="pagination.last_page"
				            :per-page="pagination.per_page"
				            :total="pagination.total"
				            @page-change="getComments"
				        />
					</div>
	        	</div>
	            
	        </div>
	        
	        <!-- Nhật ký -->
			<div v-if="activeTab === 'logs'">
			    <div class="bg-white px-5 py-4 rounded mb-3">
			        <h3 class="font-semibold text-lg mb-4">Nhật ký</h3>
			        <div class="relative">
			            <!-- Line -->
			            <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
			            <div class="space-y-6">
			                <!-- ITEM -->
			                <div v-for="log in activityLogs" :key="log.id" class="relative flex gap-4">
			                    <!-- ICON -->
			                    <div class="relative z-10">
			                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" :class="getLogColor(log.action)">
			                            <i :class="getLogIcon(log.action)"></i>
			                        </div>
			                    </div>
			                    <!-- CONTENT -->
			                    <div class="flex-1">
			                        <!-- TITLE -->
			                        <div class="text-sm text-gray-800">
			                            <span class="font-medium">{{ log.user.fullname }}</span>
			                            &nbsp;
			                            <span class="text-gray-500"> {{ log.description }}</span>
			                        </div>
			                        <!-- META -->
			                        <div class="text-xs text-gray-400 mt-1 flex items-center gap-2">
			                            <span>{{ log.created_at }}</span>
			                            <span>•</span>
			                            <span class="capitalize">{{ log.action }}</span>
			                        </div>
			                        <!-- OPTIONAL DETAIL -->
			                        <div v-if="log.meta" class="mt-2 text-xs bg-gray-50 border rounded p-2 text-gray-600">
			                            {{ log.meta }}
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>

			    </div>
			</div>
	    </div>
	</div>

	<Offcanvas :open="open" @close="open = false">
        <Group :customer_id="customer.id"/>
    </Offcanvas>
</template>

<script setup lang='ts'>

	import Swal from 'sweetalert2'

	definePageMeta({
        middleware: ['auth'],
    });

	const activeTab = ref('overview')

	const tabs = [
		{ key: 'overview', label: 'Tổng quan' },
		{ key: 'comments', label: 'Bình luận' },
		{ key: 'logs', label: 'Nhật ký' }
	]

	const route = useRoute()
	const customer = ref({});
	const assignedTo = ref([]);
	const sources = ref([]);
	const open = ref(false)

	const { id } = useRoute().params

	onMounted(() => {
    	view()
    	assignedList()
    	sourceList()
    });

    watch(() => route.query.page, (page) => {
        getComments(Number(page) || 1)
        getActivityLogs(Number(page) || 1)
    }, { immediate: true })

	async function view() {

        const res = await useNuxtApp().$apiFetch(`customer/view?id=${id}`)

        if (res.status) {
            customer.value = res.data
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function assignedList() {

        const res = await useNuxtApp().$apiFetch(`user`)

        if (res.status) {
        	let data = res.data
            assignedTo.value = data.map(u => ({
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

    async function sourceList() {

        const res = await useNuxtApp().$apiFetch(`customer/source`)

        if (res.status) {
        	let data = res.data
            sources.value = data.map(u => ({
							    	label: u.name,
							    	value: u.id
							  	}))
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const handleSave = async ({ field, value }) => {
	    const res = await useNuxtApp().$apiFetch(`customer/update`, {
	        method: 'POST',
	        body: {
	            id,
	            field,
	            value
	        }
	    })

	    if (res.status) {
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

	async function bookmark(id) {
        const res = await useNuxtApp().$apiFetch(`customer/bookmark`, {
            method: 'POST',
            body: {
                id
            }
        })

        if (res.status) {
            view(id)
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
                const res = await useNuxtApp().$apiFetch(`customer/delete`, {
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

                    navigateTo('/customer/lead')
                } else {
                    notify.error({
                        title: 'Thông báo',
                        description: res.message
                    })
                }
            }
        });
    }

    // Upload Avatar
    const fileInput = ref < HTMLInputElement | null > (null)

	const triggerFile = () => {
	    fileInput.value?.click()
	}

	const handleFile = async (e: Event) => {
	    const target = e.target as HTMLInputElement
	    const file = target.files?.[0]

	    if (!file) return

	    // upload API
	    const formData = new FormData()
	    formData.append('avatar', file)
	    formData.append('id', customer.value.id)

	    try {
	        const res = await useNuxtApp().$apiFetch('customer/avatar', {
	            method: 'POST',
	            body: formData
	        })

	        if (res.status) {
	            customer.value.avatar = res.data
	            notify.success({
	                title: 'Thông báo',
	                description: res.message
	            })
	        }
	    } catch (err) {
	        console.error(err)
	    }
	}

	// COMMENT
	const comments= ref([]);
	const content = ref('');
	async function submitComment() {
		const res = await useNuxtApp().$apiFetch('customer/comment', {
            method: 'POST',
            body: {
            	customer_id: customer.value.id,
            	content: content.value
            }
        });

        if (res.status) {
        	getComments()
            notify.success({
                title: 'Thông báo',
                description: res.message
            })
        }
	}

	const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })
	async function getComments(page = 1) {
		const res = await useNuxtApp().$apiFetch(`customer/comment`, {
			params: {
			    page: page,
			    customer_id: id
			}
		});

		if (res.status) {
			comments.value = res.data.data
			pagination.value = {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
                total: res.data.total
            }
		}
	}

	// LOGS
	const activityLogs = ref([]);
	async function getActivityLogs(page = 1) {
		const res = await useNuxtApp().$apiFetch(`customer/activityLogs`, {
			params: {
			    page: page,
			    customer_id: id
			}
		});

		if (res.status) {
			activityLogs.value = res.data.data
			pagination.value = {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
                total: res.data.total
            }
		}
	}

    const getLogIcon = (type) => {
		switch (type) {
			case 'create': return 'ti ti-plus'
			case 'update': return 'ti ti-edit'
			case 'delete': return 'ti ti-trash'
			case 'comment': return 'ti ti-message'
			default: return 'ti ti-circle'
		}
	}

	const getLogColor = (type) => {
		switch (type) {
			case 'create': return 'bg-green-500'
			case 'update': return 'bg-blue-500'
			case 'delete': return 'bg-red-500'
			case 'comment': return 'bg-indigo-500'
			default: return 'bg-gray-400'
		}
	}
</script>