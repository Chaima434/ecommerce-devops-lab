FROM maven:3.9-eclipse-temurin-17-alpine AS construction
WORKDIR /application
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /application
RUN addgroup -S application && adduser -S application -G application
USER application
COPY --from=construction /application/target/*.jar application.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "application.jar"]
