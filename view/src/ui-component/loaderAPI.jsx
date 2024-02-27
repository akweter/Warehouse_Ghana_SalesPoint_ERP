import loader from 'assets/images/gifs/loader.webp';
import dotLoading from 'assets/images/gifs/dotLoading.webp';

export const LoadingSpinner = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', background: 'white'}}>
        <img src={loader} width={150} height={150} alt="Loading..." />
    </div>
);

export const circulerLoadingSpinner = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', background: 'blue'}}>
        <img src={dotLoading} width={150} height={150} alt="Loading..." />
    </div>
);
