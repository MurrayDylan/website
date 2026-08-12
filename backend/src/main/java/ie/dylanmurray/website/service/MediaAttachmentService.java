package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.media.MediaAttachmentRequest;
import ie.dylanmurray.website.entity.*;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MediaAttachmentService {

    private final MediaRepository mediaRepository;
    private final ProjectRepository projectRepository;
    private final WorkRepository workRepository;
    private final PageRepository pageRepository;

    private final ProjectMediaRepository projectMediaRepository;
    private final WorkMediaRepository workMediaRepository;
    private final PageMediaRepository pageMediaRepository;

    public MediaAttachmentService(
            MediaRepository mediaRepository,
            ProjectRepository projectRepository,
            WorkRepository workRepository,
            PageRepository pageRepository,
            ProjectMediaRepository projectMediaRepository,
            WorkMediaRepository workMediaRepository,
            PageMediaRepository pageMediaRepository
    ) {
        this.mediaRepository = mediaRepository;
        this.projectRepository = projectRepository;
        this.workRepository = workRepository;
        this.pageRepository = pageRepository;
        this.projectMediaRepository = projectMediaRepository;
        this.workMediaRepository = workMediaRepository;
        this.pageMediaRepository = pageMediaRepository;
    }

    @Transactional
    public void attachToProject(
            Long projectId,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found with id: " + projectId
                                )
                        );

        Media media =
                mediaRepository.findById(mediaId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media not found with id: " + mediaId
                                )
                        );

        if (projectMediaRepository.existsByProjectIdAndMediaId(
                projectId,
                mediaId
        )) {
            throw new IllegalArgumentException(
                    "Media is already attached to this project"
            );
        }

        ProjectMedia projectMedia =
                new ProjectMedia(
                        project,
                        media,
                        request.displayOrder(),
                        request.caption(),
                        request.altText()
                );

        project.addMedia(projectMedia);

        projectMediaRepository.save(projectMedia);
    }

    @Transactional
    public void attachToWork(
            Long workId,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        Work work =
                workRepository.findById(workId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Work experience not found with id: " + workId
                                )
                        );

        Media media =
                mediaRepository.findById(mediaId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media not found with id: " + mediaId
                                )
                        );

        if (workMediaRepository.existsByWorkIdAndMediaId(
                workId,
                mediaId
        )) {
            throw new IllegalArgumentException(
                    "Media is already attached to this work experience"
            );
        }

        WorkMedia workMedia =
                new WorkMedia(
                        work,
                        media,
                        request.displayOrder(),
                        request.caption(),
                        request.altText()
                );

        work.addMedia(workMedia);

        workMediaRepository.save(workMedia);
    }

    @Transactional
    public void attachToPage(
            String slug,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        Page page =
                pageRepository.findBySlug(slug)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Page not found with slug: " + slug
                                )
                        );

        Media media =
                mediaRepository.findById(mediaId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media not found with id: " + mediaId
                                )
                        );

        if (pageMediaRepository.existsByPageIdAndMediaId(
                page.getId(),
                mediaId
        )) {
            throw new IllegalArgumentException(
                    "Media is already attached to this page"
            );
        }

        PageMedia pageMedia =
                new PageMedia(
                        page,
                        media,
                        request.displayOrder(),
                        request.caption(),
                        request.altText()
                );

        page.addMedia(pageMedia);

        pageMediaRepository.save(pageMedia);
    }

    @Transactional
    public void updateProjectAttachment(
            Long projectId,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        ProjectMedia attachment =
                projectMediaRepository
                        .findByProjectIdAndMediaId(
                                projectId,
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        attachment.update(
                request.displayOrder(),
                request.caption(),
                request.altText()
        );
    }

    @Transactional
    public void updateWorkAttachment(
            Long workId,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        WorkMedia attachment =
                workMediaRepository
                        .findByWorkIdAndMediaId(
                                workId,
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        attachment.update(
                request.displayOrder(),
                request.caption(),
                request.altText()
        );
    }

    @Transactional
    public void updatePageAttachment(
            String slug,
            Long mediaId,
            MediaAttachmentRequest request
    ) {

        Page page =
                pageRepository.findBySlug(slug)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Page not found with slug: " + slug
                                )
                        );

        PageMedia attachment =
                pageMediaRepository
                        .findByPageIdAndMediaId(
                                page.getId(),
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        attachment.update(
                request.displayOrder(),
                request.caption(),
                request.altText()
        );
    }

    @Transactional
    public void removeFromProject(
            Long projectId,
            Long mediaId
    ) {

        ProjectMedia attachment =
                projectMediaRepository
                        .findByProjectIdAndMediaId(
                                projectId,
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        projectMediaRepository.delete(attachment);
    }

    @Transactional
    public void removeFromWork(
            Long workId,
            Long mediaId
    ) {

        WorkMedia attachment =
                workMediaRepository
                        .findByWorkIdAndMediaId(
                                workId,
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        workMediaRepository.delete(attachment);
    }

    @Transactional
    public void removeFromPage(
            String slug,
            Long mediaId
    ) {

        Page page =
                pageRepository.findBySlug(slug)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Page not found with slug: " + slug
                                )
                        );

        PageMedia attachment =
                pageMediaRepository
                        .findByPageIdAndMediaId(
                                page.getId(),
                                mediaId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Media attachment not found"
                                )
                        );

        pageMediaRepository.delete(attachment);
    }
}