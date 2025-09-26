package com.web.TradeApp.service.interfaces;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.web.TradeApp.dto.UserDTO.ProfileResponse;
import com.web.TradeApp.dto.UserDTO.ProfileUpdateRequest;

public interface UserProfileService {
    ProfileResponse getProfile(UUID userId);

    ProfileResponse updateProfile(UUID userId, ProfileUpdateRequest req);

    ProfileResponse uploadAvatar(UUID userId, MultipartFile file);
}
