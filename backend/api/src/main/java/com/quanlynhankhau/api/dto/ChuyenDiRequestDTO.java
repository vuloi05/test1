// src/main/java/com/quanlynhankhau/api/dto/ChuyenDiRequestDTO.java

package com.quanlynhankhau.api.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChuyenDiRequestDTO {

    @NotNull(message = "Ngày chuyển đi là bắt buộc")
    private LocalDate ngayChuyenDi;

    @NotBlank(message = "Nơi chuyển đến là bắt buộc")
    private String noiChuyenDen;

    private String lyDoChuyen;

    private String ghiChu;

    @NotBlank(message = "Người khai báo là bắt buộc")
    private String nguoiKhaiBao;
}