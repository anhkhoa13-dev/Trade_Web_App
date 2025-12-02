package com.web.TradeApp.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.web.multipart.MultipartFile;

import com.web.TradeApp.exception.FunctionErrorException;

import lombok.experimental.UtilityClass;

@UtilityClass
public class FileUploadUtil {
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    public static final String IMAGE_PATTERN = "([^\\s]+(\\.(?i)(jpg|jpeg|png|gif|bmp|webp))$)";
    public static final String DATE_FORMAT = "yyyyMMddHHmmss";
    public static final String FILE_NAME_FORMAT = "%s_%s";

    public static boolean isAllowedExtension(final String filename, final String pattern) {
        final Matcher matcher = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(filename);
        return matcher.matches();
    }

    public static void assertAllowed(MultipartFile file, String pattern) {
        final long size = file.getSize();
        if (size > MAX_FILE_SIZE) {
            throw new FunctionErrorException("Max file size is 2MB");
        }
        final String fileName = file.getOriginalFilename();
        // final String extension = fileName.substring(fileName.lastIndexOf(".") +
        // 1).toLowerCase();

        if (!isAllowedExtension(fileName, pattern)) {
            throw new FunctionErrorException("Only jpg, png, gif, bmp files are allowed");
        }
    }

    public static String getFileName(final String name) {
        final DateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        final String data = dateFormat.format(System.currentTimeMillis());
        return String.format(FILE_NAME_FORMAT, name, data);
    }
}
