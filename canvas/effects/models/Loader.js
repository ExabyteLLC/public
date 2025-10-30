class Loader {
    static async loadImage(source) {
        if (typeof source === 'string') {
            return this.loadImageFromUrl(source);
        } else if (source instanceof File) {
            return this.loadImageFromFile(source);
        }
    }
    static async loadImageFromUrl(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    static async loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    static canvasImageData(image, width, height, keepAspectRatio = true) {
        if (!width) width = image.naturalWidth;
        if (!height) height = image.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (keepAspectRatio) {
            const imgAspect = image.naturalWidth / image.naturalHeight;
            const canvasAspect = width / height;
            let drawWidth, drawHeight, offsetX, offsetY;
            if (imgAspect > canvasAspect) {
                drawWidth = width;
                drawHeight = width / imgAspect;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            } else {
                drawWidth = height * imgAspect;
                drawHeight = height;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            }
            ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            ctx.drawImage(image, 0, 0, width, height);
        }

        return ctx.getImageData(0, 0, width, height);
    }
}