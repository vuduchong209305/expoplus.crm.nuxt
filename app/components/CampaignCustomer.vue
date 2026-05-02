<template>
    <div class="space-y-5">

        <div class="bg-gray-50 border rounded-lg p-4 space-y-2">
            <div class="text-sm">
                <span class="text-gray-500">Họ tên:</span>
                <span class="font-medium ml-1">{{ form.fullname }}</span>
            </div>
            <div class="text-sm">
                <span class="text-gray-500">Email:</span>
                <span class="ml-1">{{ form.email }}</span>
            </div>
            <div class="text-sm">
                <span class="text-gray-500">Doanh nghiệp:</span>
                <span class="ml-1">{{ form.company || '---' }}</span>
            </div>
        </div>
        <!-- STATUS -->
        <div>
            <label class="text-sm text-gray-700 mb-1 block">Trạng thái</label>
            <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                <option value="new">Mới</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="interested">Quan tâm</option>
                <option value="converted">Đã chuyển đổi</option>
                <option value="lost">Không quan tâm</option>
            </select>
        </div>
        <!-- PROGRESS -->
        <div class="mb-6">
		    <label class="text-sm font-semibold text-gray-700 mb-4 block">
		        Tiến độ
		    </label>

		    <div class="flex items-center w-full">
		        <template v-for="(p, index) in progress" :key="p.id">

		            <!-- NODE -->
		            <div class="flex flex-col items-center min-w-[80px]">
		                <div
						    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
						    :class="getNodeClass(p, index)"
						    @click="setProgress(p)"
						>
						    <!-- ✔ CURRENT -->
						    <i
						        v-if="isCurrent(p)"
						        class="ti ti-circle-check text-white text-lg animate-scale-in"
						    ></i>

						    <!-- ✔ COMPLETED -->
						    <div
						        v-else-if="isCompleted(p)"
						        class="w-2 h-2 bg-white rounded-full"
						    ></div>
						</div>

						<div
		                    class="mt-2 text-xs text-center"
		                    :class="isCurrent(p) ? 'font-semibold text-green-600' : 'text-gray-500'"
		                >
		                    {{ p.name }}
		                </div>
		            </div>

		            <!-- LINE -->
		            <div
		                v-if="index < progress.length - 1"
		                class="flex-1 h-[2px] mx-2 rounded-full"
		                :class="index < currentIndex ? 'bg-green-500' : 'bg-gray-200'"
		            ></div>

		        </template>
		    </div>
		</div>
        <!-- RATING -->
        <div>
            <label class="text-sm text-gray-700 mb-2 block">Đánh giá</label>
            <div class="flex items-center gap-1">
                <span v-for="i in 5" :key="i" @click="form.rating = i" class="cursor-pointer text-3xl transition" :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300'"> ★ </span>
            </div>
        </div>
        <!-- NOTE -->
        <div>
            <label class="text-sm text-gray-700 mb-1 block">Ghi chú</label>
            <textarea v-model="form.note" rows="4" placeholder="Nhập ghi chú..." class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none"></textarea>
        </div>
        <!-- ACTION -->
        <div class="flex justify-end gap-2 pt-3 border-t">
            <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"> Hủy </button>
            <button @click="submit" class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"> Lưu thay đổi </button>
        </div>
    </div>
</template>

<script setup lang="ts">
	const props = defineProps({
        customer: Object,
        progress: Object,
    	campaignId: [String, Number]
    })

    const emit = defineEmits(['saved', 'close'])

	const form = reactive({
	    id: null,
	    fullname: '',
	    email: '',
	    company: '',
	    status: 'new',
	    rating: 0,
	    note: '',
	    progress_id: props.customer?.progress_id || null
	})

	// sync dữ liệu
	watch(() => props.customer, (val) => {
	    if (val) {
	        Object.assign(form, val)
	    }
	}, { immediate: true })

	// submit
	const submit = async () => {
	    const res = await useNuxtApp().$apiFetch('campaign/update-customer', {
	        method: 'POST',
	        body: {
	        	campaign_id: props.campaignId,
	            customer_id: form.id,
	            progress_id: form.progress_id,
	            status: form.status,
	            rating: form.rating,
	            note: form.note
	        }
	    })

	    if (res.status) {
	        emit('saved')
	    }
	}

	// 👉 xác định index hiện tại
	const currentIndex = computed(() => {
	    return props.progress.findIndex(p => p.id == form.progress_id)
	})

	// 👉 check đã hoàn thành
	const isCompleted = (p) => {
	    return props.progress.findIndex(i => i.id == p.id) < currentIndex.value
	}

	// 👉 check current
	const isCurrent = (p) => {
	    return p.id == form.progress_id
	}

	// 👉 class node
	const getNodeClass = (p, index) => {
	    if (isCurrent(p)) {
	        return 'bg-green-500 border-green-500 text-white scale-110 shadow'
	    }

	    if (index < currentIndex.value) {
	        return 'bg-green-300 border-green-300'
	    }

	    return 'bg-white border-gray-300 group-hover:border-green-300'
	}

	// 👉 click update
	const setProgress = (p) => {
	    form.progress_id = p.id
	}
</script>

<style scoped>
	@keyframes scaleIn {
	    0% { transform: scale(0); opacity: 0 }
	    100% { transform: scale(1); opacity: 1 }
	}

	.animate-scale-in {
	    animation: scaleIn 0.2s ease;
	}
</style>