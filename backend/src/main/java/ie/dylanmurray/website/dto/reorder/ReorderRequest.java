package ie.dylanmurray.website.dto.reorder;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReorderRequest {
    @NotEmpty(message = "IDs list cannot be empty")
    private List<Long> ids;

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}