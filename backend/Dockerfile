FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY . .

RUN ./mvnw clean install -DskipTests

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
