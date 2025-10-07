import { Buffer } from 'buffer';

export async function fileToUint8Array(file: File): Promise<Uint8Array> {
    return await new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(new Uint8Array(reader.result as ArrayBuffer));
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

export async function fileToB64(file: File): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result as string);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

export function bufferToFile(
    filename: string,
    mimetype: string,
    buffer: Buffer,
): File {
    return new File([buffer], filename || `temp.${mimetype.split('/')[1]}`, {
        type: mimetype,
    });
}

export function b64ToFile(fileB64: string, fileName?: string): File {
    const [data, b64] = fileB64.split(',');
    if (!data) {
        throw Error('Data part is missing');
    }
    if (!b64) {
        throw Error('Buffer part is missing');
    }
    const mimetype = data.split(':')[1]?.split(';')[0];
    if (!mimetype) {
        throw Error('Mimetype is missing');
    }
    return new File(
        [Buffer.from(b64, 'base64')],
        fileName || `temp.${mimetype.split('/')[1]}`,
        {
            type: mimetype,
        },
    );
}

export function bufferToBlobUrl(mimetype: string, data: Buffer): string {
    const blob = new Blob([new Uint8Array(data)], { type: mimetype });
    return URL.createObjectURL(blob);
}

export function prettyFileSize(size: number): string {
    if (size > 1000000000) {
        return `${(size / 1000000000).toFixed(1)} GB`;
    } else if (size > 1000000) {
        return `${(size / 1000000).toFixed(1)} MB`;
    }
    if (size > 1000) {
        return `${(size / 1000).toFixed(1)} KB`;
    }
    return `${size} B`;
}

export function downloadBuffer(
    filename: string,
    mimetype: string,
    data: Buffer,
): void {
    const blob = new Blob([new Uint8Array(data)], { type: mimetype });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
}

export function truncateFileName(
    fileName: string,
    maxLength: number = 20,
): string {
    // Validate input
    if (typeof fileName !== 'string' || fileName.trim() === '') {
        throw Error('invalid file name');
    }
    // Check for the last dot in the filename (which would separate the name and extension)
    const lastDotIndex = fileName.lastIndexOf('.');
    let fName: string;
    let fExtension: string = '';
    const ellipsis = '...';
    const ellipsisLength = ellipsis.length;
    // If there's no dot, or the dot is the first or last character, treat it as having no extension
    if (
        lastDotIndex === -1 ||
        lastDotIndex === 0 ||
        lastDotIndex === fileName.length - 1
    ) {
        fName = fileName;
    } else {
        fName = fileName.substring(0, lastDotIndex);
        fExtension = fileName.substring(lastDotIndex + 1);
    }
    const totalLength = fName.length + fExtension.length;
    // Determine if truncation is necessary
    if (totalLength + (fExtension ? 1 : 0) > maxLength) {
        const charsToShow = maxLength - fExtension.length - ellipsisLength;
        const startChars = Math.max(charsToShow, 0); // Ensure it's not negative
        // Return truncated file name
        return (
            fName.substring(0, startChars) +
            ellipsis +
            (fExtension ? fExtension : '')
        );
    } else {
        // If no truncation is needed, return the original filename with or without extension
        return fileName;
    }
}
