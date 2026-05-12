<template>
	<div class="bg-white border-b px-4 sm:px-6 py-4 sm:py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h1 class="text-lg sm:text-xl font-semibold">{{ isEdit ? 'Chỉnh sửa báo giá' : 'Thêm báo giá' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Báo giá cho khách hàng</p>
            </div>
            <button v-if="quotation?.code" @click="exportFile()" type="button" class="px-4 py-2 text-sm font-medium bg-white text-indigo-500 border border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white hover:border-white active:scale-95 transition-all"><i class="ti ti-download me-2"></i>Xuất file báo giá</button>
        </div>
    </div>

    <div class="p-4 lg:p-6">

    	<div class="bg-white p-4 rounded-lg mb-3 border">
        	<div class="flex flex-wrap justify-between gap-2">
                
                <div>
                	<div class="mb-2">
                		<label class="block text-sm text-gray-700 font-semibold mb-1">Chọn sản phẩm</label>
	                	<select v-model="selectedProductId" class="text-sm border px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500">
					        <option value="">-- Chọn sản phẩm --</option>
					        <option v-for="p in products" :key="p.id" :value="p.id">
					            {{ p.title }} - {{ formatMoney(p.price) }}
					        </option>
					    </select>
		                &nbsp;
		                <button type="button" @click="addProduct" class="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm">
					        Thêm
					    </button>
                	</div>
                	
                	<div class="mb-2">
                		<label class="block text-sm text-gray-700 font-semibold mb-1">Chọn sự kiện</label>
                		<select v-model="selectedExhibition" class="w-full text-sm border px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500">
	                		<option value="">-- Chọn sự kiện --</option>
					        <option v-for="e in exhibitions" :key="e.id" :value="e.id">
					            {{ e.title }}
					        </option>
	                	</select>
                	</div>

                	<div>
                		<label class="block text-sm text-gray-700 font-semibold mb-1">Chọn khách hàng</label>
                		<select ref="customerSelect"></select>
                	</div>
			        
                </div>
                
                <div class="flex flex-col gap-3 text-sm">

				    <!-- MÃ BÁO GIÁ -->
					<div v-if="quotation?.code" class="inline-flex items-center gap-2">
					    <span class="text-gray-500">Mã báo giá</span>
					    <span class="px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-xs border border-green-200">
					        {{ quotation?.code }}
					    </span>
					</div>
					<!-- KHÁCH HÀNG -->
					<div v-if="customer" class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
					    <div class="flex items-center justify-between mb-2">
					        <h3 class="font-semibold text-gray-800"> Thông tin khách hàng </h3>
					    </div>
					    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
					        <div>
					            <span class="text-gray-400">Doanh nghiệp</span>
					            <p class="font-medium text-gray-700">
					                {{ customer?.company || 'N/A' }}
					            </p>
					        </div>
					        <div>
					            <span class="text-gray-400">Họ tên</span>
					            <p class="font-medium text-gray-700">
					                {{ customer?.fullname || 'N/A' }}
					            </p>
					        </div>
					        <div>
					            <span class="text-gray-400">Điện thoại</span>
					            <p class="text-gray-700">
					                {{ customer?.phone || 'N/A' }}
					            </p>
					        </div>
					        <div>
					            <span class="text-gray-400">Email</span>
					            <p class="text-gray-700 break-all">
					                {{ customer?.email || 'N/A' }}
					            </p>
					        </div>
					        <div>
					            <span class="text-gray-400">Ngày tạo báo giá</span>
					            <p class="text-gray-700">
					                {{ quotation?.created_at || 'N/A' }}
					            </p>
					        </div>
					        <div>
					            <span class="text-gray-400">Cập nhật báo giá</span>
					            <p class="text-gray-700 break-all">
					                {{ quotation?.updated_at || 'N/A' }}
					            </p>
					        </div>
					    </div>
					</div>

				</div>
            </div>
        </div>

        <form @submit.prevent="submit">
        	
        	<div class="bg-white border border-b-0 rounded-lg mb-5">

	            <table class="w-full">
	                <thead class="border-b">
	                    <tr>
	                        <th class="p-3 text-left w-12" width="5%">
	                            <input type="checkbox" class="w-4 h-4 rounded">
	                        </th>
	                        <th class="p-3 text-sm text-center font-medium" width="5%">#</th>
	                        <th class="p-3 text-sm text-left font-medium" width="5%">Ảnh</th>
	                        <th class="p-3 text-sm text-left font-medium" width="45%">Tên sản phẩm</th>
	                        <th class="p-3 text-sm text-left font-medium" width="10%">Đơn vị tính</th>
	                        <th class="p-3 text-sm text-left font-medium" width="10%">Đơn giá</th>
	                        <th class="p-3 text-sm text-center font-medium" width="10%">Số lượng</th>
	                        <th class="p-3 text-sm text-right font-medium" width="10%">Thành tiền</th>
	                    </tr>
	                </thead>
	                <tbody>
	                    <tr v-for="(item, index) in items" :key="index" class="border-b hover:bg-gray-100 transition-all">
	                        <td class="p-3">
	                            <input type="checkbox" class="w-4 h-4 rounded">
	                        </td>

	                        <td class="p-3">
	                            <div class="flex items-center justify-center gap-2">
	                                <div class="dropdown relative">
	                                    <!-- Trigger -->
	                                    <button type="button" class="dropdown-btn px-1 border rounded-full bg-white text-gray-700 border-gray-200">
	                                        <i class="ti ti-dots-vertical text-gray-400"></i>
	                                    </button>
	                                    <!-- Menu -->
	                                    <ul class="dropdown-menu hidden absolute mt-2 w-40 bg-white border rounded shadow-md py-1 z-50">
	                                        <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-sm">
	                                            <NuxtLink :to="`/system/product/${item.id}`" class="block w-full">
	                                                <i class="ti ti-edit"></i>&nbsp;&nbsp;Sửa sản phẩm
	                                            </NuxtLink>
	                                        </li>
	                                        <li class="px-4 py-2 text-red-500 hover:bg-red-500/10 cursor-pointer text-sm" @click="deleteItem(item.id)"><i class="ti ti-trash"></i>&nbsp;&nbsp;Xóa</li>
	                                    </ul>
	                                </div>
	                            </div>
	                        </td>

	                        <td class="p-3">
	                            <img :src="viewImage(item?.avatar || item?.product?.avatar)" :alt="item?.title" width="100%" class="rounded-lg">
	                        </td>

	                        <td class="p-3">
	                            <span class="text-gray-700 text-sm">{{ item?.title || item?.product?.title }}</span>
	                        </td>

	                        <td class="p-3">
	                            <span class="text-gray-500 text-sm ">{{ item?.unit || item?.product?.unit }}</span>
	                        </td>

	                        <td class="p-3">
	                            <span class="text-gray-500 text-sm">{{ formatMoney(item?.price) }}</span>
	                        </td>

	                        <td class="p-3">
	                            <div class="flex items-center border rounded-lg overflow-hidden">
								    <button type="button" @click="item.qty = Math.max(1, item.qty - 1)" class="px-2">-</button>
								    
								    <input
								        type="text"
								        inputmode="numeric"
    									pattern="[0-9]*"
								        v-model.number="item.qty"
								        class="w-full text-center outline-none text-sm"
								        @keydown="preventInvalidKey"
									    @input="onQtyInput($event, item)"
									    @blur="onQtyBlur(item)"
								    />
								    
								    <button type="button" @click="item.qty++" class="px-2">+</button>
								</div>
	                        </td>

	                        <td class="p-3 text-right">
	                            <span class="text-gray-800 text-sm">{{ formatMoney(item.qty * item.price) }}</span>
	                        </td>
	                    </tr>
	                    
	                </tbody>
	                <tfoot v-if="items.length > 0" class="border-b">
	                	<tr>
	                		<th colspan="6" class="p-3 text-right text-sm font-medium">Tổng cộng:</th>
	                		<th class="p-3 font-medium text-sm">{{ totalQty }}</th>
	                		<th class="p-3 text-right font-medium text-sm">{{ formatMoney(subTotal) }}</th>
	                	</tr>
	                	<tr>
	                		<th colspan="6" class="p-3 text-right font-medium text-sm">VAT (10%):</th>
	                		<th colspan="2" class="p-3 text-right font-medium text-sm">{{ formatMoney(vatAmount) }}</th>
	                	</tr>
	                	<tr>
	                		<th colspan="6" class="p-3 text-right font-medium text-sm">Giảm giá:</th>
	                		<th colspan="2" class="p-3 text-right font-medium text-sm">
	                			<input :value="formatMoney(discount)"
									    @input="(e) => handleMoneyInput(e, (val) => discount = val)"
									    @keydown="onlyNumber"
									    type="text"
									    class="w-24 text-right border-b border-gray-300 focus:border-indigo-500 focus:outline-none pb-2"/>
							</th>
	                	</tr>
	                	<tr>
	                		<th colspan="6" class="p-3 text-right font-medium text-green-600">Thành tiền:</th>
	                		<th colspan="2" class="p-3 text-right font-medium text-green-600">{{ formatMoney(finalTotal) }}</th>
	                	</tr>
	                </tfoot>
	            </table>
	        </div>

	        <div class="bg-white p-4 rounded-lg mb-3 border">
	        	<label class="text-sm text-gray-700 mb-2 font-semibold block">Ghi chú</label>
            	<textarea v-model="note" class="w-full px-3 py-3 border border-gray-300 rounded-md text-sm outline-none resize-y focus:border-indigo-500 transition-colors" placeholder="Ghi chú" rows="3"></textarea>
	        </div>

        	<button type="submit" class="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white text-sm font-medium">
                Lưu dữ liệu
            </button>
        </form>

        <QuotationPrint class="fixed -z-10 opacity-0 pointer-events-none"
		    :quotation="quotation"
		    :items="items"
		    :customer="customer"
		    :exhibition="exhibition"
		/>
    </div>
