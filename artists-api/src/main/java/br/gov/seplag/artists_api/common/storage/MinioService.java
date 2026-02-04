package br.gov.seplag.artists_api.common.storage;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import io.minio.*;
import io.minio.http.Method;

@Service
public class MinioService {

    private final MinioClient minioClient;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public String upload(
            String bucket,
            String objectName,
            InputStream inputStream,
            String contentType) throws Exception {

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .stream(inputStream, -1, 10 * 1024 * 1024)
                        .contentType(contentType)
                        .build());

        return objectName;
    }

    public String generatePresignedUrl(String bucket, String objectName) throws Exception {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucket)
                        .object(objectName)
                        .expiry(30, TimeUnit.MINUTES)
                        .build());
    }
}
