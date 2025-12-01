import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("التوكين أو الـ chat id ناقصين!");
  process.exit(1);
}

const bot = new TelegramBot(token);

let message = `ألفا يومية من CryptoNinjaEG 🥷\n`;
message += `التاريخ: ${new Date().toLocaleDateString('ar-EG')}\n\n`;

async function main() {
  try {
    const airdropRes = await axios.get('https://api.airdropalert.com/v1/airdrop?status=active', { timeout: 8000 }).catch(() => ({ data: { airdrops: [] } }));
    const airdrops = airdropRes.data.airdrops || [];

    if (airdrops.length === 0) {
      message += "لا يوجد إيردروبات جديدة الآن، نراقب كل ساعة ⏳\n\n";
    } else {
      message += "أفضل إيردروبات اليوم:\n";
      airdrops.slice(0, 6).forEach((a, i) => {
        message += `${i+1}. ${a.title || a.name || "مشروع جديد"}\n`;
        message += `المكافأة: ${a.reward || 'غير محدد'}\n`;
        message += `الرابط: ${a.link || 'غير متوفر'}\n\n`;
      });
    }

    const cg = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_24h_desc&per_page=5&page=1');
    message += "أقوى 5 عملات صاعدة اليوم:\n";
    cg.data.forEach((c, i) => {
      message += `${i+1}. ${c.name} (${c.symbol.toUpperCase()})\n+${c.price_change_percentage_24h.toFixed(2)}%   |   السعر: $${c.current_price}\n\n`;
    });

    message += "تابعنا: @Mohaway2000\n#CryptoNinjaEG";

    await bot.sendMessage(chatId, message, { disable_web_page_preview: true });
    console.log("تم الإرسال بنجاح!");
  } catch (err) {
    await bot.sendMessage(chatId, "حصل مشكلة مؤقتة، الإيردروب راجع بعد ساعة 🥷");
    console.error(err.message);
  }
}

main();
