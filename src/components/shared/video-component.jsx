export default function VideoComponent({ video }) {
    let blobUrl = '';
    let mimeType = 'video/mp4';

    if (video.url) {
        blobUrl = video.url;
    } else if (video.file) {
        const base64 = video.file;
        const extension = video.name?.split('.').pop()?.toLowerCase();

        const mimeMap = {
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg'
        };

        mimeType = mimeMap[extension] || 'video/mp4';

        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: mimeType });
        blobUrl = URL.createObjectURL(blob);
    }

    return (
        <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-800 border border-gray-300 rounded-xl flex flex-col justify-content-center items-center max-w-[90%]"
            onClick={(event) => event.stopPropagation()}
        >
            <video
                src={blobUrl}
                className="rounded-xl object-cover max-h-96"
                controls
            />
        </a>
    );
}