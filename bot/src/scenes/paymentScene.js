const { Scenes } = require('telegraf');
const { minioClient, BUCKET_NAME } = require('../lib/minio');
const https = require('https');
const crypto = require('crypto');

const paymentWizard = new Scenes.WizardScene(
  'paymentScene',
  // Step 1: Prompt for photo
  async (ctx) => {
    const user = ctx.state.user;
    if (!user) {
      ctx.reply('Please authenticate first.');
      return ctx.scene.leave();
    }
    
    await ctx.reply(
      'Please send a photo of your payment screenshot.\n\nType /cancel to abort.'
    );
    return ctx.wizard.next();
  },
  // Step 2: Handle photo upload
  async (ctx) => {
    if (ctx.message && ctx.message.text === '/cancel') {
      await ctx.reply('Payment upload cancelled.');
      return ctx.scene.leave();
    }

    if (!ctx.message || !ctx.message.photo) {
      await ctx.reply('Please send a valid photo (or type /cancel).');
      return;
    }

    const user = ctx.state.user;
    const photos = ctx.message.photo;
    // Telegram sends multiple sizes, the last one is the largest
    const fileId = photos[photos.length - 1].file_id;

    try {
      await ctx.reply('Processing your upload... please wait.');
      
      const fileUrl = await ctx.telegram.getFileLink(fileId);
      const ext = fileUrl.href.split('.').pop();
      const objectName = `payments/${user.id}_${crypto.randomBytes(8).toString('hex')}.${ext}`;

      // Download from Telegram and upload to MinIO
      await new Promise((resolve, reject) => {
        https.get(fileUrl.href, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download image: ${response.statusCode}`));
            return;
          }
          
          minioClient.putObject(
            BUCKET_NAME,
            objectName,
            response,
            response.headers['content-length'],
            { 'Content-Type': `image/${ext}` },
            (err, etag) => {
              if (err) return reject(err);
              resolve(etag);
            }
          );
        }).on('error', reject);
      });

      // Save to database
      await ctx.prisma.payment.create({
        data: {
          user_id: user.id,
          amount: 0, // We can prompt for amount later or let admin set it
          screenshot_url: objectName,
          status: 'pending'
        }
      });

      await ctx.reply('✅ Payment screenshot uploaded successfully! An admin will review it and update your balance.');
    } catch (error) {
      console.error('Payment upload error:', error);
      await ctx.reply(`❌ Failed to process upload: ${error.message}`);
    }

    return ctx.scene.leave();
  }
);

paymentWizard.command('cancel', async (ctx) => {
  await ctx.reply('Payment upload cancelled.');
  return ctx.scene.leave();
});

module.exports = paymentWizard;
