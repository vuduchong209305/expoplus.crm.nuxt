import { toast } from "vue-sonner";

interface NotifyOptions {
    title?: string;
    description: string;
    link?: string;
    duration?: number;
}

const toastStyles = {
    success: {
        background: '#dcfce7', // xanh nhạt
        color: '#15803d'       // xanh đậm
    },
    error: {
        background: '#fee2e2',
        color: '#b91c1c'
    },
    info: {
        background: '#dbeafe',
        color: '#1d4ed8'
    },
    warning: {
        background: '#fef9c3',
        color: '#92400e'
    },
    default: {
        background: '#f3f4f6',
        color: '#111827'
    }
};

// Hàm gọi thông báo chung (mặc định là `toast()`)
const showToast = (type?: "success" | "error" | "info" | "warning", options: NotifyOptions) => {
    const { title = "Thông báo", description, link, duration = 5000 } = options;

    const notifyFn = type ? toast[type] : toast; // Nếu không có type -> dùng `toast()` mặc định
    const style = type ? toastStyles[type] : toastStyles.default;

    notifyFn(title, {
        description,
        duration,
        style,
        action: link
            ? {
                  label: "Xem",
                  onClick: () => window.open(link, "_self"),
              }
            : undefined,
    });
};

// Object `notify` chứa các phương thức tiện lợi
export const notify = Object.assign(
    (options: NotifyOptions) => showToast(undefined, options), // Mặc định là `toast()`
    {
        success: (options: NotifyOptions) => showToast("success", options),
        error: (options: NotifyOptions) => showToast("error", options),
        info: (options: NotifyOptions) => showToast("info", options),
        warning: (options: NotifyOptions) => showToast("warning", options),
    }
);