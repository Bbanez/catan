export async function getPixelData(url: string): Promise<ImageData> {
    return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject('Canvas not supported!');
            } else {
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, img.width, img.height);
                resolve(data);
            }
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = url;
    });
}
