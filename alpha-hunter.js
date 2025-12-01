const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// ENV
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

// رسالة البداية
let message =
  `ألفا يومية من CryptoNinjaEG 🥷\n` +
  `التاريخ: ${new Date().toLocaleDateString('ar-EG')}\n\n`;

(async () => {
  try {
    /* ================================
        1) إحضار الإيردروبات
    ================================= */
    let airdrops = [];
    try {
      const airdrop = await axios.get(
        'https://api.airdropalert.com/v1/airdrop?status=active',
        { timeout: 10000 }
      );
      airdrops = airdrop.data.airdrops || [];
    } catch (err) {
      message += "⚠️ تعذر جلب بيانات الإيردروبات الآن.\n\n";
    }

    if (airdrops.length > 0) {
      message += "🔥 أفضل إيردروبات اليوم:\n";
      airdrops.slice(0, 6).forEach((a, i) => {
        message += `${i + 1}. ${a.title || "مشروع جديد"}\n` +
                   `🎁 المكافأة: ${a.reward || "غير محدد"}\n` +
                   `🔗 الرابط: ${a.link || "غير متوفر"}\n\n`;
      });
    } else {
      message += "⏳ لا يوجد إيردروبات نشطة حاليًا\n\n";
    }

    /* ================================
        2) العملات الأكثر صعودًا
    ================================= */
    let gainers = [];
    try {
      const cg = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "price_change_24h_desc",
            per_page: 5,
            page: 1
          },
          timeout: 12000
        }
      );
      gainers = cg.data || [];
    } catch (err) {
      message += "⚠️ تعذر جلب بيانات العملات من CoinGecko.\n\n";
    }

    if (gainers.length > 0) {
      message += "🚀 أقوى 5 عملات صاعدة اليوم:\n";
      gainers.forEach((c, i) => {
        message += `${i + 1}. ${c.name} (${c.symbol.toUpperCase()})\n` +
                   `📈 +${c.price_change_percentage_24h.toFixed(2)}%\n` +
                   `💲 السعر: $${c.current_price}\n\n`;
      });
    }

    // ختم
    message += "تابعنا: @Mohaway2000\n#CryptoNinjaEG";

    // إرسال الرسالة
    await bot.sendMessage(chatId, message, { disable_web_page_preview: true });
    console.log("تم الإرسال بنجاح! ✅");

  } catch (err) {
    await bot.sendMessage(chatId, "حصل مشكلة مؤقتة، راجع بعد ساعة 🥷");
    console.error("خطأ:", err.message);
  }
})();
