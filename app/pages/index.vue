<template>
    <!-- HEADER -->
    <div class="bg-white border-b border-border px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Ngày của tôi</h1>
                <p class="text-sm text-gray-500 mt-0.5"> Hôm nay, {{ formattedDate }}
                </p>
            </div>
        </div>
    </div>
    <!-- CONTENT -->
    <div class="p-4 sm:p-6 pb-28">
        <div class="space-y-6">
            <!-- TODO LIST -->
            <div>
                <h2 class="text-sm font-semibold text-gray-700 mb-3">Công việc hôm nay ({{ activeTasks.length }})</h2>
                <div class="space-y-2">
                    <div v-for="task in activeTasks" :key="task.id" :class="['group flex items-center gap-3 bg-white border rounded-lg px-3 py-2 hover:shadow-sm transition cursor-pointer', getPriorityClass(task.priority)]">
                        <!-- CHECKBOX -->
                        <input type="checkbox" v-model="task.completed" @change="toggleTask(task)" class="w-4 h-4 accent-indigo-500" />
                        <!-- CONTENT -->
                        <div class="hover:font-semibold transition-all flex-1 text-sm" :class="getPriorityText(task.priority)" @click="openTask(task.id)">
                            {{ task.title }}
                        </div>
                        
                        <div>
                            <span class="italic text-gray-500 text-xs" v-if="task.due_date"><i class="ti ti-calendar-event"></i> {{ task.due_date }}</span>
                            &nbsp;
                            <button @click="toggleStar(task)">
                                <i :class="task.bookmark ? 'ti ti-star text-xl text-yellow-400' : 'ti ti-star text-xl text-gray-300'"></i>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            <!-- COMPLETED -->
            <div v-if="completedTasks.length">
                <h2 class="text-sm font-semibold text-gray-700 mb-3">Đã hoàn thành ({{ completedTasks.length }})</h2>
                <div class="space-y-2">
                    <div v-for="task in completedTasks" :key="task.id" class="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-2 opacity-70 cursor-pointer">
                        <input type="checkbox" checked @change="toggleTask(task)" class="w-4 h-4" />
                        <div class="flex-1 text-sm line-through text-gray-400" @click="openTask(task.id)">
                            {{ task.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Pagination
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :per-page="pagination.per_page"
            :total="pagination.total"
            @page-change="fetch"
        />
    </div>
    <!-- STICKY INPUT -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        
        <form @submit.prevent="addTask" class="max-w-2xl mx-auto flex items-center gap-2">
            <input v-model="newTask" placeholder="Thêm công việc mới..." class="flex-1 px-4 py-2 border rounded-lg border-indigo-500 focus:outline-none focus:border-indigo-700" autofocus required />
            <button type="submit" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 active:scale-95 transition"><i class="ti ti-circle-plus"></i>&nbsp;&nbsp;Thêm </button>
        </form>
     
    </div>

    <Offcanvas :open="open" @close="open = false">
        <ToDoDetail :task="selectedTask" @deleted="handleDeleted" @saved="handleSaved" @close="closeCanvas"/>
    </Offcanvas>

</template>

<script setup lang='ts'>

	definePageMeta({
		middleware: ['auth'],
	})

    const today = new Date()

    const formattedDate = today.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const tasks = ref([])
    const newTask = ref('')
    const open = ref(false)
    const route = useRoute()
    const selectedTask = ref('')

    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    watch(() => route.query.page, (page) => {
        fetch(Number(page) || 1)
    }, { immediate: true })

    const activeTasks = computed(() => tasks.value.filter(t => !t.completed_at))
    const completedTasks = computed(() => tasks.value.filter(t => t.completed_at))

    const addTask = async () => {
        if (!newTask.value.trim()) return

        const res = await useNuxtApp().$apiFetch(`todo/store`, {
            method: 'POST',
            body: {
                title : newTask.value
            }
        })

        if (res.status) {
            notify.success({
                title: 'Thông báo',
                description: res.message
            })

            fetch(route.query.page)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }

        newTask.value = ''
    }

    const toggleTask = async (task) => {
        const res = await useNuxtApp().$apiFetch(`todo/completed`, {
            method: 'POST',
            body: {
                id: task.id
            }
        })

        if (res.status) {
            fetch(route.query.page)
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function toggleStar(task) {
        const res = await useNuxtApp().$apiFetch(`todo/bookmark`, {
            method: 'POST',
            body: {
                id: task.id
            }
        })

        if (res.status) {
            task.bookmark = task.bookmark ? 0 : 1
        } else {
            notify.error({
                title: 'Thông báo',
                description: res.message
            })
        }
    }

    async function openTask(id) {

        const res = await useNuxtApp().$apiFetch(`todo/detail`, {
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

    async function fetch(page = 1) {

        const res = await useNuxtApp().$apiFetch(`todo?page=${page}`)

        if (res.status) {
            tasks.value = res.data.data
            pagination.value = {
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
                total: res.data.total
            }
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

        const task = tasks.value.find(t => t.id === data.id)

        if (task) {
            task.title = data.title
            task.due_date = data.due_date
            task.priority = data.priority
            task.completed_at = data.completed_at
        }
    }

    const closeCanvas = () => {
        open.value = false
    }

    const getPriorityClass = (priority) => {
        return
        switch (priority) {
            case 'high':
                return 'bg-red-50 border-red-300'
            case 'medium':
                return 'bg-yellow-50 border-yellow-400'
            case 'low':
                return 'bg-gray-50 border-gray-300'
            default:
                return 'bg-white border-gray-300'
        }
    }

    const getPriorityText = (priority) => {
        return
        switch (priority) {
            case 'high':
                return 'text-red-500'
            case 'medium':
                return 'text-yellow-600'
            case 'low':
                return 'text-gray-500'
            default:
                return 'text-gray-500'
        }
    }

    useHead(() => ({
        title: 'Ngày của tôi'
    }))
</script>