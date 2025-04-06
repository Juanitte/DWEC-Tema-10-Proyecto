export default function ImageComponent({ image }) {
    const base64Image = `data:image/jpeg;base64,${image.file}`;

    const byteCharacters = atob(image.file);
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

    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);

    return (
        <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-800 border border-gray-300 rounded-xl flex flex-col justify-content-center items-center max-w-[90%]"
            onClick={(event) => event.stopPropagation()}
        >
            <img
                src={base64Image}
                className="rounded-xl object-cover"
                alt="Post attachment"
            />
        </a>
    );
}
