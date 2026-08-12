package ie.dylanmurray.website.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "layout_templates")
public class LayoutTemplate {

    @Id
    @Column(name = "layout_type")
    private String layoutType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "default_metadata", columnDefinition = "jsonb")
    private Map<String, Object> defaultMetadata;

    @Column(name = "default_content", columnDefinition = "TEXT")
    private String defaultContent;

    public LayoutTemplate() {}

    public LayoutTemplate(String layoutType, Map<String, Object> defaultMetadata, String defaultContent) {
        this.layoutType = layoutType;
        this.defaultMetadata = defaultMetadata;
        this.defaultContent = defaultContent;
    }

    public String getLayoutType() {
        return layoutType;
    }

    public void setLayoutType(String layoutType) {
        this.layoutType = layoutType;
    }

    public Map<String, Object> getDefaultMetadata() {
        return defaultMetadata;
    }

    public void setDefaultMetadata(Map<String, Object> defaultMetadata) {
        this.defaultMetadata = defaultMetadata;
    }

    public String getDefaultContent() {
        return defaultContent;
    }

    public void setDefaultContent(String defaultContent) {
        this.defaultContent = defaultContent;
    }
}