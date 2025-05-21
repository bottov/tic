export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { untrustedData } = req.body;
    const buttonIndex = untrustedData.buttonIndex;

    // Логика игры (обновление доски, проверка победы и т. д.)
    const newBoard = updateGame(buttonIndex); 

    res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: generateNewBoardImage(newBoard), // Генерация картинки
        buttons: [
          { label: "1", action: "post" },
          { label: "2", action: "post" },
          // ...
        ],
        postUrl: 'https://your-app.vercel.app/api/frame'
      }
    });
  } else {
    // Первый запуск Frame
    res.status(200).setHeader('Content-Type', 'text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="https://i.imgur.com/JCv0x61.png">
          <meta property="fc:frame:button:1" content="Начать игру">
        </head>
      </html>
    `);
  }
}
