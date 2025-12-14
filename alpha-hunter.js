const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// ENV Variables - هتحطهم في Settings بتاعة الـ deploy
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

// رسالة البداية
let message = `🥷🔥💀 ألفا يومية سرية من CryptoNinjaEG 🥷🔥💀\n` +
              `📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}\n` +
              `🤑💎🪂 خليك نينجا وصيد الفرص قبل الجميع! 🪂💎🤑\n\n`;

(async () => {
  try {
    // ===== أقوى فرص فارمينج وإيردروبات نشطة (ديسمبر 2025) =====
    message += `🪂🔥💰 أقوى 6 فرص إيردروب وفارمينج نشطة الآن 🔥🪂💰\n\n`;
    message += `1. 💱 Hyperliquid Season 2 📈\n🎁 تداول perps → مكافآت تصل $100k+\n🔗 hyperliquid.xyz\n\n`;
    message += `2. 👛 MetaMask Rewards 🤑\n🎁 نقاط من swaps + bridging + perps + mUSD\n🔗 metamask.io\n\n`;
    message += `3. 🌉 Base Ecosystem 🚀\n🎁 فارم عبر Aerodrome, Uniswap, Aave\n🔗 base.org\n\n`;
    message += `4. 🔗 LayerZero V2 🪂\n🎁 نقاط من cross-chain transactions\n🔗 layerzero.network\n\n`;
    message += `5. 🖼️ OpenSea Rewards 🎨\n🎁 نقاط من NFT trading + listing\n🔗 opensea.io\n\n`;
    message += `6. 💱 Aster Perps DEX 📈\n🎁 تداول perps → نقاط عالية (CZ backed)\n🔗 aster.exchange\n\n`;

    // ===== أقوى 5 عملات صاعدة (CoinGecko - أوتوماتيكي) =====
    let gainers = [];
    try {
      const cg = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "price_change_percentage_24h_desc",
            per_page: 5,
            page: 1,
            sparkline: false
          },
          timeout: 12000
        }
      );
      gainers = cg.data || [];
    } catch (err) {
      message += `⚠️🔌 تعذر جلب بيانات CoinGecko مؤقتًا... الإشارة هترجع أقوى! ⚠️🔌\n\n`;
    }

    if (gainers.length > 0) {
      message += `🚀📈💥 أقوى 5 عملات صاعدة اليوم (24h) 💥📈🚀\n\n`;
      gainers.forEach((c, i) => {
        const change = c.price_change_percentage_24h?.toFixed(2) || "0.00";
        const price = c.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "غير متوفر";
        message += `${i + 1}. ₿ ${c.name} (${c.symbol.toUpperCase()}) 🔥\n` +
                   `📊 الصعود: +${change}% 🟢🤑\n` +
                   `💲 السعر: $${price} 💎\n\n`;
      });
    } else {
      message += `⏳🔕 السوق هادئ اليوم... انتظر الانفجار القادم يا نينجا! ⏳🔥\n\n`;
    }

    // ===== الختم =====
    message += `🥷💀🤑 تابعنا يوميًا للألفا الحصري والصفقات السرية!\n`;
    message += `@Mohaway2000 🚀 #CryptoNinjaEG 🥷🤑💰🪂`;

    // ===== إرسال الرسالة =====
    await bot.sendMessage(chatId, message, { disable_web_page_preview: true });
    console.log("تم الإرسال بنجاح يا أسطورة! ✅🚀💀");
  } catch (err) {
    await bot.sendMessage(chatId, "🥷⚡⚠️ عطل سريع... الرسالة هترجع أقوى من الأول! ⚡🥷");
    console.error("خطأ:", err);
  }
})();
