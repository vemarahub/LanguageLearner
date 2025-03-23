const { ServiceProvider } = require('@adonisjs/fold');

module.exports = class EnvProvider extends ServiceProvider {
  register() {
    // Bind a custom Env implementation
    this.app.singleton('Adonis/Src/Env', () => {
      const Env = require('@adonisjs/framework/src/Env');
      const path = require('path');
      const dotEnv = require('dotenv');

      // Load .env file, but don’t throw an error if it’s missing
      const envPath = path.resolve(__dirname, '..', '.env');
      dotEnv.config({ path: envPath });

      // Return the Env instance
      return new Env();
    });
  }
};
