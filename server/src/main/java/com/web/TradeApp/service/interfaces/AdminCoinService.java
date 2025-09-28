package com.web.TradeApp.service.interfaces;

import com.web.TradeApp.dto.CoinDTO.CoinDepositRequest;
import com.web.TradeApp.dto.CoinDTO.CoinDepositResponse;

public interface AdminCoinService {
    CoinDepositResponse depositCoin(CoinDepositRequest request);
}
