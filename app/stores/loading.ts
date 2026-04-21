export const useLoading = () => {
    const loadingCount = useState<number>('loading-count', () => 0)

    const start = () => loadingCount.value++
    const stop = () => {
        if (loadingCount.value > 0) loadingCount.value--
    }

    const isLoading = computed(() => loadingCount.value > 0)

    return { start, stop, isLoading }
}