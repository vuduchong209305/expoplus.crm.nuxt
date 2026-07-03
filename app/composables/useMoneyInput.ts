export const useMoneyInput = () => {

    // 👉 chỉ cho nhập số
    const onlyNumber = (e: KeyboardEvent) => {

        const allow = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'Tab'
        ]

        if (allow.includes(e.key)) return

        if (!/^\d$/.test(e.key)) {
            e.preventDefault()
        }
    }

    const handleMoneyInput = (
        e: Event,
        callback: (value: number) => void
    ) => {
        const input = e.target as HTMLInputElement

        const value = input.value.replace(/\D/g, '')

        callback(Number(value || 0))

        input.value = formatMoney(value)
    }

    return {
        formatMoney,
        onlyNumber,
        handleMoneyInput
    }
}