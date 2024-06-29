// import loader from 'assets/images/gifs/loader.webp'
import Elli from '../assets/images/gifs/Elli.gif'

export const LoadingSpinner = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', background: 'white'}}>
        <img src={Elli} width={150} height={150} alt="Loading..." />
    </div>
);
