import { ConfigService } from './modules/config/config.service';

const service = new ConfigService();
module.exports = service.getOrmConfig();
