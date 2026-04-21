<template>
	<div class="min-h-[100vh] flex items-center justify-center">
	    <div class="max-w-md w-full mx-auto px-4">

	        <div class="bg-white border border-gray-300 rounded-2xl p-8 overflow-hidden">

		        <div class="w-52 flex items-center justify-center mx-auto mb-3">
		            <img src="/logo.png" alt="" class="w-full">
		        </div>
			   	
	            <slot/>
	            
	        </div>

	    </div>
	</div>
</template>