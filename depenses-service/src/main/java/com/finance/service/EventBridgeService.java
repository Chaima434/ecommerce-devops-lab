package com.finance.service;

import com.finance.model.Transaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.eventbridge.EventBridgeClient;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequest;
import software.amazon.awssdk.services.eventbridge.model.PutEventsRequestEntry;
import software.amazon.awssdk.services.eventbridge.model.PutEventsResponse;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class EventBridgeService {

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Value("${eventbridge.bus.name:finmanage-bus}")
    private String eventBusName;

    private EventBridgeClient eventBridgeClient;

    @PostConstruct
    public void init() {
        this.eventBridgeClient = EventBridgeClient.builder()
                .region(Region.of(awsRegion))
                .build();
    }

    @PreDestroy
    public void destroy() {
        if (eventBridgeClient != null) {
            eventBridgeClient.close();
        }
    }

    public void publishTransactionEvent(Transaction transaction) {
        try {
            String detail = String.format(
                "{\"transactionId\": %d, \"montant\": %.2f, \"description\": \"%s\", \"type\": \"%s\"}",
                transaction.getId(),
                transaction.getMontant(),
                transaction.getDescription() != null ? transaction.getDescription().replace("\"", "\\\"") : "",
                transaction.getType() != null ? transaction.getType().name() : ""
            );

            PutEventsRequestEntry requestEntry = PutEventsRequestEntry.builder()
                    .eventBusName(eventBusName)
                    .source("com.finance.depenses")
                    .detailType("TransactionCreated")
                    .detail(detail)
                    .build();

            PutEventsRequest putEventsRequest = PutEventsRequest.builder()
                    .entries(requestEntry)
                    .build();

            PutEventsResponse response = eventBridgeClient.putEvents(putEventsRequest);
            System.out.println("Published event to EventBridge successfully: " + response.toString());
        } catch (Exception e) {
            System.err.println("Failed to publish event to EventBridge: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
