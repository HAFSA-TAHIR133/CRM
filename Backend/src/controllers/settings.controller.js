import SettingsService from '../services/settings.services.js';

class SettingsController  {
  async getSettings(req, res) {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateSettings(req, res) {
    try {
      const settings = await SettingsService.updateSettings(req.body);
      res.json({ success: true, data: settings, message: "Settings updated successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default new SettingsController();