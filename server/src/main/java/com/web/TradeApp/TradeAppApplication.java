package com.web.TradeApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TradeAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradeAppApplication.class, args);
	}

}
