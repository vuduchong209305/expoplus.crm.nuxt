<template>
    <nav v-if="lastPage > 1" class="flex justify-around items-center gap-3 py-4">
        <!-- Info -->
        <div class="text-sm text-gray-500"> Hiển thị <span class="font-semibold text-gray-900">
                {{ from }}-{{ to }}
            </span> của <span class="font-semibold text-gray-900">
                {{ total }}
            </span>
        </div>
        <!-- Pagination -->
        <div class="w-full overflow-x-auto">
            <div class="flex items-center justify-end min-w-max gap-2 text-gray-500 font-medium">
                <!-- Prev -->
                <button type="button" aria-label="prev" class="rounded-full bg-slate-200/50 disabled:opacity-50" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" />
                    </svg>
                </button>
                <!-- Pages -->
                <div class="flex items-center gap-2">
                    <template v-for="(page, index) in pagesToShow" :key="index" class="hidden sm:flex h-10 w-10 items-center justify-center">
                        <!-- Ellipsis -->
                        <span v-if="page === '...'" class="px-2 text-gray-400"> ... </span>
                        <!-- Page -->
                        <button v-else @click="changePage(page)" type="button" class="h-10 w-10 flex items-center justify-center aspect-square transition" :class="page === currentPage
              ? 'text-indigo-500 border border-indigo-200 rounded-full bg-indigo-50'
              : 'hover:bg-gray-100 rounded-full'">
                            {{ page }}
                        </button>
                    </template>
                </div>
                <!-- Next -->
                <button type="button" aria-label="next" class="rounded-full bg-slate-200/50 disabled:opacity-50" :disabled="currentPage === lastPage" @click="changePage(currentPage + 1)">
                    <svg class="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
    const props = defineProps({
        currentPage: Number,
        lastPage: Number,
        perPage: Number,
        total: Number,
    })
    const router = useRouter()
    const route = useRoute()

    const emit = defineEmits(['page-change'])
    const from = computed(() => (props.currentPage - 1) * props.perPage + 1)
    const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))

    const pagesToShow = computed(() => {
        const delta = 1
        const range = []

        for (let i = 1; i <= props.lastPage; i++) {
            if (
                i === 1 ||
                i === props.lastPage ||
                (i >= props.currentPage - delta && i <= props.currentPage + delta)
            ) {
                range.push(i)
            } else if (range[range.length - 1] !== '...') {
                range.push('...')
            }
        }

        return range
    })

    function changePage(page: number | string) {
        if (page === '...' || page === props.currentPage || page < 1 || page > props.lastPage) return

        const query = {
            ...route.query,
            page: String(page)
        }

        router.push({
            path: route.path,
            query
        })

        emit('page-change', page)

        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth'
        // })
    }
</script>