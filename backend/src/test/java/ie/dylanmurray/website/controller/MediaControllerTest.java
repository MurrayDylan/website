package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.media.MediaResponse;
import ie.dylanmurray.website.security.JwtService;
import ie.dylanmurray.website.service.MediaService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;

import org.springframework.http.MediaType;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import ie.dylanmurray.website.security.SecurityConfig;


@WebMvcTest(MediaController.class)
@Import(SecurityConfig.class)
class MediaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MediaService mediaService;

    /*
     * SecurityConfig creates JwtAuthenticationFilter.
     *
     * JwtAuthenticationFilter requires these dependencies,
     * but @WebMvcTest does not create the real security beans.
     *
     * Therefore they must be mocked for this MVC slice test.
     */
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;


    // =========================================================
    // CHECK HASH
    // =========================================================

    @Test
    void checkHash_returnsMediaWhenHashExists() throws Exception {

        String hash =
                "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

        MediaResponse response =
                org.mockito.Mockito.mock(MediaResponse.class);

        when(mediaService.checkHash(hash))
                .thenReturn(response);

        mockMvc.perform(
                        get("/api/media/hash/{sha256Hash}", hash)
                )
                .andExpect(status().isOk());

        verify(mediaService).checkHash(hash);
    }


    @Test
    void checkHash_returns404WhenHashDoesNotExist() throws Exception {

        String hash =
                "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

        when(mediaService.checkHash(hash))
                .thenReturn(null);

        mockMvc.perform(
                        get("/api/media/hash/{sha256Hash}", hash)
                )
                .andExpect(status().isNotFound());

        verify(mediaService).checkHash(hash);
    }


    // =========================================================
    // UPLOAD
    // =========================================================

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void upload_returns201ForAdmin() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test file contents".getBytes(StandardCharsets.UTF_8)
        );

        String hash =
                "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

        MediaResponse response =
                org.mockito.Mockito.mock(MediaResponse.class);

        when(mediaService.upload(
                any(MultipartFile.class),
                eq(hash)
        )).thenReturn(response);

        mockMvc.perform(
                        multipart("/api/media")
                                .file(file)
                                .param("sha256Hash", hash)
                )
                .andExpect(status().isCreated());

        verify(mediaService).upload(
                any(MultipartFile.class),
                eq(hash)
        );
    }


    @Test
    void upload_requiresAuthentication() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test file contents".getBytes(StandardCharsets.UTF_8)
        );

        String hash =
                "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

        mockMvc.perform(
                        multipart("/api/media")
                                .file(file)
                                .param("sha256Hash", hash)
                )
                .andExpect(status().isUnauthorized());

        verify(
                mediaService,
                never()
        ).upload(
                any(MultipartFile.class),
                any()
        );
    }


    @Test
    @WithMockUser(username = "user", roles = "USER")
    void upload_rejectsNonAdminUser() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test file contents".getBytes(StandardCharsets.UTF_8)
        );

        String hash =
                "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

        mockMvc.perform(
                        multipart("/api/media")
                                .file(file)
                                .param("sha256Hash", hash)
                )
                .andExpect(status().isForbidden());

        verify(
                mediaService,
                never()
        ).upload(
                any(MultipartFile.class),
                any()
        );
    }


    // =========================================================
    // VIEW
    // =========================================================

    @Test
    void view_returnsFileInline() throws Exception {

        Path tempFile =
                Files.createTempFile("media-test-", ".pdf");

        byte[] fileContents =
                "test pdf contents".getBytes(StandardCharsets.UTF_8);

        Files.write(tempFile, fileContents);

        try {

            MediaService.MediaFile mediaFile =
                    new MediaService.MediaFile(
                            tempFile,
                            "test.pdf",
                            "application/pdf"
                    );

            when(mediaService.getFile(1L))
                    .thenReturn(mediaFile);

            mockMvc.perform(
                            get("/api/media/1/view")
                    )
                    .andExpect(status().isOk())
                    .andExpect(
                            content().contentType(
                                    MediaType.APPLICATION_PDF
                            )
                    )
                    .andExpect(
                            content().bytes(fileContents)
                    )
                    .andExpect(
                            header().string(
                                    "Content-Disposition",
                                    org.hamcrest.Matchers.containsString(
                                            "inline"
                                    )
                            )
                    )
                    .andExpect(
                            header().string(
                                    "Content-Disposition",
                                    org.hamcrest.Matchers.containsString(
                                            "test.pdf"
                                    )
                            )
                    );

            verify(mediaService).getFile(1L);

        } finally {

            Files.deleteIfExists(tempFile);
        }
    }


    // =========================================================
    // DOWNLOAD
    // =========================================================

    @Test
    void download_returnsFileAsAttachment() throws Exception {

        Path tempFile =
                Files.createTempFile("media-test-", ".pdf");

        byte[] fileContents =
                "test pdf contents".getBytes(StandardCharsets.UTF_8);

        Files.write(tempFile, fileContents);

        try {

            MediaService.MediaFile mediaFile =
                    new MediaService.MediaFile(
                            tempFile,
                            "test.pdf",
                            "application/pdf"
                    );

            when(mediaService.getFile(1L))
                    .thenReturn(mediaFile);

            mockMvc.perform(
                            get("/api/media/1/download")
                    )
                    .andExpect(status().isOk())
                    .andExpect(
                            content().contentType(
                                    MediaType.APPLICATION_OCTET_STREAM
                            )
                    )
                    .andExpect(
                            content().bytes(fileContents)
                    )
                    .andExpect(
                            header().string(
                                    "Content-Disposition",
                                    org.hamcrest.Matchers.containsString(
                                            "attachment"
                                    )
                            )
                    )
                    .andExpect(
                            header().string(
                                    "Content-Disposition",
                                    org.hamcrest.Matchers.containsString(
                                            "test.pdf"
                                    )
                            )
                    );

            verify(mediaService).getFile(1L);

        } finally {

            Files.deleteIfExists(tempFile);
        }
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void delete_returns204ForAdmin() throws Exception {

        doNothing()
                .when(mediaService)
                .deleteMedia(1L);

        mockMvc.perform(
                        delete("/api/media/1")
                )
                .andExpect(status().isNoContent());

        verify(mediaService)
                .deleteMedia(1L);
    }


    @Test
    void delete_requiresAuthentication() throws Exception {

        mockMvc.perform(
                        delete("/api/media/1")
                )
                .andExpect(status().isUnauthorized());

        verify(
                mediaService,
                never()
        ).deleteMedia(1L);
    }


    @Test
    @WithMockUser(username = "user", roles = "USER")
    void delete_rejectsNonAdminUser() throws Exception {

        mockMvc.perform(
                        delete("/api/media/1")
                )
                .andExpect(status().isForbidden());

        verify(
                mediaService,
                never()
        ).deleteMedia(1L);
    }
}