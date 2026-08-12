package ie.dylanmurray.website.util;

public final class Sha256Validator {

    private Sha256Validator() {
    }

    public static boolean isValid(
            String hash
    ) {

        return hash != null
                && hash.matches(
                "^[a-fA-F0-9]{64}$"
        );
    }
}