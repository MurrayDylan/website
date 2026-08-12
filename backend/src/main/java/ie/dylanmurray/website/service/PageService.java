package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.page.PageRequest;
import ie.dylanmurray.website.dto.page.PageResponse;
import ie.dylanmurray.website.entity.Page;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.PageMapper;
import ie.dylanmurray.website.repository.PageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final PageMapper pageMapper;

    public PageService(PageRepository pageRepository, PageMapper pageMapper) {
        this.pageRepository = pageRepository;
        this.pageMapper = pageMapper;
    }

    @Transactional(readOnly = true)
    public PageResponse getPageBySlug(String slug) {
        Page page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with slug: " + slug));
        return pageMapper.toResponse(page);
    }

    @Transactional(readOnly = true)
    public List<PageResponse> getAllPages() {
        return pageRepository.findAll().stream()
                .map(pageMapper::toResponse)
                .toList();
    }

    @Transactional
    public PageResponse createPage(PageRequest request) {
        if (pageRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Page already exists with slug: " + request.slug());
        }

        Page page = new Page(
                request.slug(),
                request.title(),
                request.subtitle(),
                request.layoutType(),
                request.content(),
                request.metadata()
        );

        Page saved = pageRepository.save(page);
        return pageMapper.toResponse(saved);
    }

    @Transactional
    public PageResponse updatePage(String slug, PageRequest request) {
        Page page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with slug: " + slug));

        page.update(
                request.title(),
                request.subtitle(),
                request.layoutType(),
                request.content(),
                request.metadata()
        );

        return pageMapper.toResponse(page);
    }

    @Transactional
    public void deletePage(String slug) {
        Page page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with slug: " + slug));
        pageRepository.delete(page);
    }
}