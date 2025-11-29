package com.web.TradeApp.feature.coin.service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class CoinGeckoClient {
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

    private static final String COINGECKO_PRICE_URL = COINGECKO_BASE_URL + "/simple/price?ids=%s&vs_currencies=usd";

    public boolean isExists(String coinGeckoId) {
        String url = COINGECKO_BASE_URL + "/coins/" + coinGeckoId;
        try {
            restTemplate.getForObject(url, Object.class);
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public BigDecimal getCurrentPrice(String coinGeckoId) {
        try {
            String url = String.format(COINGECKO_PRICE_URL, coinGeckoId);
            Map<String, Map<String, Object>> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey(coinGeckoId)) {
                Object priceObj = response.get(coinGeckoId).get("usd");

                if (priceObj instanceof Number) {
                    return BigDecimal.valueOf(((Number) priceObj).doubleValue());
                }

                throw new RuntimeException("Invalid price format from CoinGecko: " + priceObj);
            }

            throw new RuntimeException("Failed to fetch price for: " + coinGeckoId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching price from CoinGecko: " + e.getMessage(), e);
        }
    }
}
