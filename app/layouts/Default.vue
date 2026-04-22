<template>
    <div id="app" class="min-h-screen">
        <!-- Top Navbar -->
        <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 flex items-center">
            <!-- Logo Section (matches sidebar width) -->
            <div class="w-[260px] h-full flex items-center px-5 border-r border-border flex-shrink-0 hidden lg:flex">
                <NuxtLink to="/" class="flex items-center gap-2">
                    <!-- Logo adapts to dark mode via CSS filter -->
                    <img src="/logo.png" alt="Expoplus CRM" class="w-full pr-10 object-contain">
                </NuxtLink>
            </div>
            <!-- Mobile Header -->
            <div class="flex items-center px-4 lg:hidden">
                <button id="mobile-menu-toggle" class="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-foreground hover:bg-muted rounded-lg transition-all mr-2">
                    <i class="ti ti-menu-2"></i>
                </button>
                <NuxtLink to="/" class="flex items-center gap-2">
                    <!-- Logo adapts to dark mode via CSS filter -->
                    <img src="/logo.png" alt="Expoplus CRM" class="w-full pr-10 object-contain">
                </NuxtLink>
            </div>
            
            <div class="flex-1 h-full flex items-center px-4 lg:px-5">
                <!-- Sidebar Toggle -->
                <button id="sidebar-toggle" class="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                    <i class="ti ti-menu-2"></i>
                </button>
                <!-- Center Nav Links -->
                <nav class="hidden lg:flex items-center gap-1 ml-4">
                    <NuxtLink to="/" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Ngày của tôi</NuxtLink>
                    <NuxtLink to="/calendar" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Lịch của tôi</NuxtLink>
                    <NuxtLink to="/marketing/campaign" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Chiến dịch</NuxtLink>
                    <a href="#" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Hợp đồng</a>
                </nav>
                <!-- Right Actions -->
                <div class="flex items-center gap-1 sm:gap-2 ml-auto">
                    <button class="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                        <i class="ti ti-search text-xl"></i>
                    </button>
                    <button class="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all relative">
                        <i class="ti ti-bell text-xl"></i>
                        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    
                    <!-- User Avatar Dropdown -->
                    <div class="relative ml-1 sm:ml-2" id="user-dropdown-container">
                        <button id="user-avatar-btn" class="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 cursor-pointer ring-2 ring-background overflow-hidden">
                            <img src="/assets/images/user1.jpg" alt="User" class="w-full h-full object-cover">
                        </button>
                        <!-- Dropdown Menu -->
                        <div id="user-dropdown" class="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden hidden">
                            <!-- Header -->
                            <div class="p-4 border-b border-border">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border">
                                        <img src="/assets/images/user1.jpg" alt="Cody Fisher" class="w-full h-full object-cover">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <h3 class="font-semibold truncate">{{ user?.fullname }}</h3>
                                            <span class="text-xs bg-gray-200 px-2 py-0.5 rounded font-medium">Pro</span>
                                        </div>
                                        <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Menu Items -->
                            <div class="py-2">
                                <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-muted hover:text-foreground transition-all">
                                    <span>Public Profile</span>
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-muted hover:text-foreground transition-all">
                                    <span>My Profile</span>
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-muted hover:text-foreground transition-all">
                                    <span>Dev Forum</span>
                                </a>
                            </div>
                            
                            <!-- Logout -->
                            <div class="border-t border-border p-3">
                                <button class="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all" @click="logout"> Đăng xuất </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- Mobile Sidebar Overlay -->
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-40 hidden opacity-0 transition-opacity duration-300 lg:hidden"></div>
        <!-- Sidebar Container -->
        <aside class="fixed top-16 left-0 w-[260px] h-[calc(100vh-4rem)] bg-white border-r overflow-y-auto z-40">
            <nav>
                <div v-for="menu in menus" :key="menu.name">
                    <!-- MENU KHÔNG CÓ CHILD -->
                    <NuxtLink v-if="!menu.children" :to="menu.to" class="flex items-center px-6 h-11 transition hover:bg-gray-100 text-gray-700" :class="{ 'bg-gray-100 text-indigo-700': isActive(menu.to) }">
                        <i :class="menu.icon" class="text-md"></i>
                        <span class="ml-3 font-medium">{{ menu.name }}</span>
                    </NuxtLink>
                    <!-- MENU CÓ CHILD -->
                    <div v-else>
                        <!-- PARENT -->
                        <button @click="openMenu = openMenu === menu.name ? null : menu.name" class="w-full flex items-center px-6 h-11 hover:bg-gray-100 text-gray-700" :class="{ 'text-indigo-700': openMenu === menu.name }">
                            <i :class="menu.icon" class="text-md"></i>
                            <span class="ml-3 flex-1 text-left font-medium">{{ menu.name }}</span>
                            <i class="ti ti-chevron-down transition" :class="{ 'rotate-180': openMenu === menu.name }"></i>
                        </button>
                        <!-- CHILD -->
                        <div v-show="openMenu === menu.name" class="ml-5">
                            <NuxtLink v-for="child in menu.children" :key="child.to" :to="child.to" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" :class="{ 'text-indigo-700 font-medium': isActive(child.to) }">
                                <i class="ti ti-point"></i>&nbsp;{{ child.name }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
        <!-- Main Content -->
        <main id="content" class="lg:ml-[260px] pt-16 min-h-screen transition-all duration-300">
            <slot/>
        </main>
    </div>
</template>

<script setup lang='ts'>

    const route = useRoute()
    const openMenu = ref < string | null > (null)

    const menus = [
        {
            name: 'Ngày của tôi',
            icon: 'ti ti-layout-dashboard',
            to: '/',
        },
        {
            name: 'Check list',
            icon: 'ti ti-list-check',
            to: '/task',
        },
        {
            name: 'Lịch của tôi',
            icon: 'ti ti-calendar',
            to: '/calendar',
        },
        {
            name: 'Khách hàng',
            icon: 'ti ti-mail',
            children: [
                {
                    name: 'Lead',
                    to: '/customer/lead'
                },
                {
                    name: 'Contact',
                    to: '/customer/contact'
                },
                {
                    name: 'Thêm mới',
                    to: '/customer/create'
                }
            ]
        },
        {
            name: 'Tiếp thị',
            icon: 'ti ti-speakerphone',
            children: [
                {
                    name: 'Chiến dịch',
                    to: '/marketing/campaign'
                },
                {
                    name: 'Nhóm khách hàng',
                    to: '/marketing/customers'
                }
            ]
        },
    ]

    onMounted(() => {
        const btn = document.getElementById('user-avatar-btn')
        const dropdown = document.getElementById('user-dropdown')

        btn?.addEventListener('click', (e) => {
            e.stopPropagation()
            dropdown?.classList.toggle('hidden')
        })

        document.addEventListener('click', (e) => {
            if (!dropdown?.contains(e.target) && !btn?.contains(e.target)) {
                dropdown?.classList.add('hidden')
            }
        })
    })
    
    function logout() {
        try {
            useLoginStore().logout();

            notify.success({
                title: 'Thông báo',
                description: 'Đăng xuất thành công'
            });

            setTimeout(() => {
                window.location.assign('/')
            }, 1000);

        } catch (err) {
            notify.error({
                title: 'Thông báo',
                description: err.message
            });
        }
    }

    // check active
    const isActive = (path: string) => {
        if (path === '/') {
            return route.path === '/'
        }
        return route.path.startsWith(path)
    }

    // auto mở menu cha nếu đang ở route con
    watchEffect(() => {
        menus.forEach(menu => {
            if (menu.children) {
                const match = menu.children.find(c => route.path.startsWith(c.to))
                if (match) {
                    openMenu.value = menu.name
                }
            }
        })
    })
</script>