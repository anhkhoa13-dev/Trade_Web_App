package com.web.TradeApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.TradeApp.dto.CoinDTO.CoinDepositRequest;
import com.web.TradeApp.dto.CoinDTO.CoinDepositResponse;
import com.web.TradeApp.service.interfaces.AdminCoinService;
import com.web.TradeApp.utils.Annotation.ApiMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// already authorize role in securityConfig
@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminCoinService adminCoinService;

    @PostMapping("/coins/deposit")
    @ApiMessage("Coin added successfully")
    public ResponseEntity<CoinDepositResponse> depositCoin(
            @Valid @RequestBody CoinDepositRequest request) {

        CoinDepositResponse response = adminCoinService.depositCoin(request);
        return ResponseEntity.ok(response);
    }
}
