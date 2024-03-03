import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { RestClientV5 } from 'bybit-api/lib/rest-client-v5';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

const client = new RestClientV5({
	key: process.env.BYBIT_API_KEY,
	secret: process.env.BYBIT_API_SECRET
});

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173'
	})
);

app.post('/place-order', (req: Request, res: Response) => {
	const data = req.body;
	placeOrder(data.positionType, data.positionSize, data.entry, data.stopLoss, data.takeProfit);
	res.send({ status: 'Ok' });
});

app.get('/balance', (_: Request, res: Response) => {
	client
		.getWalletBalance({ accountType: 'CONTRACT', coin: 'USDT' })
		.then((result) => {
			const availableBalance = result.result.list[0].coin[0].availableToWithdraw;
			res.send({ balance: availableBalance });
		})
		.catch((err) => {
			console.error('getAccountInfo error: ', err);
		});
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

export const placeOrder = (
	positionType: string,
	positionSize: number,
	entry: number,
	stopLoss: number,
	takeProfit: number
) => {
	client
		.submitOrder({
			category: 'linear',
			symbol: 'BTCUSDT',
			side: positionType == 'Long' ? 'Buy' : 'Sell',
			orderType: 'Limit',
			qty: positionSize.toString(),
			price: entry.toString(),
			timeInForce: 'PostOnly',
			orderLinkId: 'derivatives-' + entry.toString() + Date.now().toString(),
			stopLoss: stopLoss.toString()
		})
		.then((response) => {
			console.log(response);
			placeTakeProfit(positionType, positionSize, entry, takeProfit);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const placeTakeProfit = (
	positionType: string,
	positionSize: number,
	entry: number,
	takeProfit: number
) => {
	client
		.submitOrder({
			category: 'linear',
			symbol: 'BTCUSDT',
			side: positionType == 'Long' ? 'Sell' : 'Buy',
			orderType: 'Limit',
			qty: positionSize.toString(),
			price: takeProfit.toString(),
			timeInForce: 'PostOnly',
			orderLinkId: 'derivatives-' + entry.toString() + Date.now().toString() + '-TP',
			triggerBy: 'LastPrice',
			triggerPrice: entry.toString(),
			triggerDirection: positionType == 'Long' ? 2 : 1
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.error(error);
		});
};
