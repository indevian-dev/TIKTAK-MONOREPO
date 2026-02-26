
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';

const PublicUnderConstructionWidget = () => {
    const { t } = loadClientSideCoLocatedTranslations('PublicUnderConstructionWidget');

    return (
        <div className="relative w-full h-screen flex flex-wrap justify-center items-center pt-20  md:pt-20">
            <div className='relative w-full lg:w-4/5 flex h-screen flex-wrap justify-center items-center' style={{
                backgroundImage: `url('/constract.png')`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <h2 className='w-full text-center font-bold text-3xl lg:text-5xl'>{t('under_construction')}</h2>
            </div>

        </div>
    );
}

export default PublicUnderConstructionWidget;
