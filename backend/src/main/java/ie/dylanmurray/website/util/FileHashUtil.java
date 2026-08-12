package ie.dylanmurray.website.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class FileHashUtil {

    private FileHashUtil() {
    }

    public static String sha256(
            MultipartFile file
    ) throws IOException {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            try (InputStream inputStream = file.getInputStream()) {

                byte[] buffer = new byte[8192];

                int bytesRead;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    digest.update(buffer, 0, bytesRead);
                }
            }

            return toHex(digest.digest());

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }

    private static String toHex(
            byte[] bytes
    ) {

        StringBuilder result = new StringBuilder(
                bytes.length * 2
        );

        for (byte b : bytes) {
            result.append(
                    String.format("%02x", b)
            );
        }

        return result.toString();
    }
}