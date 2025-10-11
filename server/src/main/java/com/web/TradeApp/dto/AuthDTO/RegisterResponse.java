package com.web.TradeApp.dto.AuthDTO;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterResponse {
    private UUID id;
    private String email;
    private String urlToken;
    private Instant createdAt;
}
