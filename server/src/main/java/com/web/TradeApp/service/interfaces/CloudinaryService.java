package com.web.TradeApp.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import com.web.TradeApp.dto.CloudinaryDto;

public interface CloudinaryService {
    CloudinaryDto uploadFile(final MultipartFile file, final String fileName, final String paths);

    void deleteFile(final String publicId);
}
