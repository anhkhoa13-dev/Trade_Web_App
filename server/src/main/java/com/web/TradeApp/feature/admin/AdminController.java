package com.web.TradeApp.feature.admin;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.TradeApp.feature.admin.dto.CoinFeeUpdateRequest;
import com.web.TradeApp.feature.admin.service.AdminCoinService;
import com.web.TradeApp.feature.admin.service.AdminService;
import com.web.TradeApp.feature.coin.dto.AssetResponse;
import com.web.TradeApp.feature.coin.entity.Wallet;
import com.web.TradeApp.feature.coin.service.WalletService;
import com.web.TradeApp.feature.common.Annotation.ApiMessage;
import com.web.TradeApp.feature.common.response.ResultPaginationResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// already authorize role in securityConfig
@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminCoinService adminCoinService;
    private final AdminService adminService;
    private final WalletService walletService;

    // @PostMapping("/coins/deposit")
    // @ApiMessage("Coin deposited successfully")
    // public ResponseEntity<CoinDepositResponse> depositCoin(
    // @Valid @RequestBody CoinDepositRequest request) {

    // CoinDepositResponse response = adminCoinService.depositCoin(request);
    // return ResponseEntity.ok(response);
    // }

    // @PostMapping("/coins/withdraw")
    // @ApiMessage("Coin withdrew successfully")
    // public ResponseEntity<CoinWithdrawResponse> withdrawCoin(
    // @Valid @RequestBody CoinWithdrawRequest request) {

    // CoinWithdrawResponse response = adminCoinService.withdrawCoin(request);
    // return ResponseEntity.ok(response);
    // }

    @GetMapping("/assets")
    @ApiMessage("Admin assets fetched successfully")
    public ResponseEntity<AssetResponse> getAdminAssets() {
        Wallet adminWallet = adminService.getAdminWallet();
        AssetResponse assets = walletService.getAssetTotal(adminWallet.getUser().getId());
        return ResponseEntity.ok(assets);
    }

    @PutMapping("/coins/fees")
    @ApiMessage("Coin fees updated successfully")
    public ResponseEntity<Void> updateCoinFees(@Valid @RequestBody CoinFeeUpdateRequest request) {
        adminCoinService.updateCoinFees(request);
        return ResponseEntity.ok().build();
    }

    // @GetMapping("/coins")
    // @ApiMessage("Coins fetched successfully")
    // public ResponseEntity<ResultPaginationResponse> getAllCoins(
    // Pageable pageable) {
    // ResultPaginationResponse result = adminCoinService.getAllCoins(pageable);
    // return ResponseEntity.status(HttpStatus.OK).body(result);
    // }
}
