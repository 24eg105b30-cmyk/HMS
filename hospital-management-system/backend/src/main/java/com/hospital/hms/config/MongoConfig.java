package com.hospital.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.hospital.hms.repository")
public class MongoConfig {
    // Spring Boot auto-configures MongoClient and MongoTemplate using spring.data.mongodb.uri
    // which binds to MONGODB_URI environment variable configured in application.properties.
}
