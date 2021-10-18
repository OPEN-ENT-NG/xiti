import { ng, model } from 'entcore'
import { xitiController } from './controller'
import { build } from './model';

ng.controllers.push(xitiController);
model.build = build;