<template>

    <div class="bg-white rounded border overflow-hidden">
        
        <Willow>
            <Fullscreen hotkey="ctrl+shift+f">
                <Gantt ref="api" :tasks="ganttTasks" :scales="scales" :zoom="true" :columns="columns" :cellWidth="20" :cellHeight="30" :scaleHeight="25" :highlightTime="highlightTime" :init="init"/>
            </Fullscreen>
        </Willow>
        
    </div>

</template>

<script setup lang="ts">
    import { Gantt, Willow } from "@svar-ui/vue-gantt";
    import { Fullscreen } from "@svar-ui/vue-core";

    import "@svar-ui/vue-gantt/all.css";

    const emit = defineEmits(['openTask'])

    const api = ref(null)

    const props = defineProps({
        tasks: {
            type: Array,
            default: () => []
        }
    })

    const ganttTasks = computed(() => {

        return props.tasks.map((task: any) => ({
            id: task.id,
            text: task.title,
            start: new Date(task.start_date),
            end: new Date(task.end_date),
            progress: task.progress || 0,
            assigned: task?.user?.fullname,
            type: 'task',
            lazy: false

        }))
    })

    const onTaskClick = (task: any) => {
        console.log(task)
    }

    const columns = [
        {
            id: "text",
            header: "Công việc",
            flexgrow: 2,
            // editor: "text",
        },
        {
            id: "start",
            header: "Bắt đầu",
            flexgrow: 1,
            align: "center",
            // editor: "datepicker",
        },
        {
            id: "assigned",
            header: "Giao cho",
            flexgrow: 2,
            align: "center",
            // editor: "text",
        },
        {
            id: "add-task",
            header: "",
            flexgrow: 2,
            align: "center",
        }
    ];

    const scales = [
        { unit: "month", step: 2, format: "%F %Y" },
        { unit: "day", step: 1, format: "%j" },
    ];

    function isDayOff(date) {
        const d = date.getDay();
        return d == 4 || d == 5;
    }

    function isHourOff(date) {
        const h = date.getHours();
        return h < 8 || h == 12 || h > 17;
    }

    function highlightTime(d, u) {
        if (u == "day" && isDayOff(d)) return "wx-weekend";
        if (u == "hour" && (isDayOff(d) || isHourOff(d))) return "wx-weekend";
        return "";
    }

    function init(api) {
        api.intercept("show-editor", data => {
            emit('openTask', data.id)
        });

        api.intercept("sort-task", data => {
            console.log(data)
        })
    }
</script>