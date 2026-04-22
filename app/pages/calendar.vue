<template>

	<div class="p-4 lg:p-6">
		<div class="bg-white p-4 rounded-lg mb-3 border">
			<FullCalendar ref="calendarRef" :options="calendarOptions" />
		</div>
	</div>
	
	<Offcanvas :open="open" @close="open = false">
        <EventDetail :event="selectedEvent" @saved="handleSaved" @close="closeCanvas"/>
    </Offcanvas>

</template>

<script setup lang="ts">

	import FullCalendar from '@fullcalendar/vue3'
	import dayGridPlugin from '@fullcalendar/daygrid'
	import timeGridPlugin from '@fullcalendar/timegrid'
	import interactionPlugin from '@fullcalendar/interaction'
	import viLocale from '@fullcalendar/core/locales/vi'

	definePageMeta({
		middleware: ['auth'],
	})

	const emit = defineEmits(['close'])

	const events = ref([])
	const selectedEvent = ref('')
	const open = ref(false)
	const calendarRef = ref(null)
	
	const fetchEvents = async (info, successCallback, failureCallback) => {

	    try {
	        const res = await useNuxtApp().$apiFetch(`event`, {
	            params: {
	                start: new Date(info.start).toISOString(),
	                end: new Date(info.end).toISOString()
	            }
	        })

	        const mapped = res.data.map(e => ({
	            id: e.id,
	            title: e.title,
	            start: e.start_time,
	            end: e.end_time || e.start_time,
	            color: getColor(e.type),
	            extendedProps: {
    				type: e.type
  				}
	        }))

	        successCallback(mapped)

	    } catch (err) {
	        failureCallback(err)
	    }
	}

	const getColor = (type) => {
	    return {
		    call: '#4285F4',     // xanh Google
		    meeting: '#34A853',  // xanh lá
		    task: '#FBBC05'      // vàng
		}[type]
	}

	const calendarOptions = {
		events: fetchEvents,
	    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
		initialView: 'timeGridWeek', // giống Google mặc định
		timeZone: 'Asia/Ho_Chi_Minh',
		locale: viLocale,
		selectable: true, // 🔥 drag tạo event
		editable: true,
		nowIndicator: true, // dòng thời gian hiện tại

		slotMinTime: "06:00:00",
		slotMaxTime: "18:00:00",

		allDaySlot: true,

		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},

		titleFormat: {
			year: 'numeric',
			month: 'long'
		},

		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		},

		buttonText: {
			today: 'Hôm nay',
			month: 'Tháng',
			week: 'Tuần',
			day: 'Ngày'
		},

		select: (info) => {
		  	openCreateEvent({
		    	start: info.start,
		    	end: info.end
		  	})
		},

		dateClick: (info) => {
		  	openCreateEvent({
		    	start: info.dateStr,
		    	end: info.dateStr
		  	})
		},

	    eventDrop: async (info) => {
	        await useNuxtApp().$apiFetch('event/update-time', {
	            method: 'POST',
	            body: {
	                id: info.event.id,
	                start: info.event.start.toISOString(),
	                end: info.event.end ? info.event.end.toISOString() : null
	            }
	        })
	    },

	    eventResize: async (info) => {
		    await useNuxtApp().$apiFetch('event/update-time', {
		        method: 'POST',
		        body: {
		            id: info.event.id,
		            start: info.event.start.toISOString(),
		            end: info.event.end ? info.event.end.toISOString() : null
		        }
		    })
		},

		eventDidMount: (info) => {
  			info.el.title = info.event.title
		},

		eventClick: (info) => {
		  	if (info.jsEvent.detail === 2) {
			    openEditEvent(info.event)
			}
		}
	}

	const openCreateEvent = (data) => {
		selectedEvent.value = {
			title: '',
			type: 'call',
			start_time: data.start,
			end_time: addMinutes(data.end, 30),
			location: '',
			note: '',
			reminder_minutes: 0
		}

    	open.value = true
    }

	const openEditEvent = async (event) => {
	    const res = await useNuxtApp().$apiFetch('event/detail', {
	        params: {
	            id: event.id
	        }
	    })

	    if (res.status) {
	        selectedEvent.value = res.data
	        open.value = true
	    }
	}

	const closeCanvas = () => {
		open.value = false
		selectedEvent.value = null
	}

	const handleSaved = () => {
		open.value = false
		calendarRef.value.getApi().refetchEvents()
	}

	const addMinutes = (date, mins) => {
		const d = new Date(date)
		d.setMinutes(d.getMinutes() + mins)
		return d
	}
</script>