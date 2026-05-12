<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">Báo cáo khách hàng</h1>
                <p class="text-sm text-gray-500 mt-0.5">Báo cáo số lượng khách hàng của nhân viên</p>
            </div>
        </div>
    </div>

    <div class="p-4 lg:p-6 space-y-5">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Tổng khách hàng</p>
                <h3 class="text-2xl font-bold mt-1">
                    {{ report?.customer_total }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Lead</p>
                <h3 class="text-2xl font-bold text-green-600 mt-1">
                    {{ report?.customer_lead }}
                </h3>
            </div>

            <div class="bg-white border rounded p-4">
                <p class="text-gray-400 text-sm">Contact</p>
                <h3 class="text-2xl font-bold text-blue-600 mt-1">
                    {{ report?.customer_contact }}
                </h3>
            </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <div class="bg-white rounded border p-5">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold text-lg">
                            Thống kê khách hàng
                        </h3>

                        <p class="text-sm text-gray-400">
                            Tình trạng xử lý khách hàng
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-2xl font-bold text-indigo-600">
                            {{ report?.customer_total }}
                        </p>

                        <p class="text-xs text-gray-400">
                            Tổng khách hàng
                        </p>
                    </div>

                </div>

                <div class="h-[320px]">
                    <Pie
                        :data="pieData"
                        :options="pieOptions"
                    />
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">

    import {
        Chart as ChartJS,
        ArcElement,
        Tooltip,
        Legend
    } from 'chart.js'

    import { Pie } from 'vue-chartjs'

    ChartJS.register(
        ArcElement,
        Tooltip,
        Legend
    )

    const report = ref<any>()

    /* ================= FETCH ================= */

    const fetch = async () => {
        const res = await useNuxtApp().$apiFetch('report/customer')

        if (res.status) {
            report.value = res.data
        }
    }

    onMounted(() => {
        fetch()
    })

    /* ================= PIE CHART ================= */

    const pieData = computed(() => {

        return {
            labels: [
                'Lead',
                'Contact'
            ],

            datasets: [
                {
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6'
                    ],

                    borderWidth: 0,

                    data: [
                        report.value?.customer_lead || 0,
                        report.value?.customer_contact || 0
                    ]
                }
            ]
        }
    })

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
</script>