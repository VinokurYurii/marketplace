import { ConfigService } from './config/config.service';

const service = new ConfigService();
module.exports = service.getOrmConfig();
