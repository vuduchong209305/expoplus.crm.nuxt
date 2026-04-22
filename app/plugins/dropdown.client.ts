export default defineNuxtPlugin(() => {
    if (process.server) return

    const handleClick = (e: Event) => {
        const target = e.target as HTMLElement

        const btn = target.closest('.dropdown-btn')
        const dropdown = target.closest('.dropdown')

        if (btn && dropdown) {
            e.stopPropagation()

            const menu = dropdown.querySelector('.dropdown-menu')

            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.add('hidden')
            })

            menu?.classList.toggle('hidden')
            return
        }

        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden')
        })
    }

    document.addEventListener('click', handleClick)
})