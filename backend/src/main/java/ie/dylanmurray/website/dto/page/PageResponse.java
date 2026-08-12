package ie.dylanmurray.website.dto.page;

import ie.dylanmurray.website.dto.pagemedia.PageMediaResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record PageResponse(

        Long id,

        String slug,

        String title,

        String subtitle,

        String layoutType,

        String content,

        Map<String, Object> metadata,

        List<PageMediaResponse> media,

        LocalDateTime updatedAt

) {}