</template>

<script setup lang="ts">
	
	import Swal from 'sweetalert2'
	import TomSelect from 'tom-select'

	definePageMeta({
        middleware: ['auth'],
    })

    const route = useRoute()
    const id = route.params.id
    const isEdit = computed(() => id && id !== 'create')

    const quotation = ref({})

    const products = ref([])
	const selectedProductId = ref('')
	const items = ref<any[]>([])

	const discount = ref(0)
	const isVat = ref(true)

	const exhibition = ref([])
	const exhibitions = ref([])
	const selectedExhibition = ref('')

	const customers = ref([])
	const customer = ref([])
	const selectedCustomer = ref('')
	const note = ref('')

	const {
	    onlyNumber,
	    handleMoneyInput
	} = useMoneyInput()

	onMounted(() => {
        fetch()
        fetchProducts()
        fetchExhibitions()
    })

	const customerSelect = ref()

	onMounted(() => {

	    new TomSelect(customerSelect.value, {

	        valueField: 'id',
	        labelField: 'fullname',
	        searchField: ['fullname', 'phone', 'company', 'email'],

	        placeholder: 'Tìm khách hàng...',

	        loadThrottle: 400,

	        load: async (query, callback) => {

	            if (!query.length) return callback()

	            const res = await useNuxtApp().$apiFetch('customer', {
	                method: 'POST',
	                body: {
	                    search: query
	                }
	            })

	            if (res.status) {
	                callback(res.data.data)
	            } else {
	                callback()
	            }
	        },

	        render: {

	            option(item: any, escape: any) {

	                return `
	                    <div class="py-2">
	                        <div class="font-medium">
	                            ${escape(item.fullname)}
	                        </div>

	                        <div class="text-xs text-gray-500">
	                            ${escape(item.phone || '')}
	                            ${item.company ? '• ' + escape(item.company) : ''}
	                        </div>
	                    </div>
	                `
	            },

	            item(item: any, escape: any) {

	                return `
	                    <div>
	                        ${escape(item.fullname)}
	                    </div>
	                `
	            }
	        },

	        onChange(value) {
	            selectedCustomer.value = value
	        }
	    })
	})

	const fetch = async() => {
        if (isEdit.value) {
            const res = await useNuxtApp().$apiFetch(`quotation/edit`, {
                params: {
                    id
                }
            })

            if (res.status) {

            	const data = res.data

            	quotation.value = data

            	discount.value = data.discount
            	note.value = data.note
            	customer.value = data.customer
            	exhibition.value = data.exhibition

                selectedCustomer.value = data.customer_id
                selectedExhibition.value = data.exhibition_id

                items.value = data.details.map(i => ({
			        id: i.product_id,
			        title: i.product?.title,
			        avatar: i.product?.avatar || '',
			        price: i.price,
			        unit: i.unit,
			        qty: i.qty
			    }))


            }
        }
    }

	/* ================= FETCH PRODUCT ================= */
	const fetchProducts = async () => {
	    const res = await useNuxtApp().$apiFetch('product')
	    if (res.status) {
	        products.value = res.data.data
	    }
	}

	/* ================= FETCH CUSTOMER ================= */
	const fetchCustomers = async () => {
	    const res = await useNuxtApp().$apiFetch('customer', {
	    	method: "POST"
	    })

	    if (res.status) {
	        customers.value = res.data.data
	    }
	}

	/* ================= FETCH EXHIBITION ================= */
	const fetchExhibitions = async () => {
	    const res = await useNuxtApp().$apiFetch('exhibition')

	    if (res.status) {
	        exhibitions.value = res.data
	    }
	}

	/* ================= ADD PRODUCT ================= */
	const addProduct = () => {
	    const product = products.value.find(p => p.id === selectedProductId.value)

	    if (!product) return

	    // nếu đã tồn tại → tăng số lượng
	    const exist = items.value.find(i => i.id === product.id)

	    if (!exist) {
	        items.value.push({
	            id: product.id,
	            title: product.title,
	            price: product.price,
	            unit: product.unit,
	            avatar: product.avatar,
	            qty: 1
	        })
	    }

	    selectedProductId.value = ''
	}

	/* ================= REMOVE ================= */
	const removeItem = (index: number) => {
	    items.value.splice(index, 1)
	}

	/* ================= CALC ================= */
	const totalQty = computed(() =>
	    items.value.reduce((sum, i) => sum + i.qty, 0)
	)

	const subTotal = computed(() =>
	    items.value.reduce((sum, i) => sum + (i.qty * i.price), 0)
	)

	const vatAmount = computed(() =>
	    isVat.value ? subTotal.value * 0.1 : 0
	)

	const finalTotal = computed(() =>
	    subTotal.value - discount.value + vatAmount.value
	)

	/* ================= SUBMIT ================= */
	const submit = async () => {

		if(!selectedCustomer.value) {
			notify.error({
                title: 'Bắt buộc chọn',
                description: 'Vui lòng chọn khách hàng'
            })
            return
		}

		if(!selectedExhibition.value) {
			notify.error({
                title: 'Bắt buộc chọn',
                description: 'Vui lòng chọn sự kiện'
            })
            return
		}

		if(items.value.length == 0) {
			notify.error({
                title: 'Bắt buộc chọn',
                description: 'Vui lòng chọn sản phẩm'
            })
            return
		}

		if(finalTotal.value < 0) {
			notify.error({
                title: 'Có lỗi',
                description: 'Thành tiền đang bị âm'
            })
            return
		}

	    const res = await useNuxtApp().$apiFetch('quotation/save', {
	        method: 'POST',
	        body: {
	        	id: isEdit.value ? id : null,
	        	customer_id: selectedCustomer.value,
	        	exhibition_id: selectedExhibition.value,
	            items: items.value,
	            discount: discount.value,
	            is_vat: isVat.value,
	            note: note.value
	        }
	    })

	    if (res.status) {
	        notify.success({
                title: 'Thông báo',
                description: res.message
            })

            navigateTo(`/contract/quotation/${res.data.id}`)
	    } else {
	    	notify.error({
                title: 'Có lỗi',
                description: res.message
            })
	    }
	}

	const preventInvalidKey = (e: KeyboardEvent) => {
	    const invalidKeys = ['e', 'E', '+', '-', '.', ',']

	    if (invalidKeys.includes(e.key)) {
	        e.preventDefault()
	    }
	}

	const onQtyInput = (e: Event, item) => {
	    const val = (e.target as HTMLInputElement).value

	    // chỉ cho số
	    if (!/^\d*$/.test(val)) {
	        item.qty = 1
	        return
	    }

	    item.qty = val === '' ? '' : Number(val)
	}
	
	const onQtyBlur = (item) => {
	    if (!item.qty || item.qty < 1) {
	        item.qty = 1
	    }
	}

	const deleteItem = (id) => {
		Swal.fire({
            title: "Xóa dữ liệu",
            text: "Bạn chắc chắn muốn xóa dữ liệu này",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Đóng"
        }).then(async (result) => {
            if (result.isConfirmed) {
            	items.value = items.value.filter(i => i.id !== id)
            }
        })
	}

	const exportFile = async() => {
		if(isEdit.value) {
			Swal.fire({
	            title: "Xuất file báo giá",
	            html: `<span class="font-semibold text-green-600">${quotation?.value?.code}</span>`,
	            icon: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#3085d6",
	            cancelButtonColor: "#d33",
	            confirmButtonText: "Đồng ý",
	            cancelButtonText: "Đóng"
	        }).then(async (result) => {
	            if (result.isConfirmed) {
	            	print()
	            }
	        })
		}
	}

	const print = () => {
		const content = document.getElementById('print-area')

	    if (!content) {
	        alert('Không có dữ liệu để in')
	        return
	    }

	    const iframe = document.createElement('iframe')
	    iframe.style.position = 'fixed'
	    iframe.style.right = '0'
	    iframe.style.bottom = '0'
	    iframe.style.width = '0'
	    iframe.style.height = '0'
	    iframe.style.border = '0'

	    document.body.appendChild(iframe)

	    const doc = iframe.contentWindow.document

	    // 👉 clone toàn bộ head (giữ Tailwind)
	    doc.open()
	    doc.write(`
	        <html>
	            <head>
	                ${document.head.innerHTML}
	            </head>
	            <body>
	                ${content.innerHTML}
	            </body>
	        </html>
	    `)
	    doc.close()

	    iframe.onload = () => {
	        iframe.contentWindow.focus()
	        iframe.contentWindow.print()

	        setTimeout(() => {
	            document.body.removeChild(iframe)
	        }, 500)
	    }
	}

</script>