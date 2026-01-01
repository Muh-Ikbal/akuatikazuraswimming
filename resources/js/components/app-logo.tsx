import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-12 items-center justify-center rounded-4xl bg-white">
                <AppLogoIcon className="size-11 rounded-4xl object-contain" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold font-poppins leading-tight text-primary">
                    Akuatik Azura
                </span>
            </div>
        </>
    );
}
