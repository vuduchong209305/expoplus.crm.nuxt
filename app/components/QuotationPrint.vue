<template>
    <div id="print-area" class="a4-page text-[13px] text-gray-800">
        <!-- HEADER -->
        <div class="flex justify-between items-start border-b pb-4">
            <!-- LEFT: COMPANY -->
            <div>
                <h2 class="text-sm font-bold">{{ user?.organizer?.name }}</h2>
                <p class="text-sm">Địa chỉ: {{ user?.organizer?.address }}</p>
                <p class="text-sm">Điện thoại: {{ user?.phone }}</p>
                <p class="text-sm">Email: {{ user?.email }}</p>
            </div>
            <!-- RIGHT: LOGO -->
            <div>
                <img src="/logo.png" class="w-48 object-contain" />
            </div>
        </div>
        <!-- TITLE -->
        <div class="text-center my-10">
            <h1 class="text-2xl font-bold uppercase">PHIẾU BÁO GIÁ</h1>
            <p class="text-sm text-gray-500">Mã: {{ quotation?.code }}</p>
        </div>
        <!-- CUSTOMER -->
        <div class="mb-4">
        	<p class="text-sm">
                <strong>Doanh nghiệp:</strong> {{ customer?.company }}
            </p>
            <p class="text-sm">
                <strong>Họ tên:</strong> {{ customer?.fullname }}
            </p>
            <p class="text-sm">
                <strong>Email:</strong> {{ customer?.email }}
            </p>
            <p class="text-sm">
                <strong>SĐT:</strong> {{ customer?.phone }}
            </p>
        </div>
        <!-- TABLE -->
        <table class="w-full border border-gray-300 text-sm">
            <thead class="bg-gray-100">
                <tr>
                    <th class="border p-2 w-10">STT</th>
                    <th class="border p-2 text-left">Sản phẩm</th>
                    <th class="border p-2 w-20">SL</th>
                    <th class="border p-2 w-28">Đơn giá</th>
                    <th class="border p-2 w-32">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in items" :key="i">
                    <td class="border p-2 text-center">{{ i + 1 }}</td>
                    <td class="border p-2">{{ item?.title }}</td>
                    <td class="border p-2 text-center">{{ item?.qty }}</td>
                    <td class="border p-2 text-right">{{ formatMoney(item?.price) }}</td>
                    <td class="border p-2 text-right">
                        {{ formatMoney(item?.qty * item?.price) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- TOTAL -->
        <div class="mt-4 flex justify-end">
            <div class="w-72 space-y-1">
                <div class="flex justify-between">
                    <span class="text-sm">Tạm tính:</span>
                    <span class="text-sm">{{ formatMoney(quotation?.sub_total) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-sm">VAT (10%):</span>
                    <span class="text-sm">{{ formatMoney(quotation?.vat) }}</span>
                </div>
                <div class="flex justify-between" v-if="quotation?.discount > 0">
                    <span class="text-sm">Giảm giá:</span>
                    <span class="text-sm">- {{ formatMoney(quotation?.discount) }}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                    <span class="text-sm">Tổng cộng:</span>
                    <span class="text-sm">{{ formatMoney(quotation?.grand_total) }}</span>
                </div>
            </div>
        </div>

        <div class="my-5">
            <p class="italic text-justify text-sm"><b>Ghi chú: </b>{{ quotation?.note }}</p>
        </div>

        <!-- FOOTER -->
        <div class="mt-10 flex justify-around text-center">
            <div>
                <p class="font-semibold">Khách hàng</p>
                <p class="mt-10">(Ký tên)</p>
            </div>
            <div>
                <p class="font-semibold">Người lập</p>
                <p class="mt-10">(Ký tên)</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        quotation: Object,
        items: Array,
        customer: Object
    })

    const { user } = useAuth()
</script>

<style scoped>
	.a4-page {
		width: 210mm;
		min-height: 297mm;
		padding: 15mm;
		background: white;
	}

	@media print {
	    body * {
	        display: none;
	    }

	    #print-area {
	        display: block !important;
	    }

	    #print-area * {
	        display: revert !important;
	    }

	    #print-area {
	        position: absolute;
	        left: 0;
	        top: 0;
	        width: 100%;
	    }
	}

</style>