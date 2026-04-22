<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Check list công việc</h1>
                <p class="text-sm text-gray-500 mt-0.5">Phân công nhiệm vụ tổng quan</p>
            </div>

        </div>
    </div>

    <div class="p-4 lg:p-6">
    	<div class="bg-white p-4 rounded-lg border">
		    <!-- HEADER -->
		    <div class="grid grid-cols-12 text-sm font-semibold text-gray-500 pb-3 border-b mb-2">
		        <div class="col-span-5">Công việc</div>
		        <div class="col-span-1">Bắt đầu</div>
		        <div class="col-span-1">Kết thúc</div>
		        <div class="col-span-2">Phụ trách</div>
		        <div class="col-span-2">Tiến độ</div>
		        <div class="col-span-1">Ngày hoàn thành</div>
		    </div>
		    <!-- LIST -->
		    <draggable v-model="tasks" item-key="id" animation="200" handle=".drag-handle" ghost-class="bg-gray-100" @end="onDragEnd" class="space-y-2">
			    <template #item="{ element: task }">
			        <div class="grid grid-cols-12 items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition group bg-white border border-gray-100">
			            <!-- DRAG -->
			            <div class="col-span-1 flex items-center">
			                <i class="ti ti-grip-vertical drag-handle cursor-move text-gray-400 hover:text-indigo-500"></i>
			                &nbsp;&nbsp;&nbsp;
			                <input type="checkbox" :checked="task.completed_at" @change="toggleTask(task)" class="w-4 h-4 accent-indigo-500" />
			            </div>
			            <!-- TASK NAME -->
			            <div class="col-span-4 flex items-center gap-2">
			                <div class="text-sm cursor-pointer hover:font-semibold transition-all" :class="task.completed_at
			            ? 'line-through italic text-gray-400'
			            : 'text-indigo-500'" @click="openTask(task.id)">
			                    {{ task.title }}
			                </div>
			            </div>
			            <!-- START -->
			            <div class="col-span-1 text-sm" :class="task.completed_at ? 'line-through italic text-gray-400' : 'text-gray-800'">
			                {{ task.start_date }}
			            </div>
			            <!-- END -->
			            <div class="col-span-1 text-sm" :class="task.completed_at ? 'line-through italic text-gray-400' : 'text-gray-800'">
			                {{ task.end_date }}
			            </div>
			            <!-- ASSIGNEE -->
			            <div class="col-span-2 flex items-center gap-2">
			                <img :src="viewImage(task?.user?.avatar)" class="w-6 h-6 rounded-full" />
			                <div class="text-sm" :class="task.completed_at ? 'line-through italic text-gray-400' : 'text-gray-800'">
			                    {{ task.user?.fullname || 'Chưa giao' }}
			                </div>
			            </div>
			            <!-- PROGRESS -->
			            <div class="col-span-2">
			                <div class="flex items-center gap-2">
			                    <div class="w-full bg-gray-200 rounded-full h-2">
			                        <div class="h-2 rounded-full bg-indigo-500 transition-all" :style="{ width: task.progress + '%' }"></div>
			                    </div>
			                    <span class="text-xs text-gray-500 w-10">
			                        {{ task.progress || 0 }}% </span>
			                </div>
			            </div>
			            <!-- COMPLETED TIME -->
			            <div class="col-span-1 text-xs italic text-gray-500">
			                {{ task.completed_at || '' }}
			            </div>
			        </div>
			    </template>
			</draggable>
		</div>
    </div>

    <!-- STICKY INPUT -->
	<div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 shadow">
	    <form @submit.prevent="addTask" class="max-w-5xl mx-auto grid grid-cols-12 gap-2 items-center">
	        <!-- TASK NAME -->
	        <input v-model="form.title" placeholder="Thêm công việc..." class="col-span-4 px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:border-indigo-700" autofocus required />
	        <!-- START DATE -->
	        <input type="date" v-model="form.start_date" class="col-span-2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
	        <!-- END DATE -->
	        <input type="date" v-model="form.end_date" class="col-span-2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
	        <!-- ASSIGNEE -->
	        <select v-model="form.assigned_to" class="col-span-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500">
	            <option value="">-- Giao cho --</option>
	            <option v-for="u in users" :key="u.id" :value="u.id">
	                {{ u.fullname }}
	            </option>
	        </select>
	        <!-- BUTTON -->
	        <button type="submit" class="col-span-1 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 active:scale-95 transition"><i class="ti ti-circle-plus"></i></button>
	    </form>
	</div>

	<Offcanvas :open="open" @close="open = false">
        <TaskDetail :task="selectedTask" :users="users" @deleted="handleDeleted" @saved="handleSaved" @close="closeCanvas"/>
    </Offcanvas>
</template>

<script setup lang="ts">

	import draggable from 'vuedraggable'

	const tasks = ref([])
	const selectedTask = ref('')
	const open = ref(false)
	const users = ref([])

	const form = reactive({
		title: '',
		start_date: '',
		end_date: '',
		assigned_to: '',
		progress: 0,
		completed_at: ''
	})

	onMounted(() => {
    	fetch()
    	userList()
    });

	async function fetch() {

        const res = await useNuxtApp().$apiFetch(`task`)

        if (res.status) {
            tasks.value = res.data
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

	async function addTask() {
	    const res = await useNuxtApp().$apiFetch('task/store', {
	        method: 'POST',
	        body: form
	    })

	    if (res.status) {
	        fetch()

	        form.title = ''
	        form.start_date = ''
	        form.end_date = ''
	        form.assigned_to = ''

	        notify.success({
                title: 'Thông báo',
                description: res.message
            })
	    }
	}

	const toggleTask = async (task) => {
        const res = await useNuxtApp().$apiFetch(`task/completed`, {
            method: 'POST',
            body: {
                id: task.id
            }
        })

        if (res.status) {
            fetch()
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function openTask(id) {

        const res = await useNuxtApp().$apiFetch(`task/detail`, {
            params: {
                id: id
            }
        })

        if (res.status) {
            selectedTask.value = res.data
            open.value = true
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function userList() {

        const res = await useNuxtApp().$apiFetch(`user`)

        if (res.status) {
            users.value = res.data
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    const handleDeleted = (id) => {
        open.value = false
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    const handleSaved = (data) => {
        open.value = false
        fetch()
    }

    const closeCanvas = () => {
        open.value = false
    }

    const onDragEnd = async () => {
	    const sorted = tasks.value.map((item, index) => ({
	        id: item.id,
	        order: index + 1
	    }))

	    await useNuxtApp().$apiFetch('task/sort', {
	        method: 'POST',
	        body: {
	            tasks: sorted
	        }
	    })
	}

	useHead(() => ({
        title: 'Nhiệm vụ công việc'
    }))
</script>