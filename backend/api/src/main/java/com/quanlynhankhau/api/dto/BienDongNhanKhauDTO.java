// src/main/java/com/quanlynhankhau/api/dto/BienDongNhanKhauDTO.java

package com.quanlynhankhau.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BienDongNhanKhauDTO {
    private Long id;
    private Long nhanKhauId;
    private String hoTenNhanKhau;
    private String cmndCccd;
    private String loaiBienDong;
    private String loaiBienDongDisplay;
    private LocalDate ngayBienDong;
    private String noiChuyen;
    private String lyDo;
    private String ghiChu;
    private String nguoiThucHien;
    private LocalDateTime createdAt;
}