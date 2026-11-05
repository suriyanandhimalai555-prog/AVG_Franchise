import AppSetting from '../models/AppSetting.js';

// Get app version settings (always returns the primary singleton record)
export const getAppSettings = async (req, res) => {
  try {
    let settings = await AppSetting.findOne();

    // If no record exists yet, seed default row
    if (!settings) {
      settings = await AppSetting.create({
        androidCurrent: '1.0.0',
        androidMinimum: '1.0.0',
        iosCurrent: '1.0.0',
        iosMinimum: '1.0.0',
        releaseNotes: 'Initial release of AVG Franchise app.',
        forceUpdate: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching app settings.',
    });
  }
};

// Update or create app version settings
export const updateAppSettings = async (req, res) => {
  try {
    const { androidCurrent, androidMinimum, iosCurrent, iosMinimum, releaseNotes, forceUpdate } = req.body;

    let settings = await AppSetting.findOne();

    if (settings) {
      // Update existing record
      settings.androidCurrent = androidCurrent ?? settings.androidCurrent;
      settings.androidMinimum = androidMinimum ?? settings.androidMinimum;
      settings.iosCurrent = iosCurrent ?? settings.iosCurrent;
      settings.iosMinimum = iosMinimum ?? settings.iosMinimum;
      settings.releaseNotes = releaseNotes !== undefined ? releaseNotes : settings.releaseNotes;
      settings.forceUpdate = forceUpdate !== undefined ? forceUpdate : settings.forceUpdate;

      await settings.save();
    } else {
      // Create if none exists
      settings = await AppSetting.create({
        androidCurrent,
        androidMinimum,
        iosCurrent,
        iosMinimum,
        releaseNotes,
        forceUpdate,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'App version settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating app settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while saving app settings.',
    });
  }
};