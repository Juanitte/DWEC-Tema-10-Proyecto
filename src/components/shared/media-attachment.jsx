import useAttachmentLazyLoad from "../hooks/useAttachmentLazyLoad";

export default function MediaAttachment({ image }) {
    const { ref, isVisible } = useAttachmentLazyLoad();

    const getMimeTypeFromPath = (path) => {
        if (!path) return 'image/jpeg';
        const ext = path.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        if (['mp4', 'webm', 'ogg'].includes(ext)) return `video/${ext}`;
        return 'application/octet-stream';
    };

    const mimeType = getMimeTypeFromPath(image.path);
    const isVideo = mimeType.startsWith('video');

    // No cargar aún
    if (!isVisible) {
        return (
            <div
                ref={ref}
                className="bg-green-900 border border-dashed border-gray-600 rounded-xl max-w-[90%] h-48 flex justify-center items-center text-gray-400"
            >
                <span className="text-sm">Cargando adjunto...</span>
            </div>
        );
    }

    if (!isVideo) {
        const base64Image = `data:${mimeType};base64,${image.file}`;
        return (
            <a
                href={base64Image}
                target="_blank"
                rel="noopener noreferrer"
                ref={ref}
                className="bg-green-800 border border-gray-300 rounded-xl flex flex-col justify-center items-center max-w-[90%]"
                onClick={(event) => event.stopPropagation()}
            >
                <img
                    src={base64Image}
                    className="rounded-xl object-cover w-full h-auto"
                    alt="Post attachment"
                    loading="lazy"
                />
            </a>
        );
    }

    const byteCharacters = atob(image.file);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    return (
        <div
            ref={ref}
            className="bg-green-800 border border-gray-300 rounded-xl max-w-[90%] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
        >
            <video
                controls
                className="w-full h-auto rounded-xl object-contain"
                src={blobUrl}
            />
        </div>
    );
}