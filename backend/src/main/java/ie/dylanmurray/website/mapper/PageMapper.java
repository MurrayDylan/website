package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.page.PageResponse;
import ie.dylanmurray.website.entity.Page;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PageMapper {

    private final PageMediaMapper pageMediaMapper;

    public PageMapper(PageMediaMapper pageMediaMapper) {
        this.pageMediaMapper = pageMediaMapper;
    }

    public PageResponse toResponse(Page page) {
        return new PageResponse(
                page.getId(),
                page.getSlug(),
                page.getTitle(),
                page.getSubtitle(),
                page.getLayoutType(),
                page.getContent(),
                page.getMetadata(),
                page.getMedia()
                        .stream()
                        .map(pageMediaMapper::toResponse)
                        .collect(Collectors.toList()),
                page.getUpdatedAt()
        );
    }
}