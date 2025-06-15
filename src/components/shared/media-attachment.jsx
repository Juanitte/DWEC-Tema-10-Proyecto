import { useEffect, useState, useRef } from "react";
import useAttachmentLazyLoad from "../hooks/useAttachmentLazyLoad";
import { streamAttachment } from "../../services/posts-service";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";

export default function MediaAttachment({ attachment , onLoad }) {
  const { ref, isVisible } = useAttachmentLazyLoad();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const videoRef = useRef();
  const { t } = useTranslation();

  const theme = useTheme();

  // Detectar MIME según extensión:
  const getMimeTypeFromPath = (path) => {
    if (!path) return "application/octet-stream";
    const ext = path.split(".").pop().toLowerCase();

    // Vídeos
    if (["mp4", "webm", "ogg"].includes(ext)) {
      return `video/${ext}`;
    }

    // Imágenes
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
      // mapear 'jpg' → 'jpeg'
      const imageExt = ext === "jpg" ? "jpeg" : ext;
      return `image/${imageExt}`;
    }

    // Fallback
    return "application/octet-stream";
  };

  useEffect(() => {
    if (!isVisible || isVideo) return;

    (async () => {
      try {
        const res = await streamAttachment(attachment.id);
        if (!res.ok) throw new Error(res.status);
        const rawBlob = await res.blob();
        // enlazamos el MIME que ya tienes en `mimeType`
        const blob = new Blob([rawBlob], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        setImgUrl(blobUrl);
      } catch (err) {
        console.error("Error cargando imagen:", err);
      }
    })();

    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [isVisible]);

  const mimeType = getMimeTypeFromPath(attachment.path);
  const isVideo = mimeType.startsWith("video");

  // Poster (thumb) viene ya en attachment.thumbnail como "data:image/png;base64,…"
  const posterSrc = attachment.thumbnail || null;

  // Cuando el vídeo sea visible, hacemos fetch → Blob → URL.createObjectURL
  useEffect(() => {
    if (!isVisible || !isVideo) return;

    const fetchVideo = async () => {
      setLoadingVideo(true);
      try {
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
      catch (err) {
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
        className={`bg-[${theme.colors.primary}] border border-dashed border-[${theme.colors.textMid}] rounded-xl max-w-[90%] h-48 flex justify-center items-center text-[${theme.colors.textMid}]`}
      >
        <span className="text-sm">{t("LOADING.LOADING")}</span>
      </div>
    );
  }

  // Si no es vídeo, renderizamos la imagen normal:
  if (!isVideo) {
    return (
      <a href={imgUrl} target="_blank" rel="noopener noreferrer" ref={ref} className={`bg-[${theme.colors.primary}] border border-[${theme.colors.textMid}] rounded-xl flex flex-col justify-center items-center max-w-[90%]`} onClick={e => e.stopPropagation()}>
        <img src={imgUrl} onLoad={onLoad} alt="Post attachment" loading="lazy" className="rounded-xl object-cover w-full h-auto" />
      </a>
    );
  }

  // Si es vídeo, mostramos poster hasta que cargue videoUrl:
  return (
    <div
      ref={ref}
      className={`bg-[${theme.colors.primary}] border border-[${theme.colors.textMid}] rounded-xl max-w-[90%] overflow-hidden`}
      onClick={(event) => event.stopPropagation()}
    >
      {loadingVideo && (
        <div className="flex justify-center items-center h-48">
          <span className="text-sm">{t("LOADING.LOADING")}</span>
        </div>
      )}
      {!loadingVideo && (
        <video
          ref={videoRef}
          controls
          onLoad={onLoad}
          className="w-full h-auto rounded-xl object-contain"
          src={videoUrl || undefined}
          poster={posterSrc || undefined}
        />
      )}
    </div>
  );
}