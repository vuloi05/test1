// src/main/java/com/quanlynhankhau/api/dto/KhaiTuRequestDTO.java

package com.quanlynhankhau.api.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KhaiTuRequestDTO {

    @NotNull(message = "Ngày mất là bắt buộc")
    private LocalDate ngayMat;

    private String noiMat;

    private String nguyenNhanMat;

    private String ghiChu;

    @NotBlank(message = "Người khai báo là bắt buộc")
    private String nguoiKhaiBao;
}