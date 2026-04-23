<template>
    <div class="flex items-center justify-center mb-5">
        <h1 class="text-2xl font-bold">Đăng nhập hệ thống</h1>
    </div>
    
    <!-- Login Form -->
    <form class="space-y-4 relative z-10" @submit.prevent="handleSubmit">
        <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input v-model="email" type="email" placeholder="name@example.com" class="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <div>
            <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-medium text-foreground">Mật khẩu</label>
                <a href="#" class="text-xs text-primary hover:text-primary/80 transition-colors">Quên mật khẩu?</a>
            </div>
            <input v-model="password" type="password" placeholder="••••••••" class="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <div class="flex items-center gap-2">
            <input type="checkbox" id="remember" class="w-4 h-4 rounded border-border text-primary focus:ring-primary/20">
            <label for="remember" class="text-sm text-muted-foreground">Ghi nhớ</label>
        </div>
        <button type="submit" class="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-950 transition-all duration-200 shadow-lg shadow-primary/20 active:scale-95">
            Đăng nhập
        </button>
    </form>

    <!-- Register Link -->
    <p class="text-center text-sm text-muted-foreground mt-6 relative z-10">
        Bạn chưa có tài khoản?
        <NuxtLink to="/auth/register" class="text-primary hover:text-primary/80 font-medium transition-colors">Đăng ký</NuxtLink>
    </p>
</template>

<script setup lang="ts">
	definePageMeta({
        layout: 'auth',
        middleware: ["guest"]
    })

    const email = ref('');
    const password = ref('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            await useLoginStore().login(email.value, password.value);
            
            notify.success({
                title: 'Thông báo',
                description: 'Đăng nhập thành công'
            });

            setTimeout(() => {
                window.location.assign('/')
            }, 1000);

        } catch (err: any) {
            notify.error({
                title: 'Lỗi',
                description: err?.message || 'Có lỗi xảy ra'
            });
        }
    };
</script>