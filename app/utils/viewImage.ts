export function viewImage(imagePath: string | null): string {
    if (imagePath && imagePath.trim() !== '') {
        // Kiểm tra nếu imagePath là một URL hợp lệ
        try {
            const url = new URL(imagePath);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                return imagePath; // Return nguyên URL nếu là đường link hợp lệ
            }
        } catch (e) {
            // Không phải URL hợp lệ, tiếp tục xử lý như đường dẫn bình thường
        }

        // Xử lý như đường dẫn nội bộ
        return `${useRuntimeConfig().public.apiFile}${imagePath}`;
    }

    // Trả về avatar mặc định nếu imagePath không hợp lệ hoặc rỗng
    return '/no-avatar.png';
}