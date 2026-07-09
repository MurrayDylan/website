package ie.dylanmurray.website.exception;

import java.time.LocalDateTime;

public class ApiError {


    private LocalDateTime timestamp;
    private int status;
    private String message;


    public ApiError(
            LocalDateTime timestamp,
            int status,
            String message
    ) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}