<template>
	<div class="space-y-2 max-h-[400px] overflow-y-auto">
	    <div v-for="group in groups" :key="group.id" class="flex items-center justify-between px-3 py-2 border rounded-lg hover:bg-gray-50">
	        <label class="flex items-center gap-2 cursor-pointer w-full">
	            <input type="checkbox" :checked="selectedGroups.includes(group.id)" @change="toggleGroup(group.id)" class="w-4 h-4 accent-indigo-500" />
	            <div>
	                <div class="text-sm font-medium">{{ group.title }}</div>
	                <div class="text-xs text-gray-400">
	                    {{ group.customers_count }} khách hàng
	                </div>
	            </div>
	        </label>
	    </div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
        customer_id: {
            type: Number,
            required: true
        }
    })

	const groups = ref([])
	const selectedGroups = ref([])

	onMounted(() => {
    	loadGroups()
    });

	async function loadGroups() {
		const res = await useNuxtApp().$apiFetch('customer-group/list', {
			params: {
    			customer_id: props.customer_id
  			}
		})

		groups.value = res.data.groups
		selectedGroups.value = res.data.customer_groups
	}

	const toggleGroup = async (groupId) => {

	    const exists = selectedGroups.value.includes(groupId)

	    if (exists) {
	        selectedGroups.value = selectedGroups.value.filter(id => id !== groupId)
	    } else {
	        selectedGroups.value.push(groupId)
	    }

	    const res = await useNuxtApp().$apiFetch('customer-group/assign', {
	        method: 'POST',
	        body: {
	            customer_id: props.customer_id,
	            group_ids: selectedGroups.value
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
</script>