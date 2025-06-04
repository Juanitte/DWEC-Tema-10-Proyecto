import { useEffect, useState, useRef } from "react";
import useAttachmentLazyLoad from "../hooks/useAttachmentLazyLoad";
import { streamAttachment } from "../../services/posts-service";

export default function MediaAttachment({ attachment }) {
  const { ref, isVisible } = useAttachmentLazyLoad();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const videoRef = useRef();

  // Detectar MIME según extensión:
  const getMimeTypeFromPath = (path) => {
    if (!path) return "application/octet-stream";
    const ext = path.split(".").pop().toLowerCase();
    if (["mp4", "webm", "ogg"].includes(ext)) return `video/${ext}`;
    return "application/octet-stream";
  };

  const mimeType = getMimeTypeFromPath(attachment.path);
  const isVideo = mimeType.startsWith("video");

  // Poster (thumb) viene ya en attachment.thumbnail como "data:image/png;base64,…"
  const posterSrc = attachment.thumbnail || null;

  // Cuando el vídeo sea visible, hacemos fetch → Blob → URL.createObjectURL
  useEffect(() => {
    if (!isVisible || !isVideo) return;

    const fetchVideo = async () => {
      setLoadingVideo(true);
      try
      {
        const response = await streamAttachment(attachment.id);
        if (!response.ok) {
          console.error("Error al obtener el vídeo:", response.status);
          setLoadingVideo(false);
          return;
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoUrl(blobUrl);
      }
      catch (err)
      {
        console.error("Error fetching video attachment:", err);
      }
      finally {
        setLoadingVideo(false);
      }
    };

    fetchVideo();

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    // Placeholder mientras no entra el elemento en pantalla
    return (
      <div
        ref={ref}
        className="bg-green-900 border border-dashed border-gray-600 rounded-xl max-w-[90%] h-48 flex justify-center items-center text-gray-400"
      >
        <span className="text-sm">Cargando adjunto...</span>
      </div>
    );
  }

  // Si no es vídeo, renderizamos la imagen normal:
  if (!isVideo) {
    const base64Image = `data:${mimeType};base64,${attachment.file}`;
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

  // Si es vídeo, mostramos poster hasta que cargue videoUrl:
  return (
    <div
      ref={ref}
      className="bg-green-800 border border-gray-300 rounded-xl max-w-[90%] overflow-hidden"
      onClick={(event) => event.stopPropagation()}
    >
      {loadingVideo && (
        <div className="flex justify-center items-center h-48">
          <span className="text-gray-300">Cargando vídeo…</span>
        </div>
      )}
      {!loadingVideo && (
        <video
          ref={videoRef}
          controls
          className="w-full h-auto rounded-xl object-contain"
          src={videoUrl || undefined}
          poster={posterSrc || undefined}
        />
      )}
    </div>
  );
}