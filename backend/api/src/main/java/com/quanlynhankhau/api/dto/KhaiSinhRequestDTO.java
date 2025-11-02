// src/main/java/com/quanlynhankhau/api/dto/KhaiSinhRequestDTO.java

package com.quanlynhankhau.api.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KhaiSinhRequestDTO {

    @NotBlank(message = "Họ tên là bắt buộc")
    private String hoTen;

    @NotNull(message = "Ngày sinh là bắt buộc")
    private LocalDate ngaySinh;

    @NotBlank(message = "Giới tính là bắt buộc")
    private String gioiTinh;

    private String noiSinh;

    @NotBlank(message = "Quan hệ với chủ hộ là bắt buộc")
    private String quanHeVoiChuHo;

    private String hoTenCha;
    private String hoTenMe;

    private String ghiChu;

    @NotBlank(message = "Người khai báo là bắt buộc")
    private String nguoiKhaiBao;
}
