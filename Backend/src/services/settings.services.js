import db from '../models/index.js';

class SettingsService {
  async getSettings() {
    // For simplicity, we can use a single row in a Settings table
    let settings = await db.Setting.findOne();
    
    if (!settings) {
      settings = await db.Setting.create({
        systemName: "Enterprise CRM Platform",
        allowRegistration: false,
        maintenanceMode: false,
        notificationEmail: "alerts@system.com"
      });
    }
    return settings;
  }

  async updateSettings(data) {
    const settings = await db.Setting.findOne();
    if (settings) {
      return await settings.update(data);
    } else {
      return await db.Setting.create(data);
    }
  }
};

export default new SettingsService();