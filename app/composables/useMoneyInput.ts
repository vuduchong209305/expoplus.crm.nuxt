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

        const target = e.target as HTMLInputElement

        const raw = target.value.replace(/\D/g, '')

        callback(Number(raw || 0))
    }

    return {
        formatMoney,
        onlyNumber,
        handleMoneyInput
    }
}