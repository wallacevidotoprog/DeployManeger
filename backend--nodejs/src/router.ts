import {Router} from 'express';
import routerDeploy from './controllers/deploy.controller';
import routerAuth from './controllers/auth.controller';

const routeres = Router();


routeres.use('/deploy', routerDeploy );
routeres.use('auth',routerAuth)


export default routeres;