import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t , i18n } = useTranslation();

    return (
        <>
            <div className="flow-root p-6 inline">
                <div className="flex-1 gap-2 pl-2 flex flex-row flex-wrap justify-between">
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            {t('FOOTER.TERMS')}
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            {t('FOOTER.PRIVACY-POLICY')}
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            {t('FOOTER.COOKIES')}
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            {t('FOOTER.SPANISH')}
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            {t('FOOTER.ENGLISH')}
                        </p>
                    </a>
                </div>
                <div className="flex-2 pl-2">
                    <p className="text-sm leading-6 font-medium text-gray-400">{t('FOOTER.COPYRIGHT')}</p>
                </div>
            </div>
        </>
    )
}