export const formatMoney = (value: number | string) => {
    if (!value) return '0 ₫'

    return Number(value).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    })
}