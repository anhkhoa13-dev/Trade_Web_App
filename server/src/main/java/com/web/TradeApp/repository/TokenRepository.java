package com.web.TradeApp.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.TradeApp.model.user.Token;
import com.web.TradeApp.model.user.User;
import com.web.TradeApp.model.user.UserEnum.TokenType;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    Optional<Token> findByTokenAndType(String token, TokenType type);

    Optional<Token> findByUserAndType(User user, TokenType type);

    void deleteAllByUser(User user);
}
