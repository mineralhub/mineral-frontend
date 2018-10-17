import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

moment.relativeTimeThreshold('ss', 1);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
