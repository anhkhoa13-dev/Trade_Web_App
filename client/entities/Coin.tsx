export interface Coin {
    id: string
    symbol: string
    name: string
    image: string
    price: number
    changePercent: number
    marketCap: number
    volume24h: number
    lastUpdated: string
}

export const mockCoins: Coin[] = [
    {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        price: 67187.33,
        changePercent: 3.63,
        marketCap: 1317802988326,
        volume24h: 31260929299,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
    {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        price: 3256.45,
        changePercent: -1.25,
        marketCap: 398562349002,
        volume24h: 19823900000,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
    {
        id: "dogecoin",
        symbol: "DOGE",
        name: "Dogecoin",
        image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
        price: 0.1423,
        changePercent: 5.88,
        marketCap: 20560493850,
        volume24h: 482350000,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
    {
        id: "solana",
        symbol: "SOL",
        name: "Solana",
        image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        price: 185.67,
        changePercent: 2.34,
        marketCap: 82190349504,
        volume24h: 3084395300,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
    {
        id: "cardano",
        symbol: "ADA",
        name: "Cardano",
        image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        price: 0.589,
        changePercent: -0.94,
        marketCap: 20489503000,
        volume24h: 1230940000,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
    {
        id: "tron",
        symbol: "TRX",
        name: "TRON",
        image: "https://assets.coingecko.com/coins/images/1094/large/tron.png",
        price: 0.105,
        changePercent: 1.67,
        marketCap: 9374200000,
        volume24h: 359200000,
        lastUpdated: "2025-11-05T10:00:00Z",
    },
]
