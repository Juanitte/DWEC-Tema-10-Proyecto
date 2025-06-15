import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t, i18n } = useTranslation();

    return (
        <>
            <div className="w-full max-w-md px-4 py-6 text-sm text-gray-300">
                <div className="flex flex-wrap justify-between gap-2">
                    <a href="#"><p>{t('FOOTER.TERMS')}</p></a>
                    <a href="#"><p>{t('FOOTER.PRIVACY-POLICY')}</p></a>
                    <a href="#"><p>{t('FOOTER.COOKIES')}</p></a>
                </div>
                <div className="mt-4">
                    <p className="text-gray-400">{t('FOOTER.COPYRIGHT')}</p>
                </div>
            </div>
        </>
    )
}