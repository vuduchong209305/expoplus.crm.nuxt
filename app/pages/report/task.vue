<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Báo cáo công việc</h1>
                <p class="text-sm text-gray-500 mt-0.5">Báo cáo tiến độ công việc</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6 space-y-5">

        <!-- KPI -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Tổng Task</p>
                <h3 class="text-2xl font-bold mt-1">
                    {{ report?.task_total }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Hoàn thành</p>
                <h3 class="text-2xl font-bold text-green-600 mt-1">
                    {{ report?.task_completed }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Đang xử lý</p>
                <h3 class="text-2xl font-bold text-blue-600 mt-1">
                    {{ report?.task_processing }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Quá hạn</p>
                <h3 class="text-2xl font-bold text-red-500 mt-1">
                    {{ report?.task_overdue }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Hiệu suất</p>
                <h3 class="text-2xl font-bold text-indigo-600 mt-1">
                    {{ report?.success_rate }}%
                </h3>
            </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <div class="bg-white rounded border p-5">
                <div class="flex items-center justify-between mb-4">

                    <div>
                        <h3 class="font-semibold text-lg">
                            Thống kê công việc
                        </h3>

                        <p class="text-sm text-gray-400">
                            Tình trạng hoàn thành công việc
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-2xl font-bold text-indigo-600">
                            {{ report?.task_total }}
                        </p>

                        <p class="text-xs text-gray-400">
                            Tổng công việc
                        </p>
                    </div>

                </div>

                <div class="h-[320px]">
                    <Bar
                        :data="barData"
                        :options="barOptions"
                    />
                </div>
            </div>

            <div class="bg-white rounded border p-5">

                <div class="flex items-center justify-between mb-4">

                    <div>
                        <h3 class="font-semibold text-lg">
                            Thống kê chiến dịch
                        </h3>

                        <p class="text-sm text-gray-400">
                            Tình trạng hoàn thành chiến dịch
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-2xl font-bold text-indigo-600">
                            {{ report?.campaign_total }}
                        </p>

                        <p class="text-xs text-gray-400">
                            Tổng chiến dịch
                        </p>
                    </div>

                </div>

                <div class="h-[320px]">
                    <Bar
                        :data="campaignBarData"
                        :options="campaignBarOptions"
                    />
                </div>

            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
        Tooltip,
        Legend,
        Filler
    } from 'chart.js'

    import { Bar } from 'vue-chartjs'

    definePageMeta({
        middleware: ['auth']
    })

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
        Tooltip,
        Legend,
        Filler
    )

    const report = ref<any>()

    /* ================= FETCH ================= */

    const fetch = async () => {
        const res = await useNuxtApp().$apiFetch('report/task')

        if (res.status) {
            report.value = res.data
        }
    }

    onMounted(() => {
        fetch()
    })

    /* ================= BAR CHART ================= */

    const barData = computed(() => {

        return {
            labels: [
                'Chưa làm',
                'Đang xử lý',
                'Đã hoàn thành',
                'Quá hạn'
            ],

            datasets: [
                {
                    label: 'Task',
                    borderRadius: 8,
                    backgroundColor: [
                        '#f59e0b',
                        '#3b82f6',
                        '#10b981',
                        '#ef4444'
                    ],

                    data: [
                        report.value?.task_pending || 0,
                        report.value?.task_processing || 0,
                        report.value?.task_completed || 0,
                        report.value?.task_overdue || 0
                    ]
                }
            ]
        }
    })

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false
    }

    /* ================= CAMPAIGN BAR CHART ================= */
    const campaignBarData = computed(() => {

        return {
            labels: [
                'Hoàn thành',
                'Chưa hoàn thành'
            ],

            datasets: [
                {
                    label: 'Chiến dịch',
                    borderRadius: 8,

                    backgroundColor: [
                        '#10b981',
                        '#f59e0b'
                    ],

                    data: [
                        report.value?.campaign_completed || 0,
                        report.value?.campaign_pending || 0
                    ]
                }
            ]
        }
    })

    const campaignBarOptions = {
        responsive: true,
        maintainAspectRatio: false
    }
</script>