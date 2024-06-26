//  http server instance
import {app} from './server.js';
import auth from '../routes/http-routes/auth.routes.js';
import movies from '../routes/http-routes/movies.routes.js';
import store from '../routes/http-routes/upload.route.js';
import revproxy from  '../routes/http-routes/proxy.route.js';
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>res.send(`Server is running, ${new Date()}`))
app.use('/auth',auth);
app.use('/movies',movies);
app.use('/store',store);
app.use('/video',revproxy);

export {app};