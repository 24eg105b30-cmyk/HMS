# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Grant execution rights to the maven wrapper
RUN chmod +x ./mvnw

# Download dependencies in advance for caching
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build jar
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy compiled jar from builder stage
COPY --from=builder /app/target/hospital-management-system-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render sets $PORT dynamically)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
