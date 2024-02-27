import './assets/css/orderDataGrid.css';
import './assets/scss/style.scss';
import './assets/css/invoiceTemplate.css'

// third party
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.jsx';

// project imports
import * as serviceWorker from './serviceWorker';
import App from './App';

// style + assets
import config from './config';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
      <BrowserRouter basename={config.basename}> 
          <App />
        </BrowserRouter>
     </Provider>
);
serviceWorker.unregister();
