<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div>
            <h2 class="text-lg font-semibold">Báo cáo chiến dịch</h2>
            <p class="text-sm text-gray-500">Phân tích hiệu quả & tiến độ</p>
        </div>

        <!-- KPI -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-white border rounded-lg">
                <div class="text-xs text-gray-500">Tổng KH</div>
                <div class="text-xl font-semibold">{{ report.total }}</div>
            </div>

            <div class="p-4 bg-white border rounded-lg">
                <div class="text-xs text-gray-500">Đã chuyển đổi</div>
                <div class="text-xl font-semibold text-green-600">
                    {{ report.converted }} <span class="text-sm">({{ report.converted_rate }}%)</span>
                </div>
            </div>

            <div class="p-4 bg-white border rounded-lg">
                <div class="text-xs text-gray-500">Có quan tâm</div>
                <div class="text-xl font-semibold text-yellow-500">
                    {{ report.interested }} <span class="text-sm">({{ report.interested_rate }}%)</span>
                </div>
            </div>

        </div>

        <!-- STATUS -->
        <div class="bg-white border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">Trạng thái khách hàng</h3>

            <div class="space-y-2">
                <div v-for="s in report.status" :key="s.id" class="flex items-center gap-3">
                    <div class="w-32 text-sm text-gray-600">{{ s.name }}</div>

                    <div class="flex-1 bg-gray-200 h-2 rounded">
                        <div 
                            class="h-2 rounded bg-indigo-500"
                            :style="{ width: s.percent + '%' }"
                        ></div>
                    </div>

                    <div class="text-xs w-5 text-right">
                        {{ s.count }}
                    </div>
                </div>
            </div>
        </div>

        <!-- PROGRESS -->
        <div class="bg-white border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">Tiến độ</h3>

            <div class="space-y-2">
                <div v-for="p in report.progress" :key="p.id" class="flex items-center gap-3">
                    <div class="w-32 text-sm text-gray-600">{{ p.name }}</div>

                    <div class="flex-1 bg-gray-200 h-2 rounded">
                        <div 
                            class="h-2 rounded bg-green-500"
                            :style="{ width: p.percent + '%' }"
                        ></div>
                    </div>

                    <div class="text-xs w-5 text-right">
                        {{ p.count }}
                    </div>
                </div>
            </div>
        </div>

        <!-- RATING -->
        <div class="bg-white border rounded-lg p-4">
            <h3 class="text-sm font-semibold">Đánh giá khách hàng</h3>

            <div class="flex items-center gap-2">
                <span v-for="i in 5" :key="i" class="text-xl" :class="i <= Math.round(report.avg_rating) ? 'text-yellow-400' : 'text-gray-300'"> ★ </span>

                <span class="text-sm text-gray-500 ml-2">
                    {{ report.avg_rating }}/5
                </span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
	const props = defineProps({
	    campaignId: [String, Number]
	})

	const report = ref({
	    total: 0,
	    converted: 0,
	    converted_rate: 0,
	    interested: 0,
	    interested_rate: 0,
	    avg_rating: 0,
	    status: [],
	    progress: []
	})

	onMounted(() => {
	    fetchReport()
	})

	const fetchReport = async () => {
	    const res = await useNuxtApp().$apiFetch('campaign/report', {
	        method: 'POST',
	        body: {
	            id: props.campaignId
	        }
	    })

	    if (res.status) {
	        report.value = res.data
	    }
	}
</script>