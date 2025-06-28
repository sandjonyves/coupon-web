const { Expo } = require('expo-server-sdk');
const { getAllExpoTokensData } = require('../controllers/authController');

// Create a new Expo SDK client
const expo = new Expo();

// Function to send push notification to a single device
const sendToDevice = async (pushToken, message, title = 'Notification', data = {}) => {
  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token!`);
    return false;
  }

  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  const pushMessage = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: message,
    data: data,
  };

  // Send the message
  const chunks = expo.chunkPushNotifications([pushMessage]);
  const tickets = [];

  for (let chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending chunk:', error);
    }
  }

  // Check the receipts
  const receiptIds = tickets.map(ticket => ticket.id);
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      for (let receiptId in receipts) {
        const { status, message, details } = receipts[receiptId];
        if (status === 'error') {
          console.error(`There was an error sending a notification: ${message}`);
          if (details && details.error) {
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking receipts:', error);
    }
  }

  return true;
};

// Function to send push notification to all devices
const sendToAllDevices = async (message, title = 'Notification', data = {}) => {
  try {
    // Get all device tokens directly from the database
    const deviceTokens = await getAllExpoTokensData();
    
    if (deviceTokens.length === 0) {
      console.log('No device tokens found');
      return false;
    }

    console.log(`Sending notification to ${deviceTokens.length} devices`);

    // Send to each device
    const results = await Promise.allSettled(
      deviceTokens.map(token => sendToDevice(token, message, title, data))
    );

    const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failed = results.length - successful;

    console.log(`Notification sent: ${successful} successful, ${failed} failed`);
    return successful > 0;

  } catch (error) {
    console.error('Error sending to all devices:', error);
    return false;
  }
};

// Function to send coupon notification to all devices
const sendCouponNotification = async (couponData) => {
  try {
    const { id, type, montant, devise, codes, email } = couponData;
    
    const message = `Nouveau coupon reçu ! ${type} de ${montant} ${devise}`;
    const title = '🎫 Nouveau Coupon';
    const data = {
      type: 'coupon',
      couponId: id,
      couponType: type,
      amount: montant,
      currency: devise,
      email: email,
      codes: codes
    };

    const result = await sendToAllDevices(message, title, data);
    
    if (result) {
      const deviceTokens = await getAllExpoTokensData();
      return {
        success: true,
        successCount: deviceTokens.length,
        message: 'Notification de coupon envoyée avec succès'
      };
    } else {
      return {
        success: false,
        message: 'Aucun appareil enregistré pour les notifications push'
      };
    }

  } catch (error) {
    console.error('Error sending coupon notification:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de la notification de coupon',
      error: error.message
    };
  }
};

// Function to send push notification to multiple specific devices
const sendToMultipleDevices = async (pushTokens, message, title = 'Notification', data = {}) => {
  if (!Array.isArray(pushTokens) || pushTokens.length === 0) {
    console.error('No push tokens provided');
    return false;
  }

  // Filter out invalid tokens
  const validTokens = pushTokens.filter(token => Expo.isExpoPushToken(token));
  
  if (validTokens.length === 0) {
    console.error('No valid push tokens found');
    return false;
  }

  console.log(`Sending notification to ${validTokens.length} devices`);

  // Send to each device
  const results = await Promise.allSettled(
    validTokens.map(token => sendToDevice(token, message, title, data))
  );

  const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - successful;

  console.log(`Notification sent: ${successful} successful, ${failed} failed`);
  return successful > 0;
};

module.exports = {
  sendToDevice,
  sendToAllDevices,
  sendToMultipleDevices,
  sendCouponNotification
}; 