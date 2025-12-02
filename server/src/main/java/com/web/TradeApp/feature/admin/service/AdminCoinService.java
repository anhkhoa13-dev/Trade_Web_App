package com.web.TradeApp.feature.admin.service;

import org.springframework.data.domain.Pageable;

import com.web.TradeApp.feature.admin.dto.CoinDepositRequest;
import com.web.TradeApp.feature.admin.dto.CoinDepositResponse;
import com.web.TradeApp.feature.admin.dto.CoinWithdrawRequest;
import com.web.TradeApp.feature.admin.dto.CoinWithdrawResponse;
import com.web.TradeApp.feature.common.response.ResultPaginationResponse;

public interface AdminCoinService {
    CoinDepositResponse depositCoin(CoinDepositRequest request);

    CoinWithdrawResponse withdrawCoin(CoinWithdrawRequest request);

    ResultPaginationResponse getAllCoins(Pageable pageable);

}
