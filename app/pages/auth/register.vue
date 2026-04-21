<template>
    <div class="flex items-center justify-center mb-5">
        <h1 class="text-2xl font-bold">Đăng ký tài khoản</h1>
    </div>
    <!-- Register Form -->
    <form class="space-y-4 relative z-10">
        <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" placeholder="name@example.com" class="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Mật khẩu</label>
            <input type="password" placeholder="••••••••" class="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <button type="submit" class="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-950 transition-all duration-200 shadow-lg shadow-primary/20 active:scale-95">
            Đăng ký
        </button>
    </form>

    <!-- Login Link -->
    <p class="text-center text-sm text-muted-foreground mt-6 relative z-10">
        Bạn đã có tài khoản?
        <NuxtLink to="/auth/login" class="text-primary hover:text-primary/80 font-medium transition-colors">Đăng nhập</NuxtLink>
    </p>

</template>

<script setup lang="ts">
	definePageMeta({
        layout: 'auth',
        middleware: ["guest"]
    })
</script>