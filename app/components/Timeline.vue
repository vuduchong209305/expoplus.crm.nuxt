<template>
    <div class="bg-white border rounded-2xl overflow-hidden">

        <!-- HEADER -->
        <div class="px-5 py-4 border-b flex items-center justify-between">

            <div>
                <h3 class="font-semibold text-lg">
                    Timeline công việc
                </h3>

                <p class="text-sm text-gray-500">
                    Theo dõi tiến độ công việc
                </p>
            </div>

            <div class="flex items-center gap-2">

                <button
                    @click="precision = 'day'"
                    class="px-3 py-1.5 rounded-lg border text-sm"
                >
                    Day
                </button>

                <button
                    @click="precision = 'week'"
                    class="px-3 py-1.5 rounded-lg border text-sm"
                >
                    Week
                </button>

                <button
                    @click="precision = 'month'"
                    class="px-3 py-1.5 rounded-lg border text-sm"
                >
                    Month
                </button>

            </div>

        </div>

        <!-- GANTT -->
        <div class="overflow-auto">

            <g-gantt-chart
                :chart-start="chartStart"
                :chart-end="chartEnd"
                :precision="precision"
                bar-start="start"
                bar-end="end"
                class="min-w-[1200px]"
            >

                <g-gantt-row
                    v-for="task in rows"
                    :key="task.id"
                    :label="task.label"
                    :bars="task.bars"
                />

            </g-gantt-chart>

        </div>

    </div>
</template>

<script setup lang="ts">

    const emit = defineEmits([
        'click-task'
    ])

    const precision = ref('week')

    const chartStart = ref('2026-05-01')
    const chartEnd = ref('2026-06-30')

    const rows = ref([
        {
            id: 1,

            label: 'Thiết kế Landing Page',

            bars: [
                {
                    myBeginDate: '2026-05-01',
                    myEndDate: '2026-05-08',

                    start: '2026-05-01',
                    end: '2026-05-08',

                    ganttBarConfig: {
                        id: 'task-1',
                        label: '60%',
                        style: {
                            background: '#2563eb',
                            borderRadius: '8px',
                            color: '#fff'
                        }
                    }
                }
            ]
        },

        {
            id: 2,

            label: 'Tạo Video AI',

            bars: [
                {
                    start: '2026-05-05',
                    end: '2026-05-20',

                    ganttBarConfig: {
                        id: 'task-2',
                        label: '35%',
                        style: {
                            background: '#f59e0b',
                            borderRadius: '8px',
                            color: '#fff'
                        }
                    }
                }
            ]
        }
    ])

</script>