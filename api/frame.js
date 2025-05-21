const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let currentPlayer = 'X';

function checkWinner() {
    // Проверка строк
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            return board[i][0];
        }
    }
    
    // Проверка столбцов
    for (let j = 0; j < 3; j++) {
        if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
            return board[0][j];
        }
    }
    
    // Проверка диагоналей
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2];
    }
    
    return null;
}

export default async function handler(req) {
    if (req.method === 'POST') {
        const { untrustedData } = await req.json();
        const buttonIndex = untrustedData.buttonIndex;
        
        // Определяем позицию
        const positions = [
            [0, 0], [0, 1], [0, 2],
            [1, 0], [1, 1], [1, 2],
            [2, 0], [2, 1], [2, 2]
        ];
        
        const [i, j] = positions[buttonIndex - 1];
        
        // Делаем ход
        if (!board[i][j]) {
            board[i][j] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
        
        // Проверяем победителя
        const winner = checkWinner();
        
        return new Response(JSON.stringify({
            type: 'frame',
            frame: {
                version: 'vNext',
                image: `https://raw.githubusercontent.com/bottov/tic/main/xo.png?t=${Date.now()}`,
                buttons: [
                    { label: "1 (Top-Left)", action: "post" },
                    { label: "2 (Top-Mid)", action: "post" },
                    { label: "3 (Top-Right)", action: "post" },
                    { label: "4 (Mid-Left)", action: "post" }
                ],
                postUrl: `https://bottov.github.io/tic/api/frame`
            }
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } else {
        return new Response(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta property="fc:frame" content="vNext">
                    <meta property="fc:frame:image" content="https://raw.githubusercontent.com/bottov/tic/main/xo.png">
                    <meta property="fc:frame:button:1" content="1 (Top-Left)">
                    <meta property="fc:frame:button:2" content="2 (Top-Mid)">
                    <meta property="fc:frame:button:3" content="3 (Top-Right)">
                    <meta property="fc:frame:button:4" content="4 (Mid-Left)">
                </head>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
            status: 200
        });
    }
}
