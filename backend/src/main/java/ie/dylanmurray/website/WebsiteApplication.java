package ie.dylanmurray.website;

import ie.dylanmurray.website.config.MediaStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(MediaStorageProperties.class)
public class WebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				WebsiteApplication.class,
				args
		);
	}
}