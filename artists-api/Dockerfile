# Build stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace/app

COPY gradlew .
COPY gradle/wrapper gradle/wrapper
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

COPY src src
RUN ./gradlew clean build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /workspace/app/build/libs/*.jar app.jar

EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]