export const useCheckboxTable = (itemsRef, key = 'id') => {
    const selected = ref<any[]>([])

    // check 1 item
    const toggleItem = (item) => {
        const index = selected.value.findIndex(i => i[key] === item[key])

        if (index > -1) {
            selected.value.splice(index, 1)
        } else {
            selected.value.push(item)
        }
    }

    // check all
    const toggleAll = () => {
        if (isAllSelected.value) {
            selected.value = []
        } else {
            selected.value = [...itemsRef.value]
        }
    }

    // computed check all
    const isAllSelected = computed(() => {
        return itemsRef.value.length > 0 &&
               selected.value.length === itemsRef.value.length
    })

    // check item có được chọn không
    const isChecked = (item) => {
        return selected.value.some(i => i[key] === item[key])
    }

    return {
        selected,
        toggleItem,
        toggleAll,
        isAllSelected,
        isChecked
    }
